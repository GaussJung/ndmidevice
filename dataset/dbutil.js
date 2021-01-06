'use strict'; 
 
 
// E20. 필드값 보기 
function viewField(fArr) {
    // 보기출력 변수설정 
    let fcnt = fArr.length; 
    let i = 0; 
    let fobj = {}; 

    if ( fcnt == 0 ) return false;  // 값이 없음. 
 
    for ( i=0; i < fcnt; i++ ) { 
        // 필드값 출력 
        fobj = fArr[i]; 
        console.log("DG15=" + JSON.stringify(fobj) );  // 직원정보 객체 출력 
        // console.log("DG15-1 ecd=" + fobj.ecd );   // 직원번호 출력 
    }; 
}; 

exports.viewField = viewField; 

 