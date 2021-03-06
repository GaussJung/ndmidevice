﻿'use strict'; 
 
// F20 ============================ DB호출 : 방식2 프리미스 ===============================
 
const mariadb       = require('mariadb/callback');
const dbconfig      = require('../config/mariaDBConfig');

let   connection    = mariadb.createConnection(dbconfig);
 
var viewData = function(bnum){

    let   sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE eflag = ? "; 

    // 성공시 resolve, 실패시 reject 
    return new Promise(function(resolve, reject){
      // SQL 호출 
      connection.query(sqlBody,  [bnum], 
          function(err, results){                                                
              if( results === undefined){
                reject(new Error("E10-results is undefined"));
                connection.end(); 
              }
              else{
                console.log('S10 results=' + JSON.stringify(results) ) ; 
                resolve(results);
                connection.end(); 
              };
          }
      )}
  )};


// 프리미스 함수 호출 
viewData(100)
.then( function(results){
  render(results)
})
.catch(function(err){
  console.log("Promise rejection error: "+err);
})

// 결과출력 
var render = (rset) => console.log( "RET=" + JSON.stringify(rset) ); 
 

 