import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config() // Убедитесь, что переменные окружения загружаются

const JWT_KEY = process.env.JWT_KEY

export function generateToken(user) {
	const payload = {
		id: user.id,
		username: user.username
	}

	const options = {
		expiresIn: '30d'
	}

	const token = jwt.sign(payload, JWT_KEY, options)
	return token
}