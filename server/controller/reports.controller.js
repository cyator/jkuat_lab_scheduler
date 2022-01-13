const createError = require('http-errors');
const pool = require('../db');

module.exports = {
	getALLReports: async (req, res, next) => {
		try {
			const { rows } = await pool.query('SELECT * FROM reports');
			if (rows.length === 0) {
				throw createError(404, 'no reports found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getMarkedReports: async (req, res, next) => {
		try {
			const { lec_id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM report_view WHERE (marks IS NOT NULL AND lec_id = $1)',
				[lec_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'no marked reports found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getPendingReports: async (req, res, next) => {
		try {
			const { lec_id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM report_view WHERE (marks IS NULL AND lec_id = $1)',
				[lec_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'no pending reports found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getReportByID: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM reports WHERE report_id = $1',
				[id]
			);
			if (rows.length === 0) {
				throw createError(404, 'report not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addMarks: async (req, res, next) => {
		try {
			const { marks, report_id } = req.body;
			if (!marks || !report_id) {
				throw createError.BadRequest();
			}

			const groups = await pool.query(
				`SELECT * FROM reports WHERE report_id = $1`,
				[report_id]
			);
			if (groups.rows.length === 0) {
				throw createError.BadRequest('report not found');
			}

			const { rows } = await pool.query(
				`UPDATE reports SET marks = $1 WHERE report_id = $2  RETURNING *`,
				[marks, report_id]
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
	addReport: async (req, res, next) => {
		try {
			const { unit_code, prac_name, reg_no } = req.body;
			if (!unit_code || !prac_name || !reg_no) {
				throw createError.BadRequest();
			}
			if (req.file == undefined) {
				throw createError.BadRequest('No file selected');
			}
			const filename = req.file.filename;
			const units = await pool.query(
				`SELECT * FROM units WHERE unit_code = $1`,
				[unit_code]
			);
			if (units.rows.length === 0) {
				throw createError.BadRequest('please use a valid unit code');
			}
			const groups = await pool.query(
				`SELECT group_id FROM student_view INNER JOIN lab_groups USING(group_id) WHERE reg_no = $1`,
				[reg_no]
			);
			if (groups.rows.length === 0) {
				throw createError.BadRequest('group does not exist');
			}
			const practicals = await pool.query(
				`SELECT prac_id FROM practical WHERE prac_name = $1`,
				[prac_name]
			);
			if (practicals.rows.length === 0) {
				throw createError.BadRequest('prac name does not exist');
			}
			const lecs = await pool.query(
				`SELECT lec_id FROM units WHERE unit_code = $1`,
				[unit_code]
			);
			if (lecs.rows.length === 0) {
				throw createError.BadRequest('unit does not have assigned lec');
			}
			const { rows } = await pool.query(
				`INSERT INTO reports (group_id,prac_id,unit_code,lec_id,report_name) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
				[
					groups.rows[0].group_id,
					practicals.rows[0].prac_id,
					unit_code,
					lecs.rows[0].lec_id,
					filename,
				]
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
	editReport: async (req, res, next) => {
		try {
			res.json('patching...');
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deleteReport: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM reports WHERE report_id = $1 RETURNING *`,
				[id]
			);
			if (rows.length === 0) {
				throw createError(404, 'report not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
