const express = require('express');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

const {
	getALLLabtechs,
	getLabtechByID,
	addLabtech,
	editLabtech,
	deleteLabtech,
} = require('../controller/labtechs.controller');

//cod
router.get('/', verifyToken('cod'), getALLLabtechs);
//cod
router.get('/:labtech_id', verifyToken('cod'), getLabtechByID);
//cod
router.post('/', verifyToken('cod'), addLabtech);
//cod
router.patch('/:labtech_id', verifyToken('cod'), editLabtech);
//cod
router.delete('/:labtech_id', verifyToken('cod'), deleteLabtech);

module.exports = router;
