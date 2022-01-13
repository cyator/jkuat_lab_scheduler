const joi = require('joi');

const studentSchema = joi.object({
	reg_no: joi
		.string()
		.regex(/^ITE[0-9]{3}-[0-9]{4}-[0-9]{4}$/)
		.max(50),
	group_id: joi.number().integer().required(),
	last_name: joi.string().min(2).max(50).required(),
	first_name: joi.string().min(2).max(50).required(),
	email: joi
		.string()
		.lowercase()
		.regex(/^[a-z]+.[a-z]+.@students.jkuat.ac.ke$/)
		.max(100)
		.required(),
	year_of_study: joi.number().integer().required(),
	passcode: joi.string().min(8).max(30).required(),
});

const labtechSchema = joi.object({
	labtech_id: joi
		.string()
		.regex(/^dte[0-9]{3}-[0-9]{4}$/)
		.max(50),
	last_name: joi.string().min(2).max(50).required(),
	first_name: joi.string().min(2).max(50).required(),
	email: joi
		.string()
		.lowercase()
		.regex(/^[a-z]+.[a-z]+.@staff.jkuat.ac.ke$/)
		.max(100)
		.required(),
	passcode: joi.string().min(8).max(30).required(),
});

const lecturerSchema = joi.object({
	lec_id: joi
		.string()
		.regex(/^dte[0-9]{4}-[0-9]{4}$/)
		.max(50),
	last_name: joi.string().min(2).max(50).required(),
	first_name: joi.string().min(2).max(50).required(),
	email: joi
		.string()
		.lowercase()
		.regex(/^[a-z]+.[a-z]+.@staff.jkuat.ac.ke$/)
		.max(100)
		.required(),
	passcode: joi.string().min(8).max(30).required(),
});

const loginSchema = joi.object({
	email: joi.string().email().lowercase().required(),
	password: joi.string().min(8).max(30).required(),
});

module.exports = {
	studentSchema,
	labtechSchema,
	lecturerSchema,
	loginSchema,
};
