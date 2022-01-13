const createError = require('http-errors');
const pool = require('../db');

module.exports = {
	getALLEquipment: async (req, res, next) => {
		try {
			const resistors = await pool.query(`SELECT * FROM total_resistors`);
			if (resistors.rows.length === 0) {
				throw createError(404, 'no resistors found');
			}
			const inductors = await pool.query(`SELECT * FROM total_inductors`);
			if (inductors.rows.length === 0) {
				throw createError(404, 'no inductors found');
			}
			const capacitors = await pool.query(`SELECT * FROM total_capacitors`);
			if (capacitors.rows.length === 0) {
				throw createError(404, 'no capacitors found');
			}
			res.json([
				{
					equipment_id: 1,
					equipment_name: 'resistors',
					total: resistors.rows[0].total,
					bad_condition: resistors.rows[0].bad_condition_total,
				},
				{
					equipment_id: 2,
					equipment_name: 'inductors',
					total: inductors.rows[0].total,
					bad_condition: inductors.rows[0].bad_condition,
				},
				{
					equipment_id: 3,
					equipment_name: 'capacitors',
					total: capacitors.rows[0].total,
					bad_condition: capacitors.rows[0].bad_condition,
				},
			]);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getComponent: async (req, res, next) => {
		try {
			const { table } = req.params;
			const { rows } = await pool.query(`SELECT * FROM ${table}_view`);
			if (rows.length === 0) {
				throw createError(404, `no ${table} found`);
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	getEquipmentByID: async (req, res, next) => {
		try {
			const { equipment_id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM equipment WHERE equipment_id = $1',
				[equipment_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'equipment not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	addEquipment: async (req, res, next) => {
		try {
			const { equipment_name } = req.body;
			if (!equipment_name) {
				throw createError.BadRequest();
			}
			const { rows } = await pool.query(
				`INSERT INTO equipment (equipment_name) VALUES ($1) RETURNING *`,
				[equipment_name]
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
	editEquipment: async (req, res, next) => {
		try {
			const { equipment_id } = req.params;
			const { equipment_name } = req.body;

			if (!equipment_name) {
				throw createError.BadRequest();
			}
			const { rows } = await pool.query(
				`UPDATE equipment SET  equipment_name=$1 WHERE equipment_id = $6 RETURNING *`,
				[equipment_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'equipment not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	deleteEquipment: async (req, res, next) => {
		try {
			const { equipment_id } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM equipment WHERE equipment_id = $1 RETURNING *`,
				[equipment_id]
			);
			if (rows.length === 0) {
				throw createError(404, 'equipment not found');
			}
			res.json(rows);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
