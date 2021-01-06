'use strict'; 

/*
- PrgId : AISS-ND-1000 
- PrgName : ndmidevice 
- Date : 2020. 01. 02 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v0.91  
- Description : socket server for soynet device operation 
- Usage 
1) startup : sudo node miserverchk.js  ( or sudo forever start miserver.js )  
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
var socketRouter    = require('./routes/misocketchk');    // 소켙통신 (chk)

// 상태목록 호출 라이브러리  (경로명에 유의)
var checkStatusSet = require('./dataset/checkDeviceStatus');   

// F23. 초기상태코드 
var allowWebUpd         = true;     // 웹접속허용(true : 허용, false:불허 - 단지 소켙만 허용 )
var initstatuscdVal     = "C";       // A:열림, C:닫힘, Y:동작완료 

// 기동과 동시에 initstatuscdVal 상태의 기기목록 호출 
checkStatusSet.startDeviceChecker(initstatuscdVal); 
       
// 소켙 통신  
app.use('/misocket', socketRouter);                
  
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

  