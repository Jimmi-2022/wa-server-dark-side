import express from 'express';
import authRouter from './app/auth/user.routes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import chalk from 'chalk';


// Загружаем переменные окружения из .env файла
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan('dev')); // Логирование HTTP-запросов

/**
 * GET /api
 * Обработчик для корневого маршрута API
 * @param {Object} req - Экземпляр запроса Express
 * @param {Object} res - Экземпляр ответа Express
 */
app.get('/api', (req, res) => {
    res.send('Welcome to the Workout App API');
});

// Маршруты для аутентификации
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(chalk.green(`Server running at http://localhost:${port}`));
});