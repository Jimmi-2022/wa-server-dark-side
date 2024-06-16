import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import prisma from '../../prisma/client.js'
import dotenv from 'dotenv'

dotenv.config() // Убедитесь, что переменные окружения загружаются

const JWT_KEY = process.env.JWT_KEY

const protect = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1]

			// Верификация токена
			const decoded = jwt.verify(token, JWT_KEY)

			// Получение пользователя из базы данных и добавление его в запрос
			req.user = await prisma.user.findUnique({
				where: { id: decoded.id },
				select: { id: true, email: true, name: true } // выберите только необходимые поля
			})

			if (!req.user) {
				res.status(401)
				throw new Error('Not authorized, user not found')
			}

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			throw new Error('Not authorized, token failed')
		}
	} else {
		res.status(401)
		throw new Error('Not authorized, no token')
	}
})

export { protect }
