'use strict';
 
var express = require('express');

var router 	= express.Router();             

var Hashtable = require('jshashtable');     // 해시테이블 

// F30 ================  웹소켓  ========================= 
// 호출주소 
// 일반접속  :  ws://serverip:1001/socket
// 보안접속  :  wss://serverip:1001/socket
 
const WebSocket = require('ws');    // 소켙라이브러리 호출 

var allmcnt   = 0;                  // 전체 메시지 수량 
var conncnt   = 0;                  // 소켙 접속 횟수 (전체)
var socketPort = 88; 
var wshashtable = new Hashtable();  // 웹소켙 객체추가 

// 메인에서 해시테이블 상태확인 
global.wshashtable = wshashtable;

const webSkt = new WebSocket.Server({
  port: socketPort,
});
  
// F30. 소켙오류 처리 
const sendError = (wskt, errmessage) => {

  const messageObject = {
     type: 'ERROR',
     payload: errmessage,
  };

  let outMsg = JSON.stringify(messageObject); 

  console.log("SC100 Error outMsg=" + outMsg); 

  // Send Error Msg 
  wskt.send(JSON.stringify(messageObject));

};
// EOF F30. 


// F29. 디바이스정보확인 ws://121.11.23.3/socket?deviceid=10004&user=james --> 10004
function getDeviceId(srcURL) {

    let tmpStr = ""; 
    console.log("P10 URL=" + srcURL);
    // aaa.replace(/(.+)\.html/,"\\$1");
    
    // 인자값이 있을 경우 진행함. 
    if (srcURL.indexOf("?") === -1 ) {
         return ""; 
    }
    else {
        // deviceid인자확인 
        tmpStr = srcURL.replace(/.+deviceid=([^&]+).*/,"$1"); 
        console.log("P20 deviceid=" + tmpStr);
    }; 
}; 

// F31. 기기 오픈 전달  (참조로 생성한 함수 : 필요시 진행)
function checkOpenMsg(paramDeviceArr) {
    
    let currlWss; 
    let currDeviceid; 
    let dvObj = {};  // 디바이스 객체  
    let i = 0;
    let acnt = paramDeviceArr.length; 

    // ex) 디바이스 오브젝트 dObj = {"deviceid":"111111","opentm":"08:30:00","closetm":"03:00:00"} 
    for( i = 0; i < acnt ; i++ ) {

        dvObj =  paramDeviceArr[i] ; 

        console.log("DV11 dobj=" + JSON.stringify(dvObj) ); 
    
        currDeviceid = dvObj.deviceid; 
    
        console.log("DV12 Device currDeviceid=" + currDeviceid); 
  
    }; 
    
}; 


// F41-a. 웹소켙접속 메시지 (전달)
webSkt.on('connection', (wskt, request) => {
       
    // 확인가능  request.url ex)  ws://121.11.23.3/socket?deviceid=10004&user=james
    let conuri =  request.url; 

    //  디바이스확인  ws://121.11.23.3/socket?deviceid=10004&user=james --> 10004
    let deviceid = conuri.replace(/.+deviceid=([^&]+).*/,"$1");

    let devicdInfoStr = ""; // 기기정보 

    console.log( "SC10 conuri=" + conuri + " / deviceid=" + deviceid); 

    let pfnow     = 0.0;        // 현재 시간 millisec 

    let curmcnt   = 0.0;        // 현재메시지 수량 
 
    // 웹소켙 접속시 정보를 추가함. 
    wshashtable.put(deviceid, wskt);

    conncnt++;    // 현재 접속 수량증대 (참고정보)

    wskt.send('Connected To mi WebSocket V1.4 conncnt=' + conncnt);
 
     // F33-1. binding message (메시지 요청이 왔을 경우에 소켙서버에서 보내기 : 리액션임)
     // 메시지를 받은 경우에 DB상태를 변경하거나 다른 소켙에 메시지를 보내거나 등의 후속 처리 진행 
     wskt.on('message', (indata) => {

        let fmessage  = "";
        let msgtmp = ""; 
        // 현재시간 ( millisec )
        pfnow = process.hrtime(); 
        curmcnt++;  // 현재메시지 수량 
        allmcnt++;  // 전체 메시지 접속수량 증대 
    
        console.log( "SC90 indata=" + JSON.stringify(indata) ); 

        // SF05. Parse Message 
        try {
            // fmessage = JSON.parse(indata);
            fmessage = indata; 
            //console.log( "SC91 success fmessage=" + indata ); 
        } 
        catch (err) {
            sendError(wskt, 'Wrong format Err SE-150 err=' + err);
            return;
        }; 
        // EOF SF05. 

        // 입력데이터에 액션데이터가 있는지 확인 
        if ( indata.indexOf("ACTION-100||SUCCESS") > -1 ) {

            // 열기완료 setDeviceStatus('D111111', 'Y')
            console.log("D09-K Final Open" ); 
            
            // 모듈에서 데이터 갱신 호출 
            deviceStatusSet.setDeviceStatus(deviceid,'Y')
            .then( function(results){ 
                // 열림상태 설정성공 
                msgtmp = "\nUD20-A Update Open Success deviceid=" + deviceid; 
                console.log(msgtmp);
                wskt.send(msgtmp); 
            })
            .catch(function(err){
                // 열림상태 설정오류 
                msgtmp = "\nUD20-B Update Open Fail deviceid=" + deviceid + " / err : " + err; 
                console.log(msgtmp);
                wskt.send(msgtmp); 
            });
             
        }
        else  if ( indata.indexOf("ACTION-200||SUCCESS") > -1 ) {
 
            // 모듈에서 데이터 갱신 호출 
            deviceStatusSet.setDeviceStatus(deviceid,'Y')
            .then( function(results){ 
                // 닫힘상태설정 완료 
                msgtmp = "\nUD30-A Update Close Success deviceid=" + deviceid; 
                console.log(msgtmp);
                wskt.send(msgtmp); 
            })
            .catch(function(err){
                // 닫힘상태설정 오류 
                msgtmp = "\nUD30-B Update Close Fail deviceid=" + deviceid + " / err : " + err; 
                console.log(msgtmp);
                wskt.send(msgtmp); 
            });
 
        }
        else {

            let metaStr = "\nV1.41 Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
            
            let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
         
             console.log("\n ========================= D11K deviceid=" + deviceid); 
            
            // if D1. 디바이스 정보 확인후 병행 전달 
            if ( deviceid != null && deviceid.length > 0 ) {
 
                // 모듈에서 데이터셑 호출 
                deviceStatusSet.getDeviceInfo(deviceid)
                .then( function(results){ 
                    
                    // 기기정보 문자열화 (정보가 넘어온 경우에만 ) 
                    if ( results.length > 0 ) {
                        devicdInfoStr = JSON.stringify(results); 
                        finalMsg += "\n" + devicdInfoStr; 
                    }; 
                   
                    console.log( "D11G-A devicdInfoStr=" + devicdInfoStr + " / finalMsg=" + finalMsg ); 
 
                    // M10. 메시지 송부 
                    wskt.send(finalMsg); 
                })
                .catch(function(err){

                    console.log( "D11G-A devicdInfoStr=" + devicdInfoStr + " / finalMsg=" + finalMsg ); 
                    console.log("P10 Promise rejection error: " + err);
                });
 
            }
            else {
                // M20. 기기정보 없이 메시지 송부 
                wskt.send(finalMsg); 
            }; 
            // EOF D1 
  
        }; 
  
    });
    // EOF F33-1. message binding 
    
    // F33-2. 웹소켙 종료 
    wskt.on('close', function(reasonCode, description) {
        // 소켙해쉬에서 제거 
        wshashtable.remove(deviceid); 
        console.log((new Date()) + ' Peer disconnected.');
    });
    // EOF F33-2
});
// EOF F41-a 
 
// F42. 웹소켙종료 
webSkt.on('close', function close() {
    console.log("CLOSED"); 
});

module.exports = router;

