const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} = require('../controllers/userController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validatorMiddleware');

router.post('/login', validateLogin, authUser);
router.route('/').post(validateRegister, registerUser).get(protect, superAdmin, getUsers);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route('/:id')
    .delete(protect, superAdmin, deleteUser)
    .get(protect, superAdmin, getUserById)
    .put(protect, superAdmin, updateUser);

module.exports = router;
