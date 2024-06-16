import express from 'express'
import { createExercise, getExercises } from './exercise.controller.js'
import { protect } from '../middlewares/authMiddleware.js' // Импортируйте мидлвару

const router = express.Router()

router.post('/', protect, createExercise) // Примените мидлвару protect
router.get('/:workoutId', protect, getExercises) // Примените мидлвару protect

export default router

