const {Op,Sequelize,literal,fn,col, where, QueryTypes} = require("sequelize");
const {dbLocal} = require('../models') //koneksi dbnya
const ResponseError = require("../error/response-error");
const MPDbtMpRekening = require("../models/muatparts/mp_rekening.model");
const MPDbmBankAccount = require("../models/muatparts/mp_bank.model");

class MPBankServices {

    /**
     * Service untuk mendapatkan semua rekening bank user
     * @param {number} userID - ID user pemilik rekening
     * @returns {Object} Data rekening bank dan total rekening
     * @property {Array} accounts - List rekening bank
     * @property {number} totalAccounts - Total jumlah rekening
     * @throws {ResponseError} Jika terjadi error
     */
    async getAllBankAccount(userID) {
        try {
            const whereClause = {
                userID: userID,
                isActive: true
            };
    
            const { count, rows } = await MPDbtMpRekening.findAndCountAll({
                where: whereClause,
                include: [{
                    model: MPDbmBankAccount,
                    as: 'bank',
                    attributes: ['bankName', 'bankCode', 'imageLogo']
                }],
                order: [
                    ['isPrimary', 'DESC'],
                    ['createdAt', 'DESC']
                ],
            });

            const accounts = rows.map(item => ({
                id: item.id,
                bankId: item.bankID,
                bankName: item.bank.bankName,
                bankCode: item.bank.bankCode,
                bankLogo: item.bank.imageLogo,
                accountNumber: item.rekeningNumber,
                accountHolderName: item.namaPemilik,
                isPrimary: item.isPrimary,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })) 
    
            return {
                accounts,
                totalAccounts: count
            };
        } catch (error) {
            if(error instanceof ResponseError){
                throw new ResponseError(error.status, {Message: error.data}, error.message)
            }
            throw new ResponseError(500, null, error.message)
        }
    }

}

module.exports = new MPBankServices()