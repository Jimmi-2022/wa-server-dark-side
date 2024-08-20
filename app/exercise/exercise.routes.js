import express from 'express'

import { protect } from '../middlewares/protect.middleware.js'

import {
	createExercise,
	deleteExercise,
	getExerciseById,
	getExercises,
	updateExercise
} from './exercise.controller.js'

const router = express.Router()

router.get('/', protect, getExercises)
router.post('/', protect, createExercise)
router.get('/:id', protect, getExerciseById)
router.put('/:id', updateExercise)
router.delete('/:id', deleteExercise)

export default router
