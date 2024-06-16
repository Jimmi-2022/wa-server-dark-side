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
