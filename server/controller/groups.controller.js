const createError = require('http-errors');
const pool = require('../db');

module.exports = {
	getALLGroups: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM lab_groups');
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getGroupByID: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM lab_groups WHERE group_id = $1',
				[id]
			);
			if (rows.length === 0) {
				throw createError(404, 'group not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getStudentsWithoutGroupsByID: async (req, res, next) => {
		try {
			const students = await pool.query(
				'SELECT year_of_study FROM student_view WHERE reg_no = $1',
				[req.payload.aud]
			);
			if (students.rows.length === 0) {
				throw createError(404, 'student not found');
			}
			const year_of_study = students.rows[0].year_of_study;
			console.log(year_of_study);
			const { rows } = await pool.query(
				'SELECT * FROM students_without_groups WHERE year_of_study = $1',
				[year_of_study]
			);
			// if (rows.length === 0) {
			// 	throw createError(404, 'no students found');
			// }
			res.json(rows);
		} catch (error) {
			console.log(error);
			next(error);
		}
	},

	createGroup: async (req, res, next) => {
		try {
			const { group_name } = req.body;
			if (!group_name) {
				throw createError.BadRequest();
			}

			const group_names = await pool.query(
				`SELECT * FROM lab_groups WHERE group_name = $1`,
				[group_name]
			);
			if (group_names.rows.length > 0) {
				throw createError.BadRequest('group name already exists');
			}
			const students = await pool.query(
				'SELECT year_of_study FROM student_view WHERE reg_no = $1',
				[req.payload.aud]
			);
			const year_of_study = students.rows[0].year_of_study;
			const group_ids = await pool.query(
				`SELECT group_id FROM lab_groups WHERE year_of_study = $1`,
				[students.rows[0].year_of_study]
			);
			console.log(group_ids.rows);
			const group_id =
				Math.max.apply(
					Math,
					group_ids.rows.map(function (row) {
						return row.group_id;
					})
				) + 1;

			const { rows } = await pool.query(
				`INSERT INTO lab_groups(group_id,group_name,year_of_study) VALUES ($1,$2,$3) RETURNING *`,
				[group_id, group_name, year_of_study]
			);
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			if (error.code === '23505') {
				return next(createError(400, error.detail));
			}
			next(error);
		}
	},
	addMember: async (req, res, next) => {
		try {
			const { reg_no, group_id } = req.body;
			if (!reg_no || !group_id) {
				throw createError.BadRequest();
			}

			const students = await pool.query(
				`SELECT * FROM student_view WHERE reg_no = $1`,
				[reg_no]
			);
			if (students.rows.length === 0) {
				throw createError.NotFound('student not found');
			}
			const group_check = await pool.query(
				`SELECT * FROM student_view WHERE reg_no = $1 AND group_id IS NULL `,
				[reg_no]
			);
			if (group_check.rows.length === 0) {
				throw createError.NotFound('student is already assigned to a group');
			}

			const { rows } = await pool.query(
				`UPDATE students SET group_id = $1 WHERE reg_no = $2 RETURNING *`,
				[group_id, reg_no]
			);

			res.json(rows);
		} catch (error) {
			console.log(error.message);
			if (error.code === '23505') {
				return next(createError(400, error.detail));
			}
			next(error);
		}
	},
	removeMember: async (req, res, next) => {
		try {
			console.log('remove member', req.body);
			const { reg_no, group_id } = req.body;
			if (!reg_no || !group_id) {
				throw createError.BadRequest();
			}
			const students = await pool.query(
				`SELECT * FROM student_view WHERE reg_no = $1`,
				[reg_no]
			);
			if (students.rows.length === 0) {
				throw createError.NotFound('student not found');
			}
			const { rows } = await pool.query(
				`UPDATE students SET group_id = $1 WHERE reg_no = $2 RETURNING *`,
				[null, reg_no]
			);
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			if (error.code === '23505') {
				return next(createError(400, error.detail));
			}
			next(error);
		}
	},
	editGroup: async (req, res, next) => {
		try {
			res.json('patching...');
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deleteGroup: async (req, res, next) => {
		try {
			res.json('deleting...');
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
