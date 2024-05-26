// routes/auth.routes.js

import express from 'express'
import { login } from './auth.controller.js'

const router = express.Router()

/**
 * POST /api/auth/login
 * Маршрут для входа пользователя
 * @param {Object} req - Экземпляр запроса Express
 * @param {Object} res - Экземпляр ответа Express
 */
router.post('/login', login)

export default router
