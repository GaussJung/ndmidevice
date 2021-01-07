# ndmidevice
socket application for device 

1. 준비사항 
- git 설치 
- https://git-scm.com/downloads 

2. 다운로드 
설치를 원하는 디렉토리에서 다음 수행 ( C:\devsrc  or Linux :  /work ) 
git clone -b master https://github.com/GaussJung/ndmidevice  
( 결과 :  c:\devsrc\ndmidevice  생성됨  or Linux : /work/ndmidevice  ) 

3. 라이브러리 설치 
cd c:\devsrc\ndmidevice   ( Linux : cd /work/ndmidevice ) 
npm install 

4. 기동방법 
1) timeSetOut 
windows : node miserver.js 
linux : sudo node miserver.js 

2) structed and simplified version  ( send device info )
windows : sudo node miserverchk.js 
linux : sudo node miserverchk.js 

5. 접속확인
http://localhost:3000 
http://111.222.111.22:3000  



6. 소켙테스트 ( 원격일경우 localhost를 ip로 변경 ) 
- http://localhost:3000/demo/miuser.html 
- DB Editor를 활용하여 biz_device_info 테이블의  deviceid 111111의 statuscd를 A로 변경 ( Y -> A )  
- 소켙접속후 ACTION-100||SUCCESS 메시지 수령후 것 확인 (  A -> Y ) 


### 실제 
--> http://13.125.32.176:3000/demo/miuser.html
--> ws://13.125.32.176:88/misocket?deviceid=Dev3 (소켙주소 입력)  