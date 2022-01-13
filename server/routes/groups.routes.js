const express = require('express');
const {
	verifyAccessToken,
	verifyClassrepToken,
	verifyToken,
} = require('../config/jwt');
const router = express.Router();

const {
	getALLGroups,
	editGroup,
	deleteGroup,
	createGroup,
	addMember,
	removeMember,
	getStudentsWithoutGroupsByID,
} = require('../controller/groups.controller');

//jkuat members
router.get('/', verifyToken('all'), getALLGroups);
//jkuat members
// router.get('/:id', verifyToken('all'), getGroupByID);
//class_rep
router.get(
	'/students-without-groups',
	verifyToken('classrep'),
	getStudentsWithoutGroupsByID
);

//class_rep
router.post('/create', verifyToken('classrep'), createGroup);
//class_rep
router.post('/add-member', verifyToken('classrep'), addMember);
//class_rep
router.post('/remove-member', verifyToken('classrep'), removeMember);
//class_rep
router.patch('/:id', verifyToken('classrep'), editGroup);
//cod
router.delete('/:id', verifyToken('cod'), deleteGroup);

module.exports = router;
