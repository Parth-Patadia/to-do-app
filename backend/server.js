const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://to-do-app-two-sigma.vercel.app/login'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; 