var express = require('express');
var router = express.Router();
// controller
const MPBankController = require('../../../controller/mp_bank.controller');

// CRUD bank account
router.get("/bankAccount", MPBankController.getAllBankAccount)


module.exports = router;