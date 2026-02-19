import multer from 'multer';
import { Router } from 'express';
import { deleteAccountHandler, getProfileHandler, notificationPreferenceHandler, updateAvatarHandler, updatePasswordHandler, updateProfileHandler } from '../controllers/profile.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticate);
router.get('/', getProfileHandler);
router.put('/', updateProfileHandler);
router.put('/avatar', upload.single('avatar'), updateAvatarHandler);
router.put('/password', updatePasswordHandler);
router.put('/notification-preferences', notificationPreferenceHandler);
router.delete('/account', deleteAccountHandler);

export default router;
