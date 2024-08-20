import express from 'express'
import {
	authenticateUser,
	getProfile,
	registerUser
} from './auth.controller.js'
import { protect } from '../middlewares/protect.middleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', authenticateUser)
router.get('/profile', protect, getProfile) // Защищенный маршрут для получения профиля пользователя

export default router
