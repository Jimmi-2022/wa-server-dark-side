import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import workoutRoutes from './app/workout/workout.routes.js'
import exerciseRoutes from './app/exercise/exercise.routes.js'
import userRoutes from './app/user/user.routes.js'
import authRoutes from './app/auth/auth.routes.js'
import { errorHandler, notFound } from './app/middlewares/error.middleware.js'

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

	// Маршруты для аутентификации
	app.use('/api/auth', authRoutes)

	// Маршруты для пользователей
	app.use('/api/users', userRoutes)

	// Маршруты для тренировок
	app.use('/api/workouts', workoutRoutes)

	// Маршруты для упражнений
	app.use('/api/exercises', exerciseRoutes)

	// Обслуживание статических файлов из папки "public"
	app.use(express.static('public'))

	// Обслуживание файлов из папки "uploads"
	app.use('/uploads', express.static('uploads'))

	// Middleware для обработки ненайденных маршрутов
	app.use(notFound)

	// Middleware для обработки ошибок
	app.use(errorHandler)

	app.listen(port, () => {
		console.log(chalk.green(`Server running at http://localhost:${port}`))
	})
}

startServer()
