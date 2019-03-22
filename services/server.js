const express = require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');

const DB_URL = 'mongodb://localhost:27017/tms-intl-library';
mongoose.connect(DB_URL);

const IntlList = mongoose.model(
    'intlList' ,
    new mongoose.Schema({
        appId: {
            type: String
        } ,
        appName: {
            type: String
        } ,
        i18nKey: {
            type: String ,
            require: true
        } ,
        zhCN: {
            type: String
        } ,
        enUS: {
            type: String
        }
    })
);

// User.create({ name: '王五yi', age: 32 });

// IntlList.create({
//     appId: 'ccp' ,
//     appName: 'eCooperate™' ,
//     i18nKey: 'CCP_F_01002',
//     zhCN: '项目',
//     enUS: 'Project'
// });

const app = express();
app.use(bodyParser.json());

app.post('/intl/add' , (req , res) => {
    IntlList.create(req.body , (err , doc) => {
        res.json(doc);
    });
});

app.get('/intl/list' , (req , res) => {
    IntlList.find({i18nKey: {$regex: req.query.i18nKey}} , (err , doc) => {
        res.json(doc);
    });
});

app.delete('/intl/delete',(req , res) => {
    IntlList.remove(req.query , (err , doc) => {
        res.json(doc);
    });
});

app.put('/intl/updata' , (req , res) => {
    IntlList.create(req.body , (err , doc) => {
        res.json(doc);
    });
});

app.listen(9093 , () => {
    console.log('node app start at port 9093');
});
