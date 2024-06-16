import express from 'express'
import { deleteUser, getUser, getUserById } from './user.controller.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/:id', protect, getUser)
router.get('/:id', protect, getUserById)
router.delete('/:id', protect, deleteUser)

export default router