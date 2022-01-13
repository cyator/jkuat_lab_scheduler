const express = require('express');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

const {
	streamFile,
	downloadFile,
} = require('../controller/uploads.controller');
//jkuat members
router.get('/stream/:filename', streamFile);
//jkuat members
router.get('/download/:filename', verifyToken('all'), downloadFile);
module.exports = router;
