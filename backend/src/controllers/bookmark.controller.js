import { addBookmark, listBookmarks, removeBookmark } from '../services/bookmark.service.js';

export const addBookmarkHandler = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await addBookmark(req.user.id, req.body) }); } catch (e) { next(e); }
};
export const removeBookmarkHandler = async (req, res, next) => {
  try { await removeBookmark(req.user.id, req.params.id); res.json({ success: true }); } catch (e) { next(e); }
};
export const listBookmarksHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await listBookmarks(req.user.id) }); } catch (e) { next(e); }
};
