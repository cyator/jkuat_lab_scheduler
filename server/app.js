require('dotenv').config();
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(
	cors({
		origin: process.env.ORIGIN,
	})
);
if (process.env.NODE_ENV === 'development') {
	app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/groups', require('./routes/groups.routes'));
app.use('/students', require('./routes/students.routes'));
app.use('/units', require('./routes/units.routes'));
app.use('/uploads', require('./routes/uploads.routes'));
app.use('/practicals', require('./routes/practicals.routes'));
app.use('/labtechs', require('./routes/labtechs.routes'));
app.use('/lecturers', require('./routes/lecturers.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/equipment', require('./routes/equipment.routes'));
app.use('/reports', require('./routes/reports.routes'));

app.use(express.static('./uploads'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError.NotFound());
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		status: err.status || 500,
		message: err.message || 'Internal Server Error',
	});
});

module.exports = app;
