import express from 'express'
import { createWorkout, deleteAllWorkouts, deleteWorkout, getWorkoutById, getWorkouts } from './workout.controller.js'
import { protect } from '../middlewares/authMiddleware.js' // Импортируйте мидлвару

const router = express.Router()

router.get('/', protect, getWorkouts) // Примените мидлвару protect
router.post('/', protect, createWorkout) // Примените мидлвару protect
router.get('/:id', protect, getWorkoutById)
router.delete('/:id', protect, deleteWorkout) // Маршрут для удаления тренировки
router.delete('/', protect, deleteAllWorkouts) // Маршрут для удаления всех тренировок

export default router
