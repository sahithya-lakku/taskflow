import multer from 'multer';
import { Router } from 'express';
import { ApiError } from '../utils/apiError.js';
import { deleteAccountHandler, getProfileHandler, notificationPreferenceHandler, updateAvatarHandler, updatePasswordHandler, updateProfileHandler } from '../controllers/profile.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new ApiError(400, 'Only JPEG and PNG images are allowed'));
    }
    cb(null, true);
  },
});

router.use(authenticate);
router.get('/', getProfileHandler);
router.put('/', updateProfileHandler);
router.put('/avatar', upload.single('avatar'), updateAvatarHandler);
router.put('/password', updatePasswordHandler);
router.put('/notification-preferences', notificationPreferenceHandler);
router.delete('/account', deleteAccountHandler);

export default router;
