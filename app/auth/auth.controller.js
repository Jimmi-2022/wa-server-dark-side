import asyncHandler from 'express-async-handler'
import { generateToken } from './token.js'
import prisma from '../../prisma/client.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

// Контроллер для регистрации пользователя
export const registerUser = asyncHandler(async (req, res) => {
	const { email, name, password } = req.body

	// Проверка на наличие пользователя
	const existingUser = await prisma.user.findUnique({
		where: { email }
	})

	if (existingUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Хеширование пароля
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	const user = await prisma.user.create({
		data: {
			id: uuidv4(),
			email,
			name,
			password: hashedPassword // Сохраняем захешированный пароль
		}
	})

	const token = generateToken(user)

	res.status(201).json({
		message: 'User created successfully',
		token: token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name
		}
	})
})

// Контроллер для аутентификации пользователя
export const authenticateUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	// Найдите пользователя по email
	const user = await prisma.user.findUnique({
		where: { email }
	})

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Проверка пароля
	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		res.status(401)
		throw new Error('Invalid password')
	}

	const token = generateToken(user)

	res.status(200).json({
		message: 'Login successful',
		token: token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name
		}
	})
})

// Получение профиля пользователя
export const getProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: { id: true, email: true, name: true }
	})

	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	res.status(200).json(user)
})