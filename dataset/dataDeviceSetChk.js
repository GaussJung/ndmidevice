'use strict'; 

console.log("\nDS V1.8 DataDeviceSetChk - using pool "); 
 
// F20 ============================ DB호출 : 방식2 프리미스 + 접속 Pool  ===============================
 
const mariadb       = require('mariadb/callback');
const dbconfig      = require('../config/miDBConfig');   // 동일 디렉토리 설정화일 확인 
const dbutil        = require('./dbutil');   // 동일 디렉토리 설정화일 확인 

const consoleUpd     = true;     // 콘솔출력여부 ( true : 출력, false : 미출력 )
 
// F30. 접속 Pool 정의 =======================================================================================
const dbpool = mariadb.createPool({
   host: dbconfig.host,
   port: dbconfig.port,
   user: dbconfig.user,
   password: dbconfig.password,
   database: dbconfig.database,
   connectionLimit: 7
});

 

// F100.  플래그에 해당하는 정보목록 내려보내기   =======================================================================================
function getDeviceFlagSet (statusCdVal) { 
 
   // 인자확인 
   // console.log("DG150 Param statusCdVal=" + statusCdVal ); 

   // 정적 바인딩으로 데이터 호출 
   let sqlBody = "SELECT deviceid, statuscd, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5";

   return new Promise(function(resolve, reject){
       // if DP1. 풀접속 
       dbpool.getConnection((cerr, conn) => {
           // if E1. 접속진행 
           if (cerr) {
             reject(new Error("E101- A10 connection is undefined cerr=" + cerr));
             conn.end(); 
           } 
           else {
               console.log("V1.1 A10 connected ! connection id is " + conn.threadId);

               // SQ1 호출 (qerr : query error )
               conn.query(sqlBody,  [statusCdVal], function(qerr, results){           

                   if( results === undefined){
                       reject(new Error("E101-results is undefined qerr=" + qerr));
                       conn.end(); 
                   }
                   else{
                       // 성공함 
                       console.log('E102 A10 result cnt=' + results.length) ; 
                       if ( consoleUpd === true ) console.log('S101-results=' + JSON.stringify(results) ) ; 
                       // 결과값 보기 ( 레코드셑 인경우 : 선택 )
                       if ( consoleUpd === true ) dbutil.viewField(results); 
                       resolve(results);
                       conn.end(); 
                   };

               })
               // EOF SQ. conn.query
           }; 
           // EOF E1 
       });
       // EOF. DP1
   });
   // EOF Promise PM-A
}; 
// EOF F100 
  

// F200.  다중 플레그 : 복수기기상태  =======================================================================================
function getDeviceAllSet() { 
 
    // 정적 바인딩 항목없음 
    let sqlBody = "SELECT deviceid, statuscd, opentm, closetm FROM biz_device_info WHERE statuscd IN ('A','C') Limit 0, 10"; 
    return new Promise(function(resolve, reject){
        // if DP1. 풀접속 
        dbpool.getConnection((cerr, conn) => {
            // if E1. 접속진행 
            if (cerr) {
                reject(new Error("E101- A20 connection is undefined cerr=" + cerr));
                conn.end(); 
            } 
            else {
                console.log("V1.1 A20 connected ! connection id is " + conn.threadId);
 
                // SQ1 호출 (qerr : query error )
                conn.query(sqlBody, function(qerr, results){           
                    // if R1 
                    if( results === undefined){
                        reject(new Error("E101-results is undefined qerr=" + qerr));
                        conn.end(); 
                    }
                    else{
                        // 성공함 
                        console.log('E102 A20 result cnt=' + results.length) ; 
                        if ( consoleUpd === true ) console.log('S101-results=' + JSON.stringify(results) ) ; 
                        // 결과값 보기 ( 레코드셑 인경우 : 선택 )
                        if ( consoleUpd === true ) dbutil.viewField(results); 
                        resolve(results);
                        conn.end(); 
                    };
 
                })
                // EOF SQ. conn.query
            }; 
            // EOF E1 
        });
        // EOF. DP1
    });
    // EOF Promise PM-A
 }; 
 // EOF F200. 복수기기상태 

 
// F400.  기기상태 갱신  =======================================================================================
function setDeviceStatus(paramDeviceid, statusCdVal) {
 
    // 상태코드갱신 특정 디바이스 
    let sqlBody = "UPDATE biz_device_info set statuscd = ? WHERE deviceid = ? "; 
 
    return new Promise(function(resolve, reject){
        // if DP1. 풀접속 
        dbpool.getConnection((cerr, conn) => {
            // if E1. 접속진행 
            if (cerr) {
                reject(new Error("E101 A30 connection is undefined cerr=" + cerr));
                conn.end(); 
            } 
            else {
                console.log("V1.1 A30 connected ! connection id is " + conn.threadId);
 
                // SQ1 호출 (qerr : query error )
                conn.query(sqlBody, [statusCdVal, paramDeviceid], function(qerr, results){           
 
                    if( results === undefined){
                        reject(new Error("E101-results is undefined qerr=" + qerr));
                        conn.end(); 
                    }
                    else{
                        // 성공함 
                        if ( consoleUpd === true ) console.log('S101-Update results=' + JSON.stringify(results) ) ; 
                        resolve(results);
                        conn.end(); 
                    };

                })
                // EOF SQ. conn.query exec  
            }; 
            // EOF E1 
        });
        // EOF. DP1
    });
    // EOF Promise PM-A
 }; 
 // EOF F300. 기기상태갱신 
 

// F400.  디바이스 한개에 해당하는 정보 전달   =======================================================================================
function getDeviceInfo(paramDeviceId) { 
 
    // 인자확인 
    // console.log("DG150 Param statusCdVal=" + statusCdVal ); 
 
    // 정적 바인딩으로 데이터 호출 
    let sqlBody = "SELECT deviceid, statuscd, opentm, closetm FROM biz_device_info WHERE deviceid = ? ";
 
    return new Promise(function(resolve, reject){
        // if DP1. 풀접속 
        dbpool.getConnection((cerr, conn) => {
            // if E1. 접속진행 
            if (cerr) {
              reject(new Error("E101- A40 connection is undefined cerr=" + cerr));
              conn.end(); 
            } 
            else {
                console.log("V1.1 A40 connected ! connection id is " + conn.threadId);
 
                // SQ1 호출 (qerr : query error )
                conn.query(sqlBody,  [paramDeviceId], function(qerr, results){           
 
                    if( results === undefined){
                        reject(new Error("E102 A40 results is undefined qerr=" + qerr));
                        conn.end(); 
                    }
                    else{
                        // 성공함 
                        console.log('E102 A40 result cnt=' + results.length) ; 
                        if ( consoleUpd === true ) console.log('S101 A40 results=' + JSON.stringify(results) ) ; 
                        // 결과값 보기 ( 레코드셑 인경우 : 선택 )
                        if ( consoleUpd === true ) dbutil.viewField(results); 
                        resolve(results);
                        conn.end(); 
                    };
 
                })
                // EOF SQ. conn.query
            }; 
            // EOF E1 
        });
        // EOF. DP1
    });
    // EOF Promise PM-A
 }; 
 // EOF F400 
  
 
 // ============= 모듈 호출 ==================================================
 
// DF100. 단일 기기상태 호출 
exports.getDeviceFlagSet = getDeviceFlagSet;  

// DF200. 다중 기기상태 호출 
exports.getDeviceAllSet = getDeviceAllSet; 
 
// DF300. 기기상태 갱신 
exports.setDeviceStatus = setDeviceStatus;  

// DF400. 기기정보 가져오기 
exports.getDeviceInfo = getDeviceInfo;  
