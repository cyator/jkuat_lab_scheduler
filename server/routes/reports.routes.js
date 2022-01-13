const express = require('express');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

const {
	getALLReports,
	getMarkedReports,
	getPendingReports,
	getReportByID,
	addReport,
	editReport,
	deleteReport,
	addMarks,
} = require('../controller/reports.controller');

const upload = require('../middleware/multer');
//lec
router.get('/', verifyToken('lecturer'), getALLReports);
//lec
router.get('/marked/:lec_id', verifyToken('lecturer'), getMarkedReports);
//lec
router.get('/pending/:lec_id', verifyToken('lecturer'), getPendingReports);
//lec
router.get('/:id', verifyToken('lecturer'), getReportByID);
//lec
router.post('/addMarks', verifyToken('lecturer'), addMarks);
//group leader
router.post('/', verifyToken('groupLeader'), upload.single('file'), addReport);
//lec
router.patch('/:id', verifyToken('lecturer'), editReport);
//cod
router.delete('/:id', verifyToken('cod'), deleteReport);

module.exports = router;
