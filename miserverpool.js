'use strict'; 

/*
- PrgId : AISS-ND-1000 
- PrgName : ndmidevice 
- Date : 2020. 01. 02 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v0.91  
- Description : socket server for soynet device operation 
- Usage 
1) startup : sudo node miserverpool.js  ( or sudo forever start miserver.js )  
2) stop : sudo killall node ( including other node service instances )
3) socket address ( 88 means port numbers which could be changed. )
   ws://localhost:88/socket?deviceid=10111  
   wss://localhost:442/socket?deviceid=10111
4) Test URL ( if web is allowed ~ ) 
   http://ip:3000/demo/miuser.html 
 - History
 v0.91 : initial 
 v0.92 : separate query ( using connection pool )  
*/ 

const express       = require('express');
const app           = express();
const PORT          = process.env.PORT = 3000;          // 웹을 열 경우에 사용 

//  ==================== F10. 소켙관련 라이브러리 및 변수선어 ====================
//  소켙라우터  
var socketRouter    = require('./routes/misocket');    // 소켙통신 

// 상태목록 호출 라이브러리  (경로명에 유의)
var deviceStatusSet = require('./dataset/dataDeviceSetPool');   

var deviceArr       = [];       // D1. 설정상태 기기목록 콜렉션
var deviceCnt       = 0;        // D2. 설정상태 기기수량 
var deviceOutStr    = "";       // D3. 설정상태 기기목록 문자열 

// 글로벌 변수선언 ( 사용처 : misocket.js에서 기기정보 (D1~D3)를 확인할 목적으로 사용)
global.deviceStatusSet = deviceStatusSet; 

// F22. 기기상태 점검 타이머
var deviceStatusChecker;            
var deviceCheckCnt      = 0;    // 체크 횟수 

// F23. 초기상태코드 
// var initstatuscdVal     = "A";       // A:열림, C:닫힘, Y:동작완료 
var allowWebUpd         = true;     // 웹접속허용(true : 허용, false:불허 - 단지 소켙만 허용 )
var consoleUpd          = true;    // 콘솔출력여부 ( true : 출력, false : 미출력 )

 
// 소켙 통신  
app.use('/misocket', socketRouter);                
 
//  ==================== F20. 기기상태정보 목록 설정  ====================


// F10. 기기세트 정보전달 Good 
function setDeviceStatusList(statusCdVal) {
 
    // 모듈에서 데이터셑 호출 
    deviceStatusSet.getDeviceFlagSet(statusCdVal)
    .then( function(results){ 
        // 공용 결과셑에 설정 
        deviceArr = results; 
        // 결과셑 수량 확인 
        deviceCnt = deviceArr.length; 
    })
    .catch(function(err){
        console.log("P10 Promise rejection error: " + err);
    });
 
}; 
// EOF F10
  
// F022. 타이머 기동 
function startDeviceChecker(statusCdVal) {

    // 0.5 간격으로 상태체크 ( 0.1 ~ 3초 간격으로 상태확인 설정 )
    let deviceCheckTime     = 1000; 
   
    console.log("\nDCC-100 START deviceStatusChecker "); 	
    
    // 체크 횟수 초기화 
    deviceCheckCnt = 0; 

    // 특정 시간 간격으로 체크진행 : 기기상태목록 데이터를 계속갱신하고 열림/담힘 혹은 기타 기기 메시지를 확인후에 처리함. 
    deviceStatusChecker = setInterval(function () {  					 		 
         
        // 기기상태목록 데이터 확인    
        setDeviceStatusList(statusCdVal); 
        
        // 열림/담힘메시지 확인 
        checkActionMsg(deviceArr); 

        deviceCheckCnt++; // 체크횟수 1증대 
        
        if ( consoleUpd == true )
        console.log("\nDCC-100 RUN check Cnt=" + deviceCheckCnt + " / devicecnt=" + deviceCnt ); 

    }, deviceCheckTime );	  	 

}; 
// EOF F15. 체크타이머   
 
// F16. 체커 기동중지 
function stopDeviceChecker() {
    
    if ( deviceStatusChecker != null ) {
        console.log("DCC-200 STOP deviceStatusChecker "); 
        clearInterval(deviceStatusChecker);
    };

}; 
 
// F17. 소켙상태 - 열림 
function checkSocketOpen(paramDeviceId) {
    
    let actionCode = "ACTION-100"; 
    let actionDesc = "Open the door";
    let socketMsg  = ""; 
    
    // 디바이스에 해당하는 소켙호출 
    let currWss = wshashtable.get(paramDeviceId); 

    if ( currWss == null || currWss == undefined ) {
        if ( consoleUpd == true )
        console.log("Open-SK11 ws no connect for " + paramDeviceId ); 
        return false; 
    }
    else {
        // 소켙전달 메시지  ex) ACTION-100||Open the door 
        socketMsg = actionCode + "||" + actionDesc; 
         
        console.log(actionCode + " ws for " + paramDeviceId + " >> open request!!"); 
        currWss.send(socketMsg); 
    }; 
   
}; 
// EOF F17. 

// F18. 소켙상태 - 닫힘 
function checkSocketClose(paramDeviceId) {

    let actionCode = "ACTION-200"; 
    let actionDesc = "Close the door";
    let socketMsg  = ""; 
    
    // 디바이스에 해당하는 소켙호출 
    let currWss = wshashtable.get(paramDeviceId); 
 
    if ( currWss == null || currWss == undefined ) {
        if ( consoleUpd == true )
        console.log("Close-SK21 ws no connect for " + paramDeviceId ); 
        return false; 
    }
    else {
        // 소켙전달 메시지  ex) ACTION-200||Close the door 
        socketMsg = actionCode + "||" + actionDesc; 
        
        console.log(actionCode + " ws for " + paramDeviceId + " >> close request!!"); 
        currWss.send(socketMsg); 
    }; 
   
}; 
// EOF F18. 


// 기기목록에서 요청 정보 확인 (Later)
function checkNum(deviceid) {

    for ( obj in reqDevArr ) {

        let did = obj.did; 
        let num = obj.num; 
        // 존재하고 있음. 
        if (deviceid == did) {
            return num; 
        };
    }; 

}; 
 
// ===================== F31. 기기 열림 및 닫힘 소켙메시지 전달  ==========================
function checkActionMsg(deviceArr) {
     
    let currDeviceid;               // 현재 디바이스ID 
    let currStatusCd;               // 현재 상태 코드 
    let dvObj = {};                 // 디바이스 객체  
    let i = 0;
    let acnt = deviceArr.length;    // 특정 상태목록 수량 
    // let reqDevArr   = [];          // 요청목록 
    // let reqObj      = {};          // {'did':'1234','num','2'}; 
 
    // For F31-A. 디바이스상태별 후속처리  
    for( i = 0; i < acnt ; i++ ) {

        // C1. 디바이스 객체 
        // ex) 디바이스 오브젝트 dObj = {"deviceid":"111111","statuscd":"A","opentm":"08:30:00","closetm":"03:00:00"}
        dvObj =  deviceArr[i] ; 
        // console.log("DV11 dobj=" + JSON.stringify(dvObj) ); 

        // C2. 현재 디바이스 ID 
        currDeviceid = dvObj.deviceid; 
        
        // C3. 현재 디바이스 상태 
        currStatusCd = dvObj.statuscd;
        
        if ( consoleUpd == true )
        console.log("DV12 Device currDeviceid=" + currDeviceid + " / statuscd=" + currStatusCd); 

        if (currStatusCd === 'A' ) {
            // 소켙으로 오픈통지 
            checkSocketOpen(currDeviceid);
        }
        else if (currStatusCd === 'C' ) {
            // 소켙으로 열림통지 
            checkSocketClose(currDeviceid);
        }
        else {
            // Do nothing!  
        };
        // EOF 
         
    }; 
    // EOF For F31-A
}; 
// EOF F31. 기기 열림 및 닫힘 소켙메시지 전달 종료 
 
// ========= F40 기동과 동시에 A상태의 기기목록 호출 ============= 
startDeviceChecker("A"); 
 
 
// ============= F50 앱리스너 : 소켙만 열경우 필요없음 ============= 
if ( allowWebUpd === true )  {

    // 정적 데이터 디렉토리 설정 
    app.use(express.static('public'));
     
    app.listen(PORT, () => {
        let msg; 
        msg = "mideviceServer V1.91 is running at: " + PORT; 
        //console.log('Node WebServer V1.877  is running at:', PORT);
        console.log(msg);   // 콘솔 
    }); 
       
}; 

  