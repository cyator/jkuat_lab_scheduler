const express = require('express');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

const {
	getAllLecturers,
	getLecturerByID,
	addLecturer,
	editLecturer,
	deleteLecturer,
} = require('../controller/lecturers.controller');

//cod
router.get('/', verifyToken('cod'), getAllLecturers);
//cod
router.get('/:lec_id', verifyToken('cod'), getLecturerByID);
//cod
router.post('/', verifyToken('cod'), addLecturer);
//cod
router.patch('/:lec_id', verifyToken('cod'), editLecturer);
//cod
router.delete('/:lec_id', verifyToken('cod'), deleteLecturer);

module.exports = router;
