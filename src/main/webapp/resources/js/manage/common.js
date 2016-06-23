function showMessage(message, messageType,time) {
    if (!messageType) {
        messageType = 'notice';
    }

    $().toastmessage('showToast', {
        text : message,
        sticky : false,
        position : 'middle-center',
        type : messageType,
        stayTime: time,
        closeText : '',
        close : function() {
        }
    });

}


var base64EncodeChars = new String("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
		 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
		 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function request(paras) 
{ 
    var url = location.href; 
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
    var paraObj = {} ;
    for (var i=0; j=paraString[i]; i++){ 
    	paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
    } 
    var returnValue = paraObj[paras.toLowerCase()]; 
    if(typeof(returnValue)=="undefined"){ 
    	return ""; 
    }else{ 
    	return returnValue; 
    } 
}
/* Base64加密 */

var encrypt = function(str){
	var returnVal, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	returnVal = "";
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			returnVal += base64EncodeChars.charAt(c1 >> 2);
			returnVal += base64EncodeChars.charAt((c1 & 0x3) << 4);
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			returnVal += base64EncodeChars.charAt(c1 >> 2);
			returnVal += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			returnVal += base64EncodeChars.charAt((c2 & 0xF) << 2);
			break;
		}
		c3 = str.charCodeAt(i++);
		returnVal += base64EncodeChars.charAt(c1 >> 2);
		returnVal += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		returnVal += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		returnVal += base64EncodeChars.charAt(c3 & 0x3F);
	 }
	 return returnVal;
};
/* Base64解密 */
var decrypt = function(str){
	var c1, c2, c3, c4;
	var i, len, returnVal;
	len = str.length;
	i = 0;
	returnVal = "";
	while (i < len) {
	 /*c1*/
	 do {
		 c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	 } while (i < len && c1 == -1);
	 if (c1 == -1)
		 break;
	 /*c2*/
	 do {
		 c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	 } while (i < len && c2 == -1);
	 if (c2 == -1)
		 break;
	 	returnVal += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	 /*c3*/
	 do {
		 c3 = str.charCodeAt(i++) & 0xff;
	 if (c3 == 61)
		 return returnVal;
	 	 c3 = base64DecodeChars[c3];
	 } while (i < len && c3 == -1);
	 if (c3 == -1)
		 break;
	     returnVal += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
	 /*c4*/
	 do {
		 c4 = str.charCodeAt(i++) & 0xff;
	 if (c4 == 61)
		 return returnVal;
	 	 c4 = base64DecodeChars[c4];
	 } while (i < len && c4 == -1);
	 if (c4 == -1)
		 break;
	     returnVal += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	 }
	 return returnVal;
};
// override
var requestEncryptUrl = function(paras){
	 	var url = location.href; 
        var encryptUrl = url.substring(url.indexOf("?")+1,url.length);
        var decryptUrl = decrypt(encryptUrl).split("&");
        var paraObj = {} ;
        for (var i=0; j=decryptUrl[i]; i++){ 
        	paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
        } 
        var returnValue = paraObj[paras.toLowerCase()]; 
        if(typeof(returnValue)=="undefined"){ 
        	return ""; 
        }else{ 
        	return returnValue; 
        } 
};
// url:/
function concatUrl(pageUrl,encryptParams){
	
	var url = String(pageUrl).concat(encrypt(encryptParams));
	
	return url;
	
}
function getDistance(n){
	return parseInt(n/1000);
}
function checkCookie(cookieName){
	 var NameOfCookie=cookieName;
	  var c = document.cookie.indexOf(NameOfCookie+"="); 
	  if (c != -1)
	  {
	    return true;
	  }
	  else
	  {
	  }
	  return false;
}


	function setCookie(c_name, value, expiredays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()+";path=/");
	}
	function getCookie(c_name){
	if (document.cookie.length>0){ // 先查询cookie是否为空，为空就return
		c_start=document.cookie.indexOf(c_name + "=");// 通过String对象的indexOf()来检查这个cookie是否存在，不存在就为
														// -1
		if (c_start!=-1){ 
	c_start=c_start + c_name.length+1;// 最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
	c_end=document.cookie.indexOf(";",c_start);// 其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
	if (c_end==-1) {
					c_end=document.cookie.length;
	}
	return unescape(document.cookie.substring(c_start,c_end));// 通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
	} 
	}
	return "";
	}
var popUpWin = 0;
function PopUpWindow(URLStr, left, top, width, height, newWin, scrollbars) {
    if (typeof (newWin) == "undefined")
        newWin = false;

    if (typeof (left) == "undefined")
        left = 100;

    if (typeof (top) == "undefined")
        top = 0;

    if (typeof (width) == "undefined")
        width = 800;

    if (typeof (height) == "undefined")
        height = 760;

    if (newWin) {
        open(URLStr, '', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scrollbars + ',resizable=yes,copyhistory=yes,width=' + width + ',height=' + height + ',left=' + left + ', top=' + top + ',screenX=' + left + ',screenY=' + top + '');
        return;
    }

    if (typeof (scrollbars) == "undefined") {
        scrollbars = 0;
    }

    if (popUpWin) {
        if (!popUpWin.closed) popUpWin.close();
    }
    popUpWin = open(URLStr, 'popUpWin', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scrollbars + ',resizable=yes,copyhistory=yes,width=' + width + ',height=' + height + ',left=' + left + ', top=' + top + ',screenX=' + left + ',screenY=' + top + '');
    popUpWin.focus();
}

function isMobil(mobileNumber){
	var reg=/^1\d{10}$/;
	if (!reg.exec(mobileNumber)) {
	 return false;
	}
	return true; 
}
// 将秒转换成时分秒
function time_To_hhmmss(speedVal){
	var hour=parseInt(speedVal/3600);
	var minute=parseInt((speedVal-hour*3600)/60);
	var second=parseInt(((speedVal-hour*3600)-minute*60));
	var str="";
	if(hour != null && hour != undefined){
		if(hour >= 0 && hour <=9){
			str+="0"+hour.toString()+":";
		}else{
			str+=hour.toString()+":";
		}
	}
	if(minute != null && minute != undefined){
		if(minute >= 0 && minute <=9){
			str+="0"+minute.toString()+":";
		}else{
			str+=minute.toString()+":";
		}
		
	}
	if(second != null && second != undefined){
		if(second >= 0 && second <=9){
			str+="0"+second.toString();
		}else{
			str+=second.toString();
		}
	}
	return str;
}
function getTimeCost(timespan){
	var timeCost="";
	var h=m=s="";
		 h=parseInt(timespan/3600)<10?"0"+parseInt(timespan/3600):parseInt(timespan/3600);
	timespan=timespan%3600;
		 m=parseInt(timespan/60)<10?"0"+parseInt(timespan/60):parseInt(timespan/60);
	timespan=timespan%60;
		 s=timespan<10?"0"+timespan:timespan;
	
	
		timeCost=h+":"+m+":"+s;
	
	return timeCost;
}
function getArriveTime(stopTime){
	var time="";
    var timeRight= new Date();
    timeRight.setTime(stopTime);
     var h2=timeRight.getHours();
    var m2=timeRight.getMinutes()<10?"0"+timeRight.getMinutes():timeRight.getMinutes();
    var s2=timeRight.getSeconds()<10?"0"+timeRight.getSeconds():timeRight.getSeconds();
    time=h2+":"+m2+":"+s2;
    return time;
}

// 临时变量，获取单圈的里程较费劲
var cycleslength=5000;


// 显示加载框
function showBox(){
	$(".overlay").css({'display':'block','opacity':'0.8'});
	$(".showbox").stop(true).animate({'margin-top':'300px','opacity':'1'},200);
}
// 关闭加载框
function hideBox(){
	$(".showbox").stop(true).animate({'margin-top':'250px','opacity':'0'},400);
	$(".overlay").css({'display':'none','opacity':'0'});
}


var ajax_request = function(url,param,method){
	var response = "";
	$.ajax({
		'url':url,
		'type':method,
		'data':param,
		'async':false,
		'cache':false,
		'dataType':'json',
		'beforeSend':function(){
			showBox();
		},
		'success':function(data){
			response = data;
		},
		'error':function(e){
			return false;
		},'complete' :function(){
			hideBox();
		}
	});
	return response;
};
function isValid(value){
	var pos = true;
	if(value == null || value == "" || value == undefined || isNaN(value)){
		pos = false;
	}
	return pos;
}
// 验证是否为数字
function isNumber(oNum){
	if(!oNum){
		return false;
	}
	
	var pattern = new RegExp("^\[1-9][0-9]*$");
	
	if(!(pattern.test(oNum))){
		return false;
	}
	
	try{
		if(parseFloat(oNum)!=oNum) {
			return false;
		}
	}catch(ex){
		return false;
	}
	
	return true;
}

function stripscript(s) 
{ 
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); 
	var rs = ""; 
	for (var i = 0; i < s.length; i++) { 
		rs = rs+s.substr(i, 1).replace(pattern, ''); 
	} 
	return rs;
}
function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
$(document).ready(function(){
	$('.nav-list>li').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	
	$('body').on('click','#list tr',function(){
		$(this).css('background','red');
		$(this).siblings().css('background','');
	});
	
});