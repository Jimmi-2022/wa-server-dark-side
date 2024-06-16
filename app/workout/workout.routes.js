import express from 'express'
import { createWorkout, getWorkouts } from './workout.controller.js'
import { protect } from '../middlewares/authMiddleware.js' // Импортируйте мидлвару

const router = express.Router()

router.post('/', protect, createWorkout) // Примените мидлвару protect
router.get('/', protect, getWorkouts) // Примените мидлвару protect

export default router
