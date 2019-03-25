const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const xlsx = require('node-xlsx');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const urlencode = require('urlencode');
const fs = require('fs');
const stream = require('stream');


const DB_URL = 'mongodb://localhost:27017/tms-intl-library';
mongoose.connect(DB_URL);

const IntlList = mongoose.model(
    'intlList',
    new mongoose.Schema({
        appId: {
            type: String
        },
        appName: {
            type: String
        },
        i18nKey: {
            type: String,
            require: true
        },
        zhCN: {
            type: String
        },
        enUS: {
            type: String
        }
    })
);

const app = express();
app.use(bodyParser.json());

app.post('/intl/add', (req, res) => {
    IntlList.findOne({i18nKey: req.body.i18nKey}, (err, doc) => {
        if (doc) {
            res.json({success: false, errorMessage: 'i18nKey不能重复'});
        } else {
            IntlList.create(req.body, (err, doc) => {
                res.json({...doc, success: true});
            })
        }
    })
});

app.get('/intl/list', (req, res) => {
    IntlList.find({i18nKey: {$regex: req.query.i18nKey}}, (err, doc) => {
        res.json({data: doc, success: true});
    });
});

app.delete('/intl/delete', (req, res) => {
    IntlList.remove(req.query, (err, doc) => {
        res.json({...doc, success: true});
    });
});

app.put('/intl/updata', (req, res) => {
    IntlList.findOne({i18nKey:req.body.i18nKey}, (err, doc) => {
        if(doc){
            const id = doc._doc._id.toString();
            if(req.body._id === id){
                IntlList.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
                    res.json({...doc, success: true});
                })
            }else{
                res.json({success: false, errorMessage: 'i18nKey不能重复'});
            }
        }else{
            IntlList.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
                res.json({...doc, success: true});
            })
        }}
    )
    
});

app.post('/intl/import', multipartMiddleware, (req, res) => {
    const workSheetsFromFile = xlsx.parse(req.files.file.path);
    const datas = [];
    const i18nKeys= [];
    workSheetsFromFile[0]['data'].forEach(item => {
        if(item[0]){
            datas.push({
                appId: 'ccp',
                appName: 'eCooperate™',
                i18nKey: item[0],
                zhCN: item[1],
                enUS: item[2]
            });
            i18nKeys.push(item[0])
        }
    });
    
    
    IntlList.find({i18nKey: {$in: i18nKeys}},(err,doc)=>{
        IntlList.deleteMany(doc._doc,(errT,docT)=>{
            IntlList.insertMany(datas, (err, doc) => {
                res.json({...doc, success: true});
            });
        })
    })
});

app.get('/intl/export',(req,res)=>{
    /*IntlList.find({i18nKey: {$regex: /^CCP/}}, (err, doc) => {
        const buffer = xlsx.build([{name: "mySheetName", data: doc._doc}]);
        fs.writeFileSync('ccp-intl.xlsx', buffer, 'binary');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `filename=${filename}`
        })
        res.end(buffer)
    });*/
    
    let data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];

    let buffer = xlsx.build([{name: "mySheetName", data: data}]);
    
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');
    res.send(new Buffer(buffer, 'binary'));
});

app.listen(9093, () => {
    console.log('node app start at port 9093');
});
