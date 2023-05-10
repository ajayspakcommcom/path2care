/*jshint esversion: 6 */

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const sql = require("mssql");
const { isArray } = require("util");
require('dotenv').config();



//app.use(express.static(path.join(__dirname, "public")));

app.use("/", express.static(__dirname + "/public"));
app.use("/admin", express.static(__dirname + "/admin"));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());



const config = {
  server: "P3NWPLSK12SQL-v15.shr.prod.phx3.secureserver.net",
  user: "spakDb",
  password: "Spak@123-",
  port: 1433,
  database: "bsvDb",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};


app.get("/admin-dashbaord", (req, res) => {
  console.log('h3ere')
  res.sendFile(`${__dirname}/admin/dashboard.html`);
});


app.get("/report", (req, res) => {
  console.log('report1')
  res.sendFile(`${__dirname}/admin/report1.html`);
});

app.get("/chart", (req, res) => {
  console.log('report1')
  res.sendFile(`${__dirname}/admin/chart.html`);
});

app.get("/hospital-list", (req, res) => {
  console.log('Hospital List')
  res.sendFile(`${__dirname}/admin/hospital-list.html`);
});

app.get("/hospital-detail", (req, res) => {
  console.log('Hospital Detail')
  res.sendFile(`${__dirname}/admin/hospital-detail.html`);
});

app.post("/api", (req, res) => {
  console.log('method--->' + req.body.method);

  switch (req.body.method) {
    case "login":
      _userLogin(req.body).then((result) => {
        let response, success, msg, userDetiails;
        if (result.recordset.length > 0) {
          let rec = result.recordset[0]
          success = true;
          msg = 'Login successful'
          userDetiails = {
            empId: rec.EmpID,
            name: rec.firstName,
            post: rec.Designation,
            lastLogin: rec.lastLoginDate,
            targetLeft: 4
          }
        } else {
          success = false;
          msg = 'Login failed'
        }
        response = {
          success, msg, userDetiails
        };
        console.log(response)
        res.status(200).json(response);
      });
      break;
    case "getMedicine":
      console.clear();
      _getMedicine(req.body).then((response) => {
        res.status(200).json(response);
      });
      break;
    case "dataLog":
      console.clear();
      _dataLog(req.body).then((response) => {
        let rep = _prepareResponse(response)
        res.status(200).json(rep);
      });
      break;
    //
    case "adminuserlogin":
      console.clear();
      _adminuserlogin(req.body).then((response) => {
        let rep = _prepareResponse(response)
        res.status(200).json(rep);
      });
      break;
    case "getMychildforOrgChart":
      console.clear();
      _getMychildforOrgChart(req.body).then((response) => {

        //let rep = _prepareResponse(response)
        res.status(200).json(response.recordsets);
      });
      break;
    //
    case "loadDataForReport1":
      console.clear();
      _loadDataForReport1(req.body).then((response) => {

        //let rep = _prepareResponse(response)
        res.status(200).json(response.recordset);
      });
      break;
    case "loadDashboardReport":
      console.clear();
      _loadDashboardReport(req.body).then((response) => {
        // console.log('index js', response);
        res.status(200).json(response.recordset);
      });
      break;
    case "loadFilters":
      console.clear();
      _loadFilters(req.body).then((response) => {
        res.status(200).json(response.recordsets);
      });
      break;
    case "getHospitalList":
      console.clear();
      _getHospitalList(req.body).then((response) => {

        //let rep = _prepareResponse(response)
        res.status(200).json(response.recordsets);
      });
      break;
    //
    case "userModule":
      startModule(req.body).then((result) => {
        res.status(200).json({ message: "record added sucessfully" });
      });
      break;
    case "updateuserbadge":
      badgeEarned(req.body).then((result) => {
        res.status(200).json({ message: "badge earned sucessfully" });
      });
      break;

    // case "bucket":
    //   questionHTML = renderBucketQuestion(matchingQuestion);
    //   break;
    // case "chart":
    //   questionHTML = renderChartQuestion(matchingQuestion);
    //   break;
    default:
      //   getdata(req.body).then((result) => {
      //     res.status(200).json(result.recordset);
      //   });
      //console.log("Got body:", req.body.password);
      //console.log(req.body);
      break;
  }
});

app.listen(process.env.PORT || 3333, () => {
  console.clear();
  console.log("Application listening on port 3333!");
  console.log(process.env.USER_NAME);
  console.log(process.env.PASSWORD);

});

function _prepareResponse(response, flag = true) {
  console.log(response)
  console.log(response.recordset.length);

  flag = (response.recordset.length === 0) ? false : true;
  let res = {
    success: flag,
    message: (flag) ? 'API responded scuessfully' : 'API responded NOT scuessfully'
  }
  return res;

}


function _loadDashboardReport(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, ((objParam.empId) || null))
          .input("portalCode", sql.NVarChar, 'SERAVACC')
          .execute("USP_ADMIN_DASHBOARD_MEDICINE")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}
//

function _loadFilters(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, ((objParam.empId) || null))
          .input("portalCode", sql.NVarChar, 'SERAVACC')
          .execute("USP_ADMIN_REPORT_FILTERS")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}


function _loadDataForReport1(objParam) {
  console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("empId", sql.Int, ((objParam.empId) || null))
          .input("medId", sql.Int, ((objParam.medId) || null))
          .input("hospitalName", sql.NVarChar, ((objParam.hospitalName) || null))
          .input("hospitalCity", sql.NVarChar, ((objParam.hospitalCity) || null))
          .input("fromDate", sql.NVarChar, ((objParam.fromDate) || null))
          .input("toDate", sql.NVarChar, ((objParam.toDate) || null))
          .input("portalCode", sql.NVarChar, 'SERAVACC')
          .execute("USP_REPORT_1")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}

function _userLogin(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("email", sql.NVarChar, objParam.email)
          .input("password", sql.NVarChar, objParam.password)
          .input("portalCode", sql.NVarChar, process.env.PORTAL_NAME)
          .execute("USP_VALIDATE_USER")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });

}

function _getMedicine(objParam) {
  //console.log(objParam)
  let response;
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("portalCode", sql.NVarChar, process.env.PORTAL_NAME)
          .execute("USP_GET_MEDICINES_LIST")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function _dataLog(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("OrderDate", sql.SmallDateTime, objParam.logDate)
          .input("EmpID", sql.SmallInt, objParam.empId)
          .input("MedID", sql.SmallInt, objParam.medId)
          .input("noOfPaitents", sql.SmallInt, objParam.noOfPaitent)
          .input("DoctorsName", sql.NVarChar, objParam.drName)
          .input("DoctorID", sql.NVarChar, objParam.drCode)
          .input("noOfVials", sql.SmallInt, objParam.noOfVials)
          .input("HospitalName", sql.NVarChar, objParam.hospitalName)
          .input("HospitalCity", sql.NVarChar, objParam.hospitalCity)
          .input("indication", sql.NVarChar, objParam.indication)
          .input("speciality", sql.NVarChar, objParam.speciality)
          .execute("USP_LOG_USER_MEDICINE_DETAILS")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

/**
 * ADMIN FUNCTIONS
 */

function _adminuserlogin(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("username", sql.NVarChar, objParam.username)
          .input("password", sql.NVarChar, objParam.password)
          .execute("USP_VALIDATE_ADMIN_USER")
          .then(function (resp) {
            //console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

//
function _getHospitalList(objParam) {
  console.clear();
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("stateName", sql.VarChar, objParam.stateName)
          .execute("USP_GET_STATE_HOSPITALS")
          .then(function (resp) {
            console.log('Ajay', resp);
            //_processHirarchyData(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}


function _getMychildforOrgChart(objParam) {
  console.clear();
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          // .input("empID", sql.SmallInt, objParam.parentId)
          .execute("USP_GET_CHART_RECORDS")
          .then(function (resp) {
            //console.log(resp);
            //_processHirarchyData(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

// function _processHirarchyData(data) {
//   console.clear();
//   console.log(data);
//   let response = {

//   }
// }

/** *********** OLD REFERENCE */

function startModule(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("userId", sql.Int, objParam.userId)
          .input("moduleId", sql.Int, objParam.moduleId)
          .input("subModuleId", sql.Int, objParam.subModuleId)
          .execute("USP_UPDATE_USER_MODULES_DETAILS")
          .then(function (resp) {
            resolve("Sucess");
            dbConn.close();
          })
          .catch(function (err) {
            // console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function badgeEarned(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("userId", sql.Int, objParam.userId)
          .input("moduleId", sql.Int, objParam.moduleId)
          .input("subModuleId", sql.Int, objParam.subModuleId)
          .input("BadgeEarned", sql.NVarChar, objParam.BadgeEarned)
          .execute("USP_USER_EARN_BADGE")
          .then(function (resp) {
            resolve("Sucess");
            dbConn.close();
          })
          .catch(function (err) {
            //  console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        // console.log(err);
      });
  });
}
function getdata(objParam) {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .input("fullname", sql.NVarChar, objParam.fullname)
          .input("email", sql.NVarChar, objParam.email)
          .input("phone", sql.NVarChar, objParam.phone)
          .input("password", sql.NVarChar, objParam.password)
          .execute("USP_VALIDATE_USER")
          .then(function (resp) {
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            // console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        //console.log(err);
      });
  });
}

function getdataQuery() {
  return new Promise((resolve) => {
    var dbConn = new sql.ConnectionPool(config);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .query("select * from tblDeepUsers")
          .then(function (resp) {
            // console.log(resp);
            resolve(resp);
            dbConn.close();
          })
          .catch(function (err) {
            //  console.log(err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        // console.log(err);
      });
  });
}

