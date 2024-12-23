const {Op,Sequelize,literal,fn,col, where, QueryTypes} = require("sequelize");
const {dbLocal} = require('../models') //koneksi dbnya
const ResponseError = require("../error/response-error");
const MPDbtMpRekening = require("../models/muatparts/mp_rekening.model");
const MPDbmBankAccount = require("../models/muatparts/mp_bank.model");

class MPBankServices {

    /**
     * Service untuk menambahkan rekening bank baru
     * @param {Object} data - Data rekening bank yang akan ditambahkan
     * @param {string} data.bankId - ID bank yang dipilih
     * @param {string} data.accountHolderName - Nama pemilik rekening
     * @param {string} data.accountNumber - Nomor rekening
     * @param {boolean} data.isPrimary - Status rekening utama
     * @param {number} userID - ID user yang menambahkan rekening
     * @returns {Object} Pesan sukses dan data rekening baru
     * @throws {ResponseError} Jika validasi gagal atau terjadi error
     */
    async addBankAccount(data, userID)
    {
        try {
            // Check existing account count
            const accountCount = await MPDbtMpRekening.count({
                where: {
                    userID: userID,
                    isActive: true
                }
            });

            if (accountCount >= 3) {
                throw new ResponseError(400, 'Rekening Bank maksimal 3');
            }

            // Check if account number already exists for this user
            const existingAccount = await MPDbtMpRekening.findOne({
                where: {
                    userID: userID,
                    rekeningNumber: data.accountNumber,
                    isActive: true
                }
            });

            if (existingAccount) {
                throw new ResponseError(400, 'Nomor Rekening telah terdaftar');
            }

            // Start transaction
            const transaction = await dbLocal.transaction();

            try {
                // If isPrimary is true, set all other accounts to false
                if (data.isPrimary) {
                    await MPDbtMpRekening.update(
                        { isPrimary: false },
                        {
                            where: {
                                userID: userID,
                                isActive: true
                            },
                            transaction
                        }
                    );
                }

                // Create new bank account
                const newAccount = await MPDbtMpRekening.create({
                    bankID: data.bankId,
                    userID: userID,
                    namaPemilik: data.accountHolderName,
                    rekeningNumber: data.accountNumber,
                    isPrimary: data.isPrimary || false,
                    isActive: true
                }, { transaction });

                await transaction.commit();
                return {
                    Message: "Berhasil menyimpan rekening bank",
                    newAccount
                };

            } catch (error) {
                await transaction.rollback();
                throw error;
            }
            
        } catch (error) {
            if(error instanceof ResponseError){
                throw new ResponseError(error.status, {Message: error.data}, error.message)
            }
            throw new ResponseError(500, null, error.message)
        }
    }

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

    /**
     * Service untuk mendapatkan detail rekening bank berdasarkan ID
     * @param {string} id - ID rekening bank
     * @param {number} userID - ID user pemilik rekening
     * @returns {Object} Detail data rekening bank
     * @throws {ResponseError} Jika rekening tidak ditemukan atau terjadi error
     */
    async getBankAccountById(id, userID) {
        try {
            const bankAccount = await MPDbtMpRekening.findOne({
                where: {
                    id: id,
                    userID: userID,
                    isActive: true
                },
                include: [{
                    model: MPDbmBankAccount,
                    as: 'bank',
                    attributes: ['bankName', 'bankCode', 'imageLogo']
                }]
            });
    
            if (!bankAccount) {
                throw new ResponseError(404, 'Data tidak ditemukan');
            }

            const accounts = {
                id: bankAccount.id,
                bankId: bankAccount.bankID,
                bankName: bankAccount.bank.bankName,
                bankCode: bankAccount.bank.bankCode,
                bankLogo: bankAccount.bank.imageLogo,
                accountNumber: bankAccount.rekeningNumber,
                accountHolderName: bankAccount.namaPemilik,
                isPrimary: bankAccount.isPrimary,
                createdAt: bankAccount.createdAt,
                updatedAt: bankAccount.updatedAt,
            } 
    
            return accounts;
        } catch (error) {
            if(error instanceof ResponseError){
                throw new ResponseError(error.status, {Message: error.data}, error.message)
            }
            throw new ResponseError(500, null, error.message)
        }
    }

    /**
     * Service untuk mengubah data rekening bank
     * @param {string} id - ID rekening yang akan diubah
     * @param {Object} data - Data rekening yang akan diupdate
     * @param {string} data.bankId - ID bank yang dipilih
     * @param {string} data.accountHolderName - Nama pemilik rekening
     * @param {string} data.accountNumber - Nomor rekening
     * @param {boolean} data.isPrimary - Status rekening utama
     * @param {number} userID - ID user pemilik rekening
     * @returns {Object} Pesan sukses update rekening
     * @throws {ResponseError} Jika validasi gagal atau terjadi error
     */
    async editBankAccount(id, data, userID) {
        try {
            // Check if account exists and belongs to user
            const existingAccount = await MPDbtMpRekening.findOne({
                where: {
                    id: id,
                    userID: userID,
                    isActive: true
                }
            });
    
            if (!existingAccount) {
                throw new ResponseError(404, 'Data tidak ditemukan');
            }
    
            // Check if account is primary
            if (existingAccount.isPrimary) {
                throw new ResponseError(400, 'Rekening Bank utama tidak dapat diubah');
            }
    
            // Check if new account number already exists for this user (excluding current account)
            const duplicateAccount = await MPDbtMpRekening.findOne({
                where: {
                    userID: userID,
                    rekeningNumber: data.accountNumber,
                    id: { [Op.ne]: id },
                    isActive: true
                }
            });
    
            if (duplicateAccount) {
                throw new ResponseError(400, 'Nomor Rekening telah terdaftar');
            }
    
            // Start transaction
            const transaction = await dbLocal.transaction();
    
            try {
                // If setting as primary, update other accounts
                if (data.isPrimary) {
                    await MPDbtMpRekening.update(
                        { isPrimary: false },
                        {
                            where: {
                                userID: userID,
                                isActive: true
                            },
                            transaction
                        }
                    );
                }
    
                // Update account
                await existingAccount.update({
                    bankID: data.bankId,
                    namaPemilik: data.accountHolderName,
                    rekeningNumber: data.accountNumber,
                    isPrimary: data.isPrimary || false
                }, { transaction });
    
                await transaction.commit();
    
                return {
                    Message: "Berhasil mengubah rekening bank",
                };
    
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            if(error instanceof ResponseError){
                throw new ResponseError(error.status, {Message: error.data}, error.message)
            }
            throw new ResponseError(500, null, error.message)
        }
    }

    /**
     * Service untuk menghapus rekening bank (soft delete)
     * @param {string} id - ID rekening yang akan dihapus
     * @param {number} userID - ID user pemilik rekening
     * @returns {Object} Pesan sukses hapus rekening
     * @throws {ResponseError} Jika rekening primary atau terjadi error
     */
    async deleteBankAccount(id, userID) {
        try {
            // Check if account exists and belongs to user
            const bankAccount = await MPDbtMpRekening.findOne({
                where: {
                    id: id,
                    userID: userID,
                    isActive: true
                }
            });
    
            if (!bankAccount) {
                throw new ResponseError(404, 'Data tidak ditemukan');
            }
    
            // Check if account is primary
            if (bankAccount.isPrimary) {
                throw new ResponseError(400, 'Rekening Bank utama tidak dapat diubah');
            }
    
            // Soft delete the account
            await bankAccount.update({
                isActive: false,
                deletedAt: new Date()
            });
    
            return {
                Message: 'Berhasil menghapus rekening bank'
            };
        } catch (error) {
            if(error instanceof ResponseError){
                throw new ResponseError(error.status, {Message: error.data}, error.message)
            }
            throw new ResponseError(500, null, error.message)
        }
    }

    /**
     * Service untuk mengecek validitas rekening bank
     * @param {Object} data - Data rekening yang akan dicek
     * @returns {Object} Status validitas dan detail rekening
     * @throws {ResponseError} Jika terjadi error
     */
    async checkBankAccount(data, userID)
    {
        try {
            console.log("friday")
            if(data.id){
                console.log("friday1")
                // Check if new account number already exists for this user (excluding current account)
                const existingAccount = await MPDbtMpRekening.findOne({
                    where: {
                        userID: userID,
                        rekeningNumber: data.accountNumber,
                        id: { [Op.ne]: data.id },
                        isActive: true
                    }
                });

                if (existingAccount) {
                    throw new ResponseError(400, 'Nomor Rekening telah terdaftar');
                }
            }else{
                console.log("friday2")
                // Check if account number already exists for this user
                const existingAccount = await MPDbtMpRekening.findOne({
                    where: {
                        userID: userID,
                        rekeningNumber: data.accountNumber,
                        isActive: true
                    }
                });

                if (existingAccount) {
                    throw new ResponseError(400, 'Nomor Rekening telah terdaftar');
                }
            }

            const valid = {
                accountNumber: data.accountNumber,
                accountHolderName: "NOLI RISKI APRILII PITRI"
            }

            const invalid = false
            if(invalid){
                throw new ResponseError(400, 'Nomor Rekening tidak ditemukan');
            }

            return {
                ...valid
            }
        } catch (error) {
            if(error instanceof ResponseError){
                throw new ResponseError(error.status, {Message: error.data}, error.message)
            }
            throw new ResponseError(500, null, error.message)
        }
    }
}

module.exports = new MPBankServices()