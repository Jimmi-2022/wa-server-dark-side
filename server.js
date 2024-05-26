import express from 'express'
import authRouter from './app/auth/auth.routes.js'
import dotenv from 'dotenv'
import chalk from 'chalk'

// Загружаем переменные окружения из .env файла
dotenv.config()

const startServer = async () => {
	const app = express()
	const port = process.env.PORT || 5000

	app.use(express.json())

	// Логирование HTTP-запросов только в режиме разработки
	if (process.env.NODE_ENV === 'development') {
		const morgan = await import('morgan')
		app.use(morgan.default('dev'))
	}

	/**
	 * GET /api
	 * Обработчик для корневого маршрута API
	 * @param {Object} req - Экземпляр запроса Express
	 * @param {Object} res - Экземпляр ответа Express
	 */
	app.get('/', (req, res) => {
		res.send('Welcome to the Workout App API')
	})

	// Маршруты для аутентификации
	app.use('/api/auth', authRouter)

	app.listen(port, () => {
		console.log(chalk.green(`Server running at http://localhost:${port}`))
	})
}

startServer()
