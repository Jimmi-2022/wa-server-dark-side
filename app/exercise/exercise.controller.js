import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'

// Создание нового упражнения
export const createExercise = asyncHandler(async (req, res) => {
	const { name, description, sets, reps, workoutId } = req.body

	const exercise = await prisma.exercise.create({
		data: {
			name,
			description,
			sets,
			reps,
			workoutId: String(workoutId)
		}
	})

	res.status(201).json(exercise)
})

// Получение всех упражнений для конкретной тренировки
export const getExercises = asyncHandler(async (req, res) => {
	const { workoutId } = req.params

	const exercises = await prisma.exercise.findMany({
		where: { workoutId: String(workoutId) }
	})

	res.status(200).json(exercises)
})