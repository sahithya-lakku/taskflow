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
    const avatarUrl = req.file?.path || req.file?.secure_url || req.file?.filename || '';
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
