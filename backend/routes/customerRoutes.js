const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById } = require('../controllers/customerController');

router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);

module.exports = router;
