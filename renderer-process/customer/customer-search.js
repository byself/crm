const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/customer';

const btnSearch = document.getElementById('btnSearch');

btnSearch.addEventListener('click', () => {
    console.log("============= 提交数据 ============");
    submit();
});

const inclusion = (data) => {
  return {
    "name": () => {
      return data.name;
    },
    "phone": () => {
        return data.phone;
    },
    "creditStatus": () => {
      const status = ["纯白户", "白户", "贷款逾期", "信用卡逾期", "黑户", "打卡工资", "公积金", "平安保险", "房贷", "车贷"];
      const txt = [];
      const credit = data.creditStatus;
      const l = credit.length;

      for(let i = 0; i < l; i++){
        let item = credit[i];
        txt.push(status[item]);
      }

      return txt.join(",");
    },
    "education": () => {
        const status = ["大专以下", "大专", "本科", "研究生", "博士"];
        return status[data.education];
    },
    "fundName": () => {
        return data.fundName ? "有" : "无";
    }
  }
};

const renderHtml = (data) => {
  const lists = [];


  const l = data.length;

  if(l){
      for(let i = 0; i < l; i++){
          let item = inclusion(data[i]);
          lists.push(`<tr>
          <td>${item.name()}</td>
          <td>${item.phone()}</td>
          <td>${item.creditStatus()}</td>
          <td>${item.education()}</td>
          <td>${item.phone()}</td>
          <td>${item.phone()}</td>
          <td>${item.fundName()}</td>
        </tr>`)
      };
  }else{
      lists.push(`<tr>
          <td colspan="7">暂无数据</td>
        </tr>`)
  }


    const searchList = document.getElementById('searchList');
    const total = document.getElementById('total');

    searchList.innerHTML = lists.join("");
    total.innerHTML = l;
};

const getParams = () => {
    const params = {};

    const inputs = document.querySelectorAll("#customer-search-section .search-form-container input");
    const length = inputs.length;


    for (let i = 0; i < length; i++) {
        let input = inputs[i];
        let name = input.name;
        let val = input.value;
        let type = input.type;

        if(!val) continue;

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

    for(let key in params){
      if(!params[key].length) delete params[key];
    }

    return {
        status: true,
        params: params
    };
};

const findData = (db, param, callback) => {
    //连接到表 customer_info.  如果没有就新建一个
    const collection = db.collection('customer_info');

    console.log("============= 连接collection成功 ============");

    //查询数据
    // const data = {
    //   name: "王自力"
    // };

    const data = param;
    console.log(param);
    collection.find(data).toArray(function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        renderHtml(result);
    });

};


const submit = () => {
    const {status, params} = getParams();
    console.log(status, params);
    MongoClient.connect(DB_CONN_STR, (err, db) => {
        if (err) {
            console.log("============= 连接数据库失败 ============");
            console.log('Error:' + err);
        } else {
            console.log("============= 连接数据库成功 ============");
            findData(db, params, (result) => {
                console.log("============= 插入数据成功 ============");
                console.log(result);
                db.close();
            });
        }


    });
};