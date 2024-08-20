import asyncHandler from 'express-async-handler'

import prisma from '../../prisma/client.js'

//** Description: Get user's exercises
//** Router: GET /api/exercises
//** Access: Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		where: { userId: req.user.id }
	})

	res.status(200).json(exercises)
})

//** Description: Create user's exercises
//** Router: POST /api/exercises
//** Access: Private
export const createExercise = asyncHandler(async (req, res) => {
	const { name, description, sets, reps, userId, workoutId } = req.body

	// Проверка, существует ли указанный workout
	const workout = await prisma.workout.findUnique({
		where: { id: workoutId }
	})

	if (!workout) {
		return res.status(404).json({ message: 'Workout not found' })
	}

	// Создание нового упражнения и связывание его с воркаутом
	const exercise = await prisma.exercise.create({
		data: {
			name,
			description,
			sets,
			reps,
			workoutId: workout.id,
			userId
		}
	})

	res.status(201).json(exercise)
})

//** Description: Get user's exercise by workout id
//** Router: GET /api/exercises/{{workoutId}}
//** Access: Private
export const getExerciseById = asyncHandler(async (req, res) => {
	const exercise = await prisma.exercise.findUnique({
		where: { id: req.params.id }
	})

	if (!exercise) {
		res.status(404)
		throw new Error('Exercise not found')
	}

	res.status(200).json(exercise)
})

//** Description: Update a specific exercise
//** Router: PUT /api/exercises/:id
//** Access: Private
export const updateExercise = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { name, description, sets, reps, workoutId, userId } = req.body

	// Проверка, существует ли указанное упражнение
	const exercise = await prisma.exercise.findUnique({
		where: { id }
	})

	if (!exercise) {
		return res.status(404).json({ message: 'Exercise not found' })
	}

	// Проверка, существует ли указанный workout
	if (workoutId) {
		const workout = await prisma.workout.findUnique({
			where: { id: workoutId }
		})

		if (!workout) {
			return res.status(404).json({ message: 'Workout not found' })
		}
	}

	// Обновление упражнения
	const updatedExercise = await prisma.exercise.update({
		where: { id },
		data: {
			name,
			description,
			sets,
			reps,
			workoutId,
			userId
		}
	})

	res.status(200).json(updatedExercise)
})

//** Description: Delete a specific exercise
//** Router: DELETE /api/exercises/:id
//** Access: Private
export const deleteExercise = asyncHandler(async (req, res) => {
	const exercise = await prisma.exercise.findUnique({
		where: { id: req.params.id }
	})

	if (!exercise) {
		res.status(404)
		throw new Error('Exercise not found')
	}

	await prisma.exercise.delete({
		where: { id: req.params.id }
	})

	res.status(200).json({ message: 'Exercise deleted successfully' })
})
