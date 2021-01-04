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
windows : node miserver.js 
linux : sudo node miserver.js 

5. 접속확인
http://localhost:3000 
http://111.222.111.22:3000  

6. 소켙테스트 ( 원격일경우 localhost를 ip로 변경 ) 
- http://localhost:3000/demo/miuser.html 
- biz_device_info 테이블의  deviceid 111111의 statuscd를 A로 변경
- 소켙접속시 ACTION-100 이 주고 받는 것 확인 
