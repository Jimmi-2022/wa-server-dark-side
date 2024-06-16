import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js' // Путь к вашему клиенту Prisma

// Создание новой тренировки
export const createWorkout = asyncHandler(async (req, res) => {
	const { title, description, userId, exercises } = req.body

	// Сначала создаем тренировку
	const workout = await prisma.workout.create({
		data: {
			title,
			description,
			userId: String(userId) // Убедитесь, что userId передается как строка
		}
	})

	// Затем создаем упражнения и связываем их с созданной тренировкой
	if (exercises && exercises.length > 0) {
		await prisma.exercise.createMany({
			data: exercises.map(exercise => ({
				...exercise,
				workoutId: workout.id // Преобразование workoutId в строку
			}))
		})
	}

	res.status(201).json(workout)
})

// Получение всех тренировок
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		include: {
			exercises: true,
			user: true
		}
	})

	res.status(200).json(workouts)
})