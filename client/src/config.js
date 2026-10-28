const API_BASE = (import.meta.env.VITE_API_URL || 'https://ep-0n86.onrender.com').replace(/\/+$/, '');
export const API_URL = API_BASE;
export const API_ENDPOINT = `${API_BASE}/api`;
export const resolveAssetUrl = (asset) => {
  if (!asset) return null;
  if (/^(https?:)?\/\//i.test(asset) || asset.startsWith('data:')) return asset;
  return `${API_URL}${asset.startsWith('/') ? '' : '/'}${asset}`;
};
