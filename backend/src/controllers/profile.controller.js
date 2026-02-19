import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
import { deleteAccount, getProfile, updateAvatar, updateNotificationPreference, updatePassword, upsertProfile } from '../services/profile.service.js';

export const getProfileHandler = async (req, res, next) => {
  try {
    const data = await getProfile(req.user.id);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

export const updateProfileHandler = async (req, res, next) => {
  try {
    const data = await upsertProfile(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

export const updateAvatarHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let avatarUrl = req.file.path || '';

    if (req.file.path && process.env.CLOUDINARY_CLOUD_NAME) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: 'taskflow-avatars' });
      avatarUrl = uploaded.secure_url;
      if (!avatarUrl) throw new Error('Cloudinary upload failed to return secure_url');
      fs.unlink(req.file.path, () => {});
    }

    const data = await updateAvatar(req.user.id, avatarUrl);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

export const updatePasswordHandler = async (req, res, next) => {
  try {
    await updatePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.json({ success: true });
  } catch (e) { next(e); }
};

export const deleteAccountHandler = async (req, res, next) => {
  try {
    await deleteAccount(req.user.id);
    res.json({ success: true });
  } catch (e) { next(e); }
};

export const notificationPreferenceHandler = async (req, res, next) => {
  try {
    const data = await updateNotificationPreference(req.user.id, !!req.body.receiveRealtimeNotifications);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
