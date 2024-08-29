import express from "express";
const router = express.Router();
import {createUser,
        loginUser, 
        logoutCurrentUser,
        getAllUsers,
        getCurrentUserProfile,
        updateCurrentUserProfile,
        deleteUserById,
        getUserById,
        updateUserById
} from '../controllers/userController.js'
import { authenticate, authorizeAdmin } from "../middlewares/authMiddlewares.js";

router.route('/')
        .post(createUser)
        .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post('/logout', logoutCurrentUser)

router
        .route('/profile')
        .get(authenticate, getCurrentUserProfile)
        .put(authenticate, updateCurrentUserProfile);
// ADMIN ROUTE
router
        .route('/:id')
        .delete(authenticate, authorizeAdmin, deleteUserById)
        .get(authenticate, authorizeAdmin, getUserById)
        .put(authenticate, authorizeAdmin, updateUserById)
export default router;