const AccountModel = require('../models/accounts.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    AccountModel.createAccount(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch((err) => {
            res.status(400).send(err);
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    AccountModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(400).send(err);
        });
};

exports.getById = (req, res) => {
    AccountModel.findById(req.params.accountId)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(400).send(err);
        });
};

exports.getBalanceById = (req, res) => {
    AccountModel.getBalanceById(req.params.accountId)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(400).send(err);
        });
};

exports.getTransferHistoryById = (req, res) => {
    AccountModel.getTransferHistoryById(req.params.accountId)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(400).send(err);
        });
};

exports.patchById = (req, res) => {
    AccountModel.patchAccount(req.params.accountId, req.body)
        .then((result) => {
            res.status(204).send({});
        }).catch ((err) => {
            res.status(400).send(err);
        });

};

exports.removeById = (req, res) => {
    AccountModel.removeById(req.params.accountId)
        .then((result)=>{
            res.status(204).send({});
        }).catch((err) => {
            res.status(400).send(err);
        });
};

exports.transferAmount = (req, res) => {
    AccountModel.transferAmount(req.params.accountId, req.body)
        .then((result) => {
            res.status(204).send({});
        }).catch((err) => {
            res.status(400).send(err);
        });
};