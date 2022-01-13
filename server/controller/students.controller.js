const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { studentSchema } = require('../config/joi');

module.exports = {
	getALLStudents: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM student_view');
			if (rows.length === 0) {
				throw createError(404, 'no students found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getStudentsByYear: async (req, res, next) => {
		try {
			const { reg_no } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM student_view WHERE year_of_study = (SELECT year_of_study FROM student_view WHERE reg_no = $1)',
				[reg_no]
			);
			if (rows.length === 0) {
				throw createError(404, 'no students found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getstudentByID: async (req, res, next) => {
		try {
			const { reg_no } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM student_view WHERE reg_no = $1',
				[reg_no]
			);
			if (rows.length === 0) {
				throw createError(404, 'student not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addstudent: async (req, res, next) => {
		try {
			//validate request
			const validationResult = await studentSchema.validateAsync(req.body);
			const {
				reg_no,
				group_id,
				last_name,
				first_name,
				email,
				year_of_study,
				passcode,
			} = validationResult;
			// check for existing student
			const { rows } = await pool.query(
				'SELECT * FROM student_view WHERE reg_no=$1',
				[reg_no]
			);

			if (rows.length > 0)
				throw createError.Conflict(`${reg_no} is already registered`);
			// insert new user in db
			const hashedPassword = await bcrypt.hash(passcode, 14);
			const student = await pool.query(
				'INSERT INTO students(reg_no,group_id,last_name,first_name,email,year_of_study,passcode) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
				[
					reg_no,
					group_id,
					last_name,
					first_name,
					email,
					year_of_study,
					hashedPassword,
				]
			);
			// sign token and send response
			res.json(student.rows);
		} catch (err) {
			if (err.isJoi === true) err.status = 422;
			next(err);
		}
	},
	editstudent: async (req, res, next) => {
		try {
			res.json('patching...');
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deletestudent: async (req, res, next) => {
		try {
			const { reg_no } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM student_view WHERE reg_no = $1 RETURNING *`,
				[reg_no]
			);
			if (rows.length === 0) {
				throw createError(404, 'student not found');
			}
			const { passcode, ...rest } = rows[0];
			res.json({ ...rest });
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
