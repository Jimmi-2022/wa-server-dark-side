import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'

//** Description: Get user's information
//** Router: GET /api/users/:id
//** Access: Private
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

//** Description: Get user by id
//** Router: GET /api/users/:id
//** Access: Private
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

//** Description: Delete user by id
//** Router: DELETE /api/users/:id
//** Access: Private
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

	res
		.status(200)
		.json({ message: 'User and associated workouts deleted successfully' })
})
