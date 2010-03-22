
/**
 * @name	library run time 骨幹檔
 * @fileoverview
 * library run time 骨幹架構檔。<br/>
 * ce.js = structure.js (this file) with base.js + package.js
 * @since	2010/1/8 22:21:36
 */


//<![CDATA[



/**
 * @name	JavaScript framework: CeL base loader
 * @fileoverview
 * Colorless echo JavaScript kit/library base loader
 * 本檔案包含了呼叫其他 library 需要用到的 function，以及常用 base functions。<br/>
 * <br/>
 * Copyright (C) 2002-, kanashimi <kanasimi@gmail.com>. All Rights Reserved.<br/>
 * <br/>
 * This file is in tab wide of 4 chars, documentation with JsDoc Toolkit (<a href="http://code.google.com/p/jsdoc-toolkit/wiki/TagReference">tags</a>).<br/>
 * <br/>
 * <br/>Please visit <a href="http://lyrics.meicho.com.tw/program/">Colorless echo program room</a> for more informations.
 * @since	自 function.js 0.2 改寫
 * @since	JavaScript 1.2
 * @since	2010/1/9 00:01:52
 * @author	kanasimi@gmail.com
 * @version	$Id: ce.js,v 0.2 2009/11/26 18:37:11 kanashimi Exp $
 */


/*
引用：參照
function addCode

CeL.package


單一JS引用：
//	[function.js]_iF
function _iF(){}_iF.p='HKCU\\Software\\Colorless echo\\function.js.path';if(typeof WScript=="object")try{eval(getU((new ActiveXObject("WScript.Shell")).RegRead(_iF.p)));}catch(e){}
function getU(p,enc){var o;try{o=new ActiveXObject('Microsoft.XMLHTTP');}catch(e){o=new XMLHttpRequest();}if(o)with(o){open('GET',p,false);if(enc&&o.overrideMimeType)overrideMimeType('text/xml;charset='+enc);send(null);return responseText;}}
//	[function.js]End


初始化：參照
initialization of function.js

http://www.w3school.com.cn/html5/html5_script.asp
<script type="text/javascript" async="true" src="path/to/function.js"></script>
<script type="application/javascript;version=1.7" async="true" src="path/to/function.js"></script>


*/



/*
TODO

本 library 大量使用了 arguments.callee，但這與 ECMAScript design principles 不甚相符？
	http://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript
	http://wiki.ecmascript.org/doku.php?id=es3.1:design_principles


reset environment (__defineSetter__, __defineGetter__, ..)
in case of
	<a href="http://haacked.com/archive/2009/06/25/json-hijacking.aspx" accessdate="2009/12/2 0:7">JSON Hijacking</a>,
	<a href="http://blog.miniasp.com/post/2009/11/JavaScript-JSON-Hijacking.aspx" accessdate="2009/12/2 0:18">在 Web 2.0 時代必須重視 JavaScript/JSON Hijacking 攻擊</a>,
	etc.
*/


//try{


//	add base.js




//	add package.js



//	add init.js



//}catch(e){WScript.Echo('There are some error in function.js!\n'+e.message);throw e;}



//CeL.use('code.log');
//CeL.warn('test_print: ' + CeL.code.log.Class);


//]]>

