const MessageHelper = require('../helper/message.helper');
const {validationResult} = require("express-validator");
const ResponseError = require("../error/response-error");
const MPBankService = require('../services/mp_bank.service');

class MPBankController {
    

    async getAllBankAccount(req, res, next) {
        try {
            let validRequest = validationResult(req);
            if (!validRequest.isEmpty()) {
                throw new ResponseError(400, validRequest.array(), 'Validation failed');
            }
    
            const userID = 99
            const result = await MPBankService.getAllBankAccount(userID);
    
            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: req.originalUrl,
            }, true, res);
        } catch (error) {
            next(error)
        }
    }

    async getBankAccountById(req, res, next) {
        try {
            let validRequest = validationResult(req);
            if (!validRequest.isEmpty()) {
                throw new ResponseError(400, validRequest.array(), 'Validation failed');
            }
    
            const userID = 99
            const result = await MPBankService.getBankAccountById(req.params.id, userID);
    
            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: req.originalUrl,
            }, true, res);
        } catch (error) {
            next(error)
        }
    }

    async editBankAccount(req, res, next) {
        try {
            let validRequest = validationResult(req);
            if (!validRequest.isEmpty()) {
                throw new ResponseError(400, validRequest.array(), 'Validation failed');
            }
    
            const userID = 99
            const result = await MPBankService.editBankAccount(req.params.id, req.body, userID);
    
            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: req.originalUrl,
            }, true, res);
        } catch (error) {
            next(error)
        }
    }

    async deleteBankAccount(req, res, next) {
        try {
            let validRequest = validationResult(req);
            if (!validRequest.isEmpty()) {
                throw new ResponseError(400, validRequest.array(), 'Validation failed');
            }
    
            const userID = 99
            const result = await MPBankService.deleteBankAccount(req.params.id, userID);
    
            return await MessageHelper.showMessage(200, {
                Data: result,
                Type: req.originalUrl,
            }, true, res);
        } catch (error) {
            next(error)
        }
    }

    
}

module.exports = new MPBankController()