'use strict'; 

 
var recordSet = []; 
// F20 ============================ DB호출 ===============================

// 일반호출 : 데이터 보기 
 
function viewData(eflagVal) {
  
  const mariadb       = require('mariadb/callback');
  const dbconfig      = require('../config/mariaDBConfig');

  let   connection    = mariadb.createConnection(dbconfig);
  
  let   sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE eflag = ? "; 
  
   // DB접속 
    
   // CF1-START
   connection.query(sqlBody, [eflagVal],function (err, results) {
     
        if (err) throw err;

        // console.log(' >>> results=', results); 
        console.log('VN-490 record count= ' +  JSON.stringify(results)  ) ; 
        console.log('VN-500 results= ' +  JSON.stringify(results)  ) ; 
        connection.end(); 
    });
      // CF1-END 
 
}; 
// EOF viewData 

// 데이터 보기 
viewData(100); 
   