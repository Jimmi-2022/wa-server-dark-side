import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config() // Убедитесь, что переменные окружения загружаются

const JWT_KEY = process.env.JWT_KEY

export function generateToken(user) {
	// Проверяем, существует ли секретный ключ
	if (!JWT_KEY) {
		throw new Error('Секретный ключ для JWT не найден в переменных окружения')
	}

	const payload = {
		id: user.id,
		name: user.name,
		email: user.email
	}

	const options = {
		expiresIn: '30d'
	}

	try {
		// Генерируем токен с помощью секретного ключа, полезной нагрузки и опций
		const token = jwt.sign(payload, JWT_KEY, options)
		return token
	} catch (error) {
		// Логируем ошибку и выбрасываем её
		console.error('Ошибка при генерации токена:', error)
		throw new Error('Ошибка при генерации токена')
	}
}
