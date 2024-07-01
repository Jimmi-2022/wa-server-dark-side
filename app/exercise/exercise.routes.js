import express from 'express'
import { createExercise, deleteExercise, getExerciseById, getExercises } from './exercise.controller.js'
import { protect } from '../middlewares/protect.middleware.js' // Импортируйте мидлвару

const router = express.Router()

router.get('/', protect, getExercises) // Новый маршрут для получения всех упражнений
router.post('/', protect, createExercise)
router.get('/:id', protect, getExerciseById)
router.delete('/:id', protect, deleteExercise)

export default router

