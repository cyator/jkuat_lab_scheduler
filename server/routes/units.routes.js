const express = require('express');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

const {
	getALLUnits,
	getUnitByYear,
	getUnitByID,
	addUnit,
	editUnit,
	deleteUnit,
} = require('../controller/units.controller');
// jkuat members
router.get('/', verifyToken('all'), getALLUnits);
// groupLeader
router.get('/:reg_no', verifyToken('groupLeader'), getUnitByYear);
// jkuat members
router.get('/:unit_code', verifyToken('all'), getUnitByID);
// cod
router.post('/', verifyToken('cod'), addUnit);
// cod
router.patch('/:unit_code', verifyToken('cod'), editUnit);
// cod
router.delete('/:unit_code', verifyToken('cod'), deleteUnit);

module.exports = router;
