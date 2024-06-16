import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'
import { v4 as uuidv4 } from 'uuid'

export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		where: { userId: req.user.id }
	})

	res.status(200).json(exercises)
})

export const createExercise = asyncHandler(async (req, res) => {
	const { name, description, sets, reps, workoutId } = req.body

	const exercise = await prisma.exercise.create({
		data: {
			id: uuidv4(),
			name,
			description,
			sets,
			reps,
			workoutId,
			userId: req.user.id
		}
	})

	res.status(201).json(exercise)
})

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
