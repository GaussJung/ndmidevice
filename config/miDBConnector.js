﻿// mi서비시용 마리아 DB 설정 
const mariadb = require('mariadb');

var dbconfig = require('./miDBConfig');  // 동일 디렉토리 설정화일 확인 

// 접속 풀설정 : 접속 수량 10개 
const pool = mariadb.createPool({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 10
});
 
// DB접속자 
function miDBConnector() {

    // 접속정보 가져오기 
    this.getConnection = function(callback) {
        pool.getConnection()
            .then(conn => {
                callback(conn);
            }).catch(err => {
            //not connected
        });
    };
 
    // JSON 데이터 전달 (통신전달가능)
    this.sendJSON = function(response, httpCode, body) {
         let result = JSON.stringify(body);
         // response.send(httpCode, result);
         response.send( result);
    };
    
};

console.log("LIB-100 Load miDBConnector"); 

module.exports = new miDBConnector();