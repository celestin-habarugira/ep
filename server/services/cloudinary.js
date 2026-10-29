const https = require('https');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const credentials = () => {
  if (!process.env.CLOUDINARY_URL) {
    const error = new Error('CLOUDINARY_URL is not configured');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }
  let cloudinaryUrl;
  try { cloudinaryUrl = new URL(process.env.CLOUDINARY_URL); }
  catch {
    const error = new Error('CLOUDINARY_URL is invalid');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }
  if (cloudinaryUrl.protocol !== 'cloudinary:') {
    const error = new Error('CLOUDINARY_URL must use the cloudinary scheme');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }
  const cloudName = cloudinaryUrl.hostname;
  let apiKey;
  let apiSecret;
  try {
    apiKey = decodeURIComponent(cloudinaryUrl.username);
    apiSecret = decodeURIComponent(cloudinaryUrl.password);
  } catch {
    const error = new Error('CLOUDINARY_URL credentials are invalid');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }
  if (!cloudName || !apiKey || !apiSecret) {
    const error = new Error('CLOUDINARY_URL credentials are incomplete');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }
  return { cloudName, apiKey, apiSecret };
};

const sign = (params, apiSecret) => crypto
  .createHash('sha1')
  .update(`${Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join('&')}${apiSecret}`)
  .digest('hex');

const makeMultipart = (fields, file, filename, mimeType) => {
  const boundary = `----scl-management-${crypto.randomBytes(12).toString('hex')}`;
  const chunks = [];
  for (const [name, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  }
  if (file) {
    const safeFilename = path.basename(filename).replace(/["\r\n]/g, '_');
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${safeFilename}"\r\nContent-Type: ${mimeType}\r\n\r\n`));
    chunks.push(file);
  }
  chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  return { body: Buffer.concat(chunks), boundary };
};

const postForm = (endpoint, fields, file, filename, mimeType) => new Promise((resolve, reject) => {
  const { body, boundary } = makeMultipart(fields, file, filename, mimeType);
  const request = https.request({
    hostname: 'api.cloudinary.com',
    path: endpoint,
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length },
  }, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      let result;
      try { result = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { return reject(new Error('Cloudinary returned an invalid response')); }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(result.error?.message || `Cloudinary request failed (${response.statusCode})`));
      }
      resolve(result);
    });
  });
  request.setTimeout(60_000, () => request.destroy(new Error('Cloudinary request timed out')));
  request.on('error', reject);
  request.end(body);
});

const uploadImage = async (filePath, folder, mimeType = 'application/octet-stream') => {
  const { cloudName, apiKey, apiSecret } = credentials();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp };
  const file = await fs.readFile(filePath);
  try {
    return await postForm(
      `/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { ...params, api_key: apiKey, signature: sign(params, apiSecret) },
      file,
      path.basename(filePath),
      mimeType
    );
  } catch (error) {
    error.code = 'CLOUDINARY_UPSTREAM';
    throw error;
  }
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  const { cloudName, apiKey, apiSecret } = credentials();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  return postForm(
    `/v1_1/${encodeURIComponent(cloudName)}/image/destroy`,
    { ...params, api_key: apiKey, signature: sign(params, apiSecret) },
    null,
    '',
    'application/octet-stream'
  );
};

module.exports = { uploadImage, deleteImage };
