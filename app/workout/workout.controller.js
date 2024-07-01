import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'

//** Description: Get workouts
//** Router: GET /api/workouts
//** Access: Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		where: { userId: req.user.id },
		include: { exercises: true }
	})

	res.status(200).json(workouts)
})

//** Description: Create workout
//** Router: POST /api/workouts
//** Access: Private
export const createWorkout = asyncHandler(async (req, res) => {
	const { title, description, userId, exercises } = req.body

	// Создание воркаута вместе с упражнениями
	const workout = await prisma.workout.create({
		data: {
			title,
			description,
			userId,
			exercises: {
				create: exercises.map(exercise => ({
					...exercise,
					userId // Добавляем userId к каждому упражнению
				}))
			}
		},
		include: {
			exercises: true // Включаем упражнения в возвращаемый ответ
		}
	})

	res.status(201).json(workout)
})

//** Description: Get workout by id
//** Router: GET /api/workouts/:id
//** Access: Private
export const getWorkoutById = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: parseInt(req.params.id) },
		include: { exercises: true }
	})

	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	res.status(200).json(workout)
})


//** Description: Delete workout by id
//** Router: DELETE /api/workouts/:id
//** Access: Private
export const deleteWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: parseInt(req.params.id) }
	})

	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	// Удаляем все упражнения, связанные с этой тренировкой
	await prisma.exercise.deleteMany({
		where: { workoutId: parseInt(req.params.id) }
	})

	// Удаляем тренировку
	await prisma.workout.delete({
		where: { id: parseInt(req.params.id) }
	})

	res.status(200).json({ message: 'Workout deleted successfully' })
})


//** Description: Delete all workouts
//** Router: DELETE /api/workouts
//** Access: Private
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