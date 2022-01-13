const express = require('express');
const router = express.Router();
const { verifyToken } = require('../config/jwt');
const {
	getALLEquipment,
	getComponent,
	getEquipmentByID,
	addEquipment,
	editEquipment,
	deleteEquipment,
} = require('../controller/equipment.controller');

//labtech
router.get('/', verifyToken('labtech'), getALLEquipment);
//labtech
router.get('/:table', verifyToken('labtech'), getComponent);
//labtech
router.get('/:equipment_id', verifyToken('labtech'), getEquipmentByID);
//labtech
router.post('/', verifyToken('labtech'), addEquipment);
//labtech
router.patch('/:equipment_id', verifyToken('labtech'), editEquipment);
//labtech
router.delete('/:equipment_id', verifyToken('labtech'), deleteEquipment);

module.exports = router;
