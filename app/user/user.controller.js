import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'

// Получение данных пользователя
export const getUser = asyncHandler(async (req, res) => {
	const { id } = req.params

	const user = await prisma.user.findUnique({
		where: { id: id },
		include: { workouts: true }
	})

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	res.status(200).json(user)
})

// Функция для получения пользователя по ID
export const getUserById = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: { id: req.params.id },
		select: { id: true, email: true, name: true }
	})

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	res.status(200).json(user)
})

// Функция для удаления пользователя
export const deleteUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: { id: parseInt(req.params.id) } // Преобразование id в число, если оно строковое
	})

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Удаление всех тренировок пользователя
	await prisma.workout.deleteMany({
		where: { userId: parseInt(req.params.id) }
	})

	// Удаление пользователя
	await prisma.user.delete({
		where: { id: parseInt(req.params.id) }
	})

	res.status(200).json({ message: 'User and associated workouts deleted successfully' })
})
