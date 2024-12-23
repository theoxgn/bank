var express = require('express');
var router = express.Router();
// controller
const MPBankController = require('../../../controller/mp_bank.controller');

// CRUD bank account
router.get("/bankAccount", MPBankController.getAllBankAccount)
router.get("/bankAccount/:id", MPBankController.getBankAccountById)
router.put("/bankAccount/:id", MPBankController.editBankAccount)
router.delete("/bankAccount/:id", MPBankController.deleteBankAccount)


module.exports = router;