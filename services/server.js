const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const xlsx = require("node-xlsx");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const urlencode = require("urlencode");
const AppNameEnum = {
  ccp: "eCooperate",
  etime: "eTime",
  qm: "eQuality",
  bi: 'bi',
  'bi-etmf': '"bi-etmf'
};

const DB_URL = "mongodb://localhost:27017/tms-intl-library";
mongoose.connect(DB_URL);

const IntlList = mongoose.model(
  "intlList",
  new mongoose.Schema({
    appId: {
      type: String,
    },
    appName: {
      type: String,
    },
    i18nKey: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    zhCN: {
      type: String,
    },
    enUS: {
      type: String,
    },
    wordClass: {
      type: String,
    },
    description:{
      type: String,
    }
  })
);

const app = express();
app.use(bodyParser.json());

// 数字补零操作
function prefixInteger(num, length) {
  return (Array(length).join("0") + num).slice(-length);
}

// 获取当前分类中的最大key的值
function getMaxi18nKeyNum(doc) {
  let maxi18nKeyNum = 0;
  if (doc && Array.isArray(doc)) {
    doc.forEach((item) => {
      if (item.i18nKey) {
        const i18nKeyArr = item.i18nKey.split("_");
        const itemi18nKeyNum = parseInt(i18nKeyArr[2]);
        if (itemi18nKeyNum > maxi18nKeyNum) {
          maxi18nKeyNum = itemi18nKeyNum;
        }
      }
    });
  }
  maxi18nKeyNum = prefixInteger(maxi18nKeyNum + 1, 5);
  return maxi18nKeyNum;
}

// 根据最大key组装成i18nKey
function assembleI18nKey(appId, category, maxi18nKeyNum) {
  return category === "menu"
    ? `${appId.toUpperCase()}_F_${maxi18nKeyNum}`
    : `${appId.toUpperCase()}_FF_${maxi18nKeyNum}`;
}

// 新增
app.post("/intl/add", (req, res) => {
  const category = req.body.category;
  const appId = req.body.appId;
  // 如果是etime走老规则
  if (appId === "etime") {
    IntlList.findOne({ i18nKey: req.body.i18nKey }, (err, doc) => {
      if (doc) {
        res.json({ success: false, errorMessage: "i18nKey不能重复" });
      } else {
        IntlList.create(req.body, (err, doc) => {
          res.json({ ...doc, success: true });
        });
      }
    });
  } else {
    if (category) {
      IntlList.find({ category, appId }, (err, doc) => {
        const maxi18nKeyNum = getMaxi18nKeyNum(doc);
        if (maxi18nKeyNum) {
          req.body.i18nKey = assembleI18nKey(appId, category, maxi18nKeyNum);
          IntlList.create(req.body, (err, docT) => {
            res.json({ ...docT, success: true });
          });
        }
      });
    }
  }
});

// 获取列表
app.get("/intl/list", (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim() : ''; // 获取查询的字段
  const category = req.query.category; // 获取查询的字段
  const appId = req.query.appId; // appId
  const fuzzyMatch = req.query.fuzzyMatch; // 模糊匹配（默认精确匹配）
  const filterKey = JSON.parse(fuzzyMatch) ? '$regex' : '$eq';

  const filter =
    ((keyword || category || appId) && {
      $and: [
        {
          $or: [
            // 多字段同时匹配
            { zhCN:  { [filterKey]: keyword } }, //  $options: '$i' 忽略大小写
            { enUS: { [filterKey]: keyword } },
            { i18nKey: { $regex: keyword, $options: "$i" } },
          ],
        },
        {
          $or: [{ category: { $regex: category, $options: "$i" } }],
        },
        {
          $or: [{ appId: { $eq: appId } }],
        },
      ],
    }) ||
    {};

  IntlList.find(filter, (err, doc) => {
    res.json({ data: doc, success: true });
  });
});

// 删除
app.delete("/intl/delete", (req, res) => {
  IntlList.remove(req.query, (err, doc) => {
    res.json({ ...doc, success: true });
  });
});

// 更新
app.put("/intl/updata", (req, res) => {
  IntlList.findOne({ i18nKey: req.body.i18nKey }, (err, doc) => {
    if (doc) {
      const id = doc._doc._id.toString();
      if (req.body._id === id) {
        IntlList.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
          res.json({ ...doc, success: true });
        });
      } else {
        res.json({ success: false, errorMessage: "i18nKey不能重复" });
      }
    } else {
      IntlList.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
        res.json({ ...doc, success: true });
      });
    }
  });
});

// 导入excel
app.post("/intl/import", multipartMiddleware, (req, res) => {
  const workSheetsFromFile = xlsx.parse(req.files.file.path);
  const datas = [];
  const i18nKeys = [];
  workSheetsFromFile[0]["data"].forEach((item) => {
    if (item[0]) {
      datas.push({
        appId: item[0],
        appName: AppNameEnum[item[0]],
        category: item[1],
        i18nKey: item[2],
        zhCN: item[3],
        enUS: item[4],
        wordClass: item[5],
        description: item[6]
      });
      i18nKeys.push(item[2]);
    }
  });
  const dupliList = duplicates(i18nKeys);
  if (dupliList.length > 0) {
    res.json({
      success: false,
      errorMessage: `i18nKey重复: ${dupliList.join()}`,
    });
  } else {
    IntlList.find({ i18nKey: { $in: i18nKeys } }, (err, doc) => {
      if (doc.length > 0) {
        IntlList.deleteMany({ i18nKey: { $in: i18nKeys } }, (errT, docT) => {
          IntlList.insertMany(datas, (err, doc) => {
            res.json({ success: true });
          });
        });
      } else {
        IntlList.insertMany(datas, (err, doc) => {
          res.json({ ...doc, success: true });
        });
      }
    });
  }
});

function duplicates(arr) {
  const result = [];
  arr.forEach((item) => {
    if (
      arr.indexOf(item) !== arr.lastIndexOf(item) &&
      result.indexOf(item) === -1
    ) {
      result.push(item);
    }
  });
  return result;
}

// 导出excel
app.get("/intl/export", (req, res) => {
  const category = req.query.category;
  const appId = req.query.appId;

  IntlList.find(
    {
      i18nKey: { $regex: /.*?/ },
      category: { $regex: category },
      appId: { $regex: appId },
    },
    (err, doc) => {
      let data = [];
      let childData = [];
      doc.forEach((item) => {
        childData.push(item.appId);
        childData.push(item.category);
        childData.push(item.i18nKey);
        childData.push(item.zhCN);
        childData.push(item.enUS);
        childData.push(item.wordClass);
        childData.push(item.description);
        data.push(childData);
        childData = [];
      });
      const option = {
        "!cols": [{ wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 60 }],
      };
      const buffer = xlsx.build(
        [{ name: `${AppNameEnum[appId]}国际化文档`, data: data }],
        option
      );
      const fileName = urlencode(`${AppNameEnum[appId]}国际化文档.xlsx`);
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `filename=${category}_${fileName}`,
      });
      res.send(buffer);
    }
  );
});

// 导出exportProCN
app.get("/int/exportProCN", (req, res) => {
  const category = req.query.category;
  const appId = req.query.appId;

  IntlList.find(
    {
      i18nKey: { $regex: /.*?/ },
      category: { $regex: category },
      appId: { $regex: appId },
    },
    (err, doc) => {
      let data = [];
      let childData = [];
      doc.forEach((item) => {
        childData.push(item.i18nKey);
        childData.push(item.zhCN);
        data.push(childData.join("="));
        childData = [];
      });
      const buffer = Buffer.from(data.join("\r\n"));
      res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `filename=${category}_${appId}_cn.properties`,
      });
      res.send(buffer);
    }
  );
});

// 导出exportProEN
app.get("/int/exportProEN", (req, res) => {
  const category = req.query.category;
  const appId = req.query.appId;

  IntlList.find(
    {
      i18nKey: { $regex: /.*?/ },
      category: { $regex: category },
      appId: { $regex: appId },
    },
    (err, doc) => {
      let data = [];
      let childData = [];
      doc.forEach((item) => {
        childData.push(item.i18nKey);
        childData.push(item.enUS);
        data.push(childData.join("="));
        childData = [];
      });
      const buffer = Buffer.from(data.join("\r\n"));
      res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `filename=${category}_${appId}_en.properties`,
      });
      res.send(buffer);
    }
  );
});

app.listen(9093, () => {
  console.log("node app start at port 9093");
});
