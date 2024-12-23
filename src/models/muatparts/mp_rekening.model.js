const { Model, DataTypes } = require('sequelize');
const {dbLocal} = require('..');
const MPDbmBankAccount = require('./mp_bank.model')

class MPDbtMpRekening extends Model {}

MPDbtMpRekening.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    bankID: {
        field: 'bankID',
        type: DataTypes.UUID,
        allowNull: false,
    },
    userID: {
        field: 'usersID',
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    namaPemilik: {
        field: 'nama_pemilik',
        type: DataTypes.STRING,
        allowNull: false,
    },
    rekeningNumber: {
        field: 'rekening_number',
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerif: {
        field: 'is_verif',
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isPrimary: {
        field: 'is_primary',
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    modelName: 'MPDbtMpRekening',
    tableName: 'dbt_mp_rekening',
    timestamps: true,
    paranoid: true,
    underscored: true
});

/**MPBANK */
MPDbtMpRekening.belongsTo(MPDbmBankAccount,{ as: 'bank', foreignKey: 'bankID', onDelete: 'CASCADE' })
MPDbmBankAccount.hasMany(MPDbtMpRekening,{as: 'rekenings' , foreignKey: 'bankID', onDelete: 'CASCADE'})

module.exports = MPDbtMpRekening