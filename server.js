

/*
- PrgId : UT-ND-1000  111
- PrgName : server.js at ndmodevoce 
- Date : 2020. 03. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v0.313  
- Description : Normal webRTC server for Untact Exam Service 
- Usage 
1) startup : sudo node server.js  ( or sudo forever start server.js )  
2) stop : sudo killall node ( including other node service instances )
3) desc 
*/ 


'use strict'; 

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

 
const app  = express();
 
  
// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 
 
// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));

// 노드 라이브러리 바로 사용 v0.313 
app.use(express.static('node_modules'));
 
  
app.use((req, res) => {
  let msg; 

  msg = "Node Utest-Server V1.884 is running "; 
 
  console.log(msg);   // 콘솔 
});

//  리스터 Starting both http & https servers
const httpServer = http.createServer(app);
let webPort = 80; 
httpServer.listen(webPort, () => {
	console.log('Simple HTTP & Socket Server running on port 80');
});
 
// 소켙 
var socketRouter  = require('./routes/socket');    // 소켙통신 
 
 // 소켙 통신  
app.use('/socket', socketRouter);   
