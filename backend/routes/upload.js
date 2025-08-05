const express = require('express');
const router = express.Router();
const { uploadUsers, uploadOrders } = require('../controllers/uploadController');

router.get('/upload-users', uploadUsers);
router.get('/upload-orders', uploadOrders);

module.exports = router;
