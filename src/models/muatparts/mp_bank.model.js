const { Model, DataTypes } = require('sequelize');
const {dbLocal} = require('..');

class MPDbmBankAccount extends Model {}

MPDbmBankAccount.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    bankName: {
        field: 'bank_name',
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankCode: {
        field: 'bank_code',
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageLogo: {
        field: 'image_logo',
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        field: 'is_active',
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
    },
    deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE
    }
}, {
    sequelize:dbLocal,
    modelName: 'MPDbmBankAccount',
    tableName: 'dbm_bank_account',
    timestamps: true,
    paranoid: true,
    underscored: true
});


module.exports = MPDbmBankAccount