 
// E10. DB접속자 (경로에 유의할것!!)
var dbConnector = require('../config/miDBConnector');

var resultSetArr     = [];       // 결과값 배열 

var resultSetStr      = "";       // 결과값 문자열 

var consoleUpd       = true;    // 콘솔출력여부 ( true : 출력, false : 미출력 )
 
// E20. 필드값 보기 
function viewField(fArr) {
    // 보기출력 변수설정 
    let fcnt = fArr.length; 
    let i = 0; 
    let fobj = {}; 

    if ( fcnt == 0 ) return false;  // 값이 없음. 

    // console.log("DG08 ArrAll=" + JSON.stringify(fArr) ); 

    // console.log("DG09 field cnt=" + fcnt ); 
  
    for ( i=0; i < fcnt; i++ ) { 
        // 필드값 출력 
        fobj = fArr[i]; 
        console.log("DG15=" + JSON.stringify(fobj) );  // 직원정보 객체 출력 
        // console.log("DG15-1 ecd=" + fobj.ecd );   // 직원번호 출력 
    }; 
}; 

// E30. 플래그에 해당하는 정보목록 내려보내기 
function getDeviceFlagSet(statusCdVal) {
 
    let dataResultStr   = "";   // 값 전달 데이터 문자열 
 
    let sqlBody         = "";   // 접속 SQL 

    resultSetArr        = [];  // 초기화 

    resultSetStr        = "";  // 결과값 문자열 초기화 
 
    // 상태코드 정보에 따른 데이터 호출 (최대5개 - TEST)
    // sqlBody  ex) "SELECT deviceid, devicenm, opentm, closetm FROM biz_device_info WHERE statuscd = 'A' Limit 0, 5 "; 
    sqlBody = "SELECT deviceid, statuscd, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5"; 
 
    // 시간측정 
    if ( consoleUpd == true ) console.time("DBK-EX03"); 

    dbConnector.getConnection(function(conn) {
              
         // 정적변수 바인딩 후에 SQL호출 (아래  바인딩 항목 유의 [statusCdVal] )
         conn.query(sqlBody,[statusCdVal]) 
            .then((results) => {
                resultSetArr = results;   // 결과배열 
                resultSetStr = JSON.stringify(resultSetArr);  // 결과문자열 
                // console.log("DG12 resultSetStr=" +  resultSetStr  ); 
                // viewField(results); // 컬럼값 보기 (테스트시에)
                if ( consoleUpd == true ) console.timeEnd("DBK-EX03");  // 실행시간 출력 
                conn.end();   // 접속종료 
            })
            .catch(err => {
                // 오류로그 출력 및 접속종료 
                console.log(err);
                conn.end();
            })
            
    });
 
}; 
// EOF E30. 
 
// E40. 플래그에 해당하는 정보목록 전체 보내기 
function getDeviceAllSet() {
 
    let dataResultStr   = "";   // 값 전달 데이터 문자열 
 
    let sqlBody         = "";   // 접속 SQL 

    resultSetArr        = [];  // 초기화 

    resultSetStr        = "";  // 결과값 문자열 초기화 
 
    // 상태코드 정보에 따른 데이터 호출  A:오픈, C:닫힘 
    sqlBody = "SELECT deviceid, statuscd, opentm, closetm FROM biz_device_info WHERE statuscd IN ('A','C') Limit 0, 10"; 
 
    // 시간측정 
    if ( consoleUpd == true ) console.time("DBK-EX04"); 

    dbConnector.getConnection(function(conn) {
              
         // 정적변수 바인딩 후에 SQL호출 
         conn.query(sqlBody) 
            .then((results) => {
                resultSetArr = results;   // 결과배열 
                resultSetStr = JSON.stringify(resultSetArr);  // 결과문자열 
                // console.log("DG12 resultSetStr=" +  resultSetStr  ); 
                // viewField(results); // 컬럼값 보기 (테스트시에)
                if ( consoleUpd == true ) console.timeEnd("DBK-EX04");  // 실행시간 출력 
                conn.end();   // 접속종료 
            })
            .catch(err => {
                // 오류로그 출력 및 접속종료 
                console.log(err);
                conn.end();
            })
            
    });
 
}; 
// EOF E40. 


// E50. 기기 디바이스 상태정보 수정 ( ex: setDeviceStatus('D111111', 'Y')  ) 
function setDeviceStatus(paramDeviceid, statusCdVal) {
 
    let dataResultStr   = "";   // 값 전달 데이터 문자열 
 
    let sqlBody         = "";   // 접속 SQL 

    resultSetArr        = [];  // 초기화 

    resultSetStr        = "";  // 결과값 문자열 초기화 
 
    // 상태코드갱신 특정 디바이스 
     sqlBody = "UPDATE biz_device_info set statuscd = ? WHERE deviceid = ? "; 
    
     // 인자확인 
     if ( consoleUpd == true ) console.log("P1 deviceid=" + paramDeviceid + " / statuscd=" + statusCdVal); 

    // 시간측정 
    if ( consoleUpd == true ) console.time("DBK-EX05"); 
 
    dbConnector.getConnection(function(conn) {
              
         // 정적변수 바인딩 후에 SQL호출 (아래  바인딩 항목 유의 [statusCdVal] )
         conn.query(sqlBody,[statusCdVal, paramDeviceid]) 
            .then((res) => {
                // 갱신정보 
                console.log(res); // log  ex ) { affectedRows: 1, insertId: 1, warningStatus: 0 }
                if ( consoleUpd == true ) console.timeEnd("DBK-EX05");  // 실행시간 출력 
                conn.end();   // 접속종료 
            })
            .catch(err => {
                // 오류로그 출력 및 접속종료 
                console.log(err);
                conn.end();
            })
            
    });
 
}; 
// EOF E50. 

// 결과세트 확인 
exports.getResulSetArr = function() {
  return resultSetArr;
}; 

// 결과문자열 확인 
exports.getResulSetStr = function() {
    return resultSetStr;
}; 

// 호출방법  getEmpFlagSet(100)
console.log("\nDS12-Added DataDeviceSet"); 

// 단일 플래그 세트가져오기 
exports.getDeviceFlagSet = getDeviceFlagSet;  

// 다중 기기 세트 가져오기 
exports.getDeviceAllSet = getDeviceAllSet;  
 
// 기기 상태 변경하기 
exports.setDeviceStatus = setDeviceStatus;  
 