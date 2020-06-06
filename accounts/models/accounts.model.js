const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    balance: Number,
    transactions: [{
        sum: Number,
        transactionType: String,
        fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts", required: true },
        toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts", required: true },
        date: Date
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
});

accountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
accountSchema.set('toJSON', {
    virtuals: true
});

accountSchema.findById = function (cb) {
    return this.model('Accounts').find({id: this.id}, cb);
};

const Account = mongoose.model('Accounts', accountSchema);

exports.findByUserId = (userId) => {
    return Account.find({ userId: userId});
};

exports.findById = (id) => {    
    return Account.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        }).catch((err) => {
            throw 'Account not found';
        });
};

exports.getBalanceById = (id) => {
    return Account.findById(id)
        .then((result) => {
            result = JSON.stringify('balance:' + result.balance);
            return result;
        }).catch((err) => {
            throw 'Account not found';
        });
};

exports.getTransferHistoryById = (id) => {
    return Account.findById(id)
        .then((result) => {
            result = JSON.stringify('transfer history:' + result.transactions);
            return result;
        }).catch((err) => {
            throw 'Account not found';
        });
};

exports.createAccount = (accountData) => {
    const account = new Account(accountData);
    return account.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Account.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, accounts) {
                if (err) {
                    reject(err);
                } else {
                    resolve(accounts);
                }
            })
    });
};

exports.patchAccount = (id, accountData) => {
    return new Promise((resolve, reject) => {
        Account.findById(id, function (err, account) {
            if (err) reject(err);
            for (let i in accountData) {
                account[i] = accountData[i];
            }
            account.save(function (err, updatedAccount) {
                if (err) return reject(err);
                resolve(updatedAccount);
            });
        });
    })

};

exports.transferAmount = async (senderId, transferData) => {
    const session = await Account.startSession();
    session.startTransaction();
    try {
        Account.findById(senderId, function (err, senderAccount) {
            if (err) reject(err);
            senderAccount.balance -= transferData.sum;
            senderAccount.transactions.push({
                sum: transferData.sum,
                transactionType: 'send',
                fromAccountId: senderId,
                toAccountId: transferData.receiverId,
                date: new Date()
            })
            senderAccount.save(function (err, updatedAccount) {
                if (err) return reject(err);
            });
        });

        Account.findById(transferData.receiverId, function (err, receiverAccount) {
            if (err) reject(err);
            receiverAccount.balance += transferData.sum;
            receiverAccount.transactions.push({
                sum: transferData.sum,
                transactionType: 'receive',
                fromAccountId: senderId,
                toAccountId: transferData.receiverId,
                date: new Date()
            })
            receiverAccount.save(function (err, updatedAccount) {
                if (err) return reject(err);
            });
        });

        await session.commitTransaction();
        session.endSession();
        return true;
    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

exports.removeById = (accountId) => {
    return new Promise((resolve, reject) => {
        Account.remove({ _id: accountId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

