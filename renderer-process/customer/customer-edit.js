const electron = require('electron')
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/customer';

const fs = require('fs');
const os = require('os');
const path = require('path');

const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', () => {
    console.log("============= 提交数据 ============");
    submit();
});

const getParams = () => {
    const params = {};

    const inputs = document.querySelectorAll("#customer-edit-section .form-container input");
    const length = inputs.length;


    for (let i = 0; i < length; i++) {
        let input = inputs[i];
        let name = input.name;
        let val = input.value;
        let type = input.type;

        switch (type) {
            case "checkbox":

                if(!Array.isArray(params[name])){
                    params[name] = []
                }

                if(input.checked){
                    params[name].push(val);
                }
                break;
            case "radio":
                if(input.checked){
                    params[name] = val;
                }
                break;
            default:
                params[name] = val;
                break;
        }
    }

    return params;
};

const checkForm = () => {

    const require = {
        "name": true,
        "idcard": true,
        "phone": true,
        "begindate": true,
        "enddate": true,
        "servicePassword": false,
        "agencyName": true,
        "fundName": false,
        "fundPassword": false,
        "companyPhone": false,
        "company": false,
        "companyAddress": false,
        "address": false,
        "creditCount": true,
        "highestQuota": true,
        "creditBank1": false,
        "quota1": false,
        "creditBank2": false,
        "quota2": false,
        "creditBank3": false,
        "quota3": false,
        "creditBank4": false,
        "quota4": false,
        "creditBank5": false,
        "quota5": false,
        "bankName": false,
        "bankAddress": false,
        "creditStatus": false,
        "creditNetName": false,
        "creditNetPassword": false,
        "creditNetCode": false,
        "education": true,
        "school": false,
        "aipayName": false,
        "creditScore": false,
        "married": true,
        "email": true,
        "spouseName": false,
        "spousePhone": false,
        "otherContacterName1": false,
        "otherContacterPhone1": false,
        "otherContacterName2": false,
        "otherContacterPhone2": false,
        "onlineLoan": false,
        "offlineLoan": false
    };

    const params = getParams();

    for( let key in params ) {
        if(require[key] && !params[key]){
            alert("必填信息不能为空");
            return {
                status: false,
                params: {}
            };
        }
    }

    return {
        status: true,
        params: params
    };
}

const insertData = (db, param, callback) => {
    //连接到表 customer_info.  如果没有就新建一个
    const collection = db.collection('customer_info');

    console.log("============= 连接collection成功 ============");

    //插入数据
    const data = param;
    collection.insert(data, (err, result) => {
        if (err) {
            console.log("============= 插入数据失败 ============");
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};


const submit = () => {
    const {status, params} = checkForm();
    console.log(status, params);
    status && MongoClient.connect(DB_CONN_STR, (err, db) => {
        if (err) {
            console.log("============= 连接数据库失败 ============");
            console.log('Error:' + err);
        } else {
            console.log("============= 连接数据库成功 ============");
            insertData(db, params, (result) => {
                console.log("============= 插入数据成功 ============");
                console.log(result);
                db.close();
                alert("插入数据成功");
            });
        }


    });
};