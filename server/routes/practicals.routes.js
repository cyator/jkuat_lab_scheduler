const express = require('express');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

const {
	getALLPracticals,
	getPracticalsByYear,
	getPracticalByID,
	addPractical,
	editPractical,
	deletePractical,
} = require('../controller/practicals.controller');

const upload = require('../middleware/multer');
//labtech
router.get('/', verifyToken('all'), getALLPracticals);
//groupLeader
router.get('/:reg_no', verifyToken('groupLeader'), getPracticalsByYear);
//labtech
router.get('/:prac_id', verifyToken('labtech'), getPracticalByID);
//labtech
router.post('/', verifyToken('labtech'), upload.single('file'), addPractical);
//labtech
router.patch('/:prac_id', verifyToken('labtech'), editPractical);
//labtech
router.delete('/:prac_id', verifyToken('labtech'), deletePractical);

module.exports = router;
