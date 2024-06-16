import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'
import { v4 as uuidv4 } from 'uuid'

export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		where: { userId: req.user.id }
	})

	res.status(200).json(workouts)
})

export const createWorkout = asyncHandler(async (req, res) => {
	const { title, description, exercises } = req.body

	const workout = await prisma.workout.create({
		data: {
			id: uuidv4(),
			title,
			description,
			userId: req.user.id,
			exercises: {
				create: exercises
			}
		}
	})

	res.status(201).json(workout)
})

export const getWorkoutById = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: req.params.id },
		include: { exercises: true }
	})

	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	res.status(200).json(workout)
})

export const deleteWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: req.params.id }
	})

	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	// Удаляем все упражнения, связанные с этой тренировкой
	await prisma.exercise.deleteMany({
		where: { workoutId: req.params.id }
	})

	// Удаляем тренировку
	await prisma.workout.delete({
		where: { id: req.params.id }
	})

	res.status(200).json({ message: 'Workout deleted successfully' })
})

// Новый контроллер для удаления всех тренировок пользователя
export const deleteAllWorkouts = asyncHandler(async (req, res) => {
	// Удаляем все упражнения, связанные с тренировками пользователя
	await prisma.exercise.deleteMany({
		where: { workout: { userId: req.user.id } }
	})

	// Удаляем все тренировки пользователя
	await prisma.workout.deleteMany({
		where: { userId: req.user.id }
	})

	res.status(200).json({ message: 'All workouts deleted successfully' })
})