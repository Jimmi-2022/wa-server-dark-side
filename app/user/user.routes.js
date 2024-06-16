import express from 'express'
import { getUser } from './user.controller.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/:id', protect, getUser)

export default router