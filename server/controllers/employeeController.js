const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const upload = require('../config/upload');
const fs = require('fs/promises');
const { uploadImage, deleteImage } = require('../services/cloudinary');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, department, phone } = req.body;
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    // Public registration always creates a standard teacher account.
    const employee = await Employee.create({ firstName, lastName, email, password, role: 'teacher', department, phone });
    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.status(201).json({ employee: { id: employee._id, firstName, lastName, email, role: employee.role, department, photo: employee.photo }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, phone } = req.body;
    const employee = await Employee.create({ firstName, lastName, email, password, role, department, phone });
    const safeEmployee = employee.toObject();
    delete safeEmployee.password;
    res.status(201).json(safeEmployee);
  } catch (error) {
    res.status(400).json({ error: error.code === 11000 ? 'Email already registered' : error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee || !(await employee.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!employee.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }
    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ employee: { id: employee._id, firstName: employee.firstName, lastName: employee.lastName, email, role: employee.role, photo: employee.photo }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    res.json(employee);
  } catch (error) {
    res.status(404).json({ error: 'Employee not found' });
  }
};

const getAll = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).select('-password').sort({ lastName: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized to update this employee' });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true }).select('-password');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadPhoto = async (req, res) => {
  const temporaryFile = req.file?.path;
  let uploadedImage;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Profile photo must be an image' });
    }
    uploadedImage = await uploadImage(temporaryFile, 'scl-management/profiles', req.file.mimetype);
    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      await deleteImage(uploadedImage.public_id).catch(() => {});
      uploadedImage = null;
      return res.status(404).json({ error: 'Employee not found' });
    }
    const oldPublicId = employee.photoPublicId;
    employee.photo = uploadedImage.secure_url;
    employee.photoPublicId = uploadedImage.public_id;
    await employee.save();
    uploadedImage = null;
    if (oldPublicId) deleteImage(oldPublicId).catch(() => {});
    const safeEmployee = await Employee.findById(employee._id).select('-password');
    res.json({ photo: safeEmployee.photo, employee: safeEmployee });
  } catch (error) {
    if (uploadedImage?.public_id) deleteImage(uploadedImage.public_id).catch(() => {});
    res.status(500).json({ error: error.message });
  } finally {
    if (temporaryFile) await fs.unlink(temporaryFile).catch(() => {});
  }
};

module.exports = { register, login, getProfile, getAll, getById, create, update, remove, uploadPhoto };
