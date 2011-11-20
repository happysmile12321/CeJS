
/**
 * @name	CeL function for native objects
 * @fileoverview
 * 本檔案包含了 native objects 的 functions。
 * @since	
 */


if (typeof CeL === 'function')
CeL.setup_module('data.native',
{
require : 'data.code.compatibility.add_method',
code : function(library_namespace, load_arguments) {
'use strict';

//	requiring
var add_method;
eval(library_namespace.use_function(this));


/**
 * null module constructor
 * @class	native objects 的 functions
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};


/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {
};






/*	opposite of toUTCString()
	尚不成熟！假如是type=='date'，不如用new Date()!
	string大部分可用new Date(Date.parse(str))代替!
	http://www.comsharp.com/GetKnowledge/zh-CN/TeamBlogTimothyPage_K742.aspx

var UTCDay,UTCMonth;
setObjValue('UTCDay','Sun,Mon,Tue,Wed,Thu,Fri,Sat',1);
setObjValue('UTCMonth','Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',1);
var fromUTCStringFormat=[[0,3,2,1,4],[0,5,1,2,3],[0,4,1,2,3]];	//	0:[Mon, 9 Aug 2004 12:05:00 GMT],1:[Thu Sep 30 18:12:08 UTC+0800 2004],2:[Sat Jun 26 18:19:46 2004]
function fromUTCString(str,format){
 var s=''+str,f;
 if(!s)return;
 if(typeof format=='undefined')if(f=Date.parse(s))return new Date(f);else return 'Unknown format!';//format=0;
 if(!isNaN(format)&&format<fromUTCStringFormat.length)f=fromUTCStringFormat[format];
 else return 'Yet support this kind of format['+format+']!\nWe support to '+fromUTCStringFormat.length+'.';
 if(!f[0])f[0]=' ';
 s=s.replace(new RegExp(f[0]+'+','g'),f[0]).split(f[0]);
 if(s.length<f.length)return 'The item length of data: '+s.length+' is less then format['+format+']: '+f.length+'!\n'+s.join(',');// new Date
 if(f.length==5)s[f[4]]=s[f[4]].split(':');
 else if(f.length==7)s[f[4]]=[s[f[4]],s[f[5]],s[f[6]]];
 else return 'Illegal date format!';
 if(format==1&&s[4].match(/([+-]\d{2})/))s[f[4]][0]=parseInt(s[f[3]][0])+parseInt(RegExp.$1);
 library_namespace.debug(str+'\n'+s[f[1]]+','+s[f[2]]+'('+UTCMonth[s[f[2]]]+'),'+s[f[3]]+','+s[f[4]][0]+','+s[f[4]][1]+','+s[f[4]][2]);
 //	check,可以包括星期
 if( !(s[f[2]]=UTCMonth[s[f[2]]]) || !(s=new Date(s[f[1]],s[f[2]],s[f[3]],s[f[4]][0],s[f[4]][1],s[f[4]][2])) )	//	Date.UTC()
  s='Input data error!';
 return s;
}
*/

/*	string <-> date object, Date.parse()
	http://msdn2.microsoft.com/zh-tw/library/t5580e8h(VS.80).aspx


/((\d{1,4})[\/.-])?([01]?\d)([\/.-]([0-3]?\d))?/
/([0-2]?\d):([0-5]?\d)(:([0-5]?\d))?\s*(([PA])M)?/


(


(


(
([12]\d{3}|1?\d{2})

[\/.-]
)?

([01]?\d)

([\/.-]([0-3]?\d)(\.\d+)?)?


|


([0-2]?\d)
:
([0-5]?\d)

(:([0-5]?\d))?

\s*
(([PA])M)?


)



\s*
){1,2}


try:
'2003/1/4  12:53:5'.toDate();
String_to_Date.m.join('<br/>');
	$2:year
	$3:month
	$5:mday


*/
String_to_Date.pd=/(([12]\d{3}|1\d{2}|[2-9]\d)[\/.\-–年])?([01]?\d)([\/.\-–月]([0-3]?\d)日?)?/;	//	pattern of date
String_to_Date.pt=/([0-2]?\d)[:時]([0-5]?\d)([:分]([0-5]?\d)(\.\d+)?)?\s*(([PA])M)?/i;	//	pattern of time
String_to_Date.r1=new RegExp(String_to_Date.pd.source+'(\\s+'+String_to_Date.pt.source+')?','i');	//	date [time]
String_to_Date.r2=new RegExp(String_to_Date.pt.source+'(\\s+'+String_to_Date.pd.source+')?','i');	//	time [date]
//String_to_Date.m;	//	matched string
function String_to_Date(s,f,diff){	//	date string, force parse(no Date.parse() try), 時差 in hour(例如 TW: UTC+8 → 8, 可使用.5)
 if(!s)s=this.valueOf();//.toString();
 var m,a,b,c;
 if(!f&&!diff&&(m=Date.parse(s)))return new Date(m);	//	有diff時不使用 Date.parse

 if(m=s.match(/(^|[^\d])([12]\d{3})([^\/.\-–年]|$)/))s=m[2]+'/1';	//	僅有年時的bug

 f=1911;	//	小於此年份會加上此年份。for 民國
 if(diff)diff=(new Date).getTimezoneOffset()+parseInt(60*diff);
 if(!diff)diff=0;
 if(m=s.match(String_to_Date.r1))
  //	日期先
  //for(var i=1;i<11;i++)m[i]=m[i]?Math.floor(m[i]):0;	//	needless
  a=new Date((b=m[2]-0)&&b<200?b+f:b,m[3]?m[3]-1:0,m[5]||1,	m[12]=='P'||m[13]=='p'?m[7]-0+12:m[7],m[8]-diff,m[10],m[11]*1e3);

 if((!m||!isNaN(m[0]))&&(c=s.match(String_to_Date.r2)))	//	不match或僅有一數字
  //	時間先
  m=c,a=new Date((b=m[10]-0)&&b<200?b+f:b,m[11]?m[11]-1:0,m[13]||1,	m[7]=='P'||m[7]=='p'?m[1]-0+12:m[1],m[2]-diff,m[4],m[5]*1e3);

 //var t="match:\n"+s+"\n\n";for(var i=0;i<m.length;i++){t+=(i>9?i:' '+i)+': '+m[i]+'\n';}if(!m[1]||!m[2]||!m[4])library_namespace.debug(t);

 if (String_to_Date.m = m) {
  //	判別未輸入時預設年份設對了沒：以最接近 now 的為基準
  if (!b && a - new Date(0, 0, 2) > 0) {
					m = new Date(a);
					a.setFullYear(s = (b = new Date).getFullYear());
					m.setFullYear(a - b > 0 ? s - 1 : s + 1);
					if (a - b > 0 && a - b > b - m || a - b < 0
							&& a - b < b - m)
						a = m;
				}
  return a;
 }
}

//	Turn to RFC 822 date-time
//DateToRFC822[generateCode.dLK]='setTool,String_to_Date';
function DateToRFC822(d) {
	if (!(d instanceof Date))
		d = ('' + d).toDate();
	if (!d)
		d = new Date;
	return d.toGMTString().replace(/UTC/gi, 'GMT');
};

//	要用更多樣化的，請使用format_date()
function Date_to_String(sp) {
	if (!sp)
		sp = '/';
	return '' + this.getYear() + sp + (this.getMonth() + 1) + sp + this.getDate() + ' '
			+ this.getHours() + ':' + this.getMinutes()
	// +':'+this.getSeconds()+'.'+this.getMilliseconds();
	;
};
//var tt='2001/8/7 03:35PM';library_namespace.debug(tt+'\n'+tt.toDate().toStr());


/*
mode:
	+4:不顯示時間,
	+3:顯示時間至時,
	+2:顯示時間至分,
	+1:顯示時間至秒,
	+0:顯示時間至毫秒(ms)

	+32(4<<3):不顯示日期,
	+24(3<<3):顯示日期mm/dd,
	+16(2<<3):顯示日期yyyy/mm,
	+8(1<<3):顯示日期yyyy/mm/dd(星期),
	+0:顯示日期yyyy/mm/dd

	+64(1<<6):input UTC
	+128(2<<6):output UTC

NOTE:
在現有時制下要轉換其他時區之時間成正確time:
d=_其他時區之時間_;
diff=其他時區之時差(例如 TW: UTC+8)
d.setTime(d.getTime()-60000*((new Date).getTimezoneOffset()+diff*60))

*/

_// JSDT:_module_
.
/**
 * 顯示格式化日期 string
 * @param date_value	要轉換的 date, 值過小時當作時間, <0 轉成當下時間
 * @param {Number} mode	要轉換的 mode
 * @param {Boolean} zero_fill	對 0-9 是否補零
 * @param {String} date_separator	date separator
 * @param {String} time_separator	time separator
 * @return	{String}	格式化後的日期
 * @example
 * alert(format_date());
 * @since	2003/10/18 1:04 修正
 * @since	2010/4/16 10:37:30	重構(refactoring)
 * @requires setTool,to_fixed
 * @see
 * http://www.merlyn.demon.co.uk/js-dates.htm,
 * http://aa.usno.navy.mil/data/docs/JulianDate.html
 * @_memberOf	_module_
 */
format_date = function format_date(date_value, mode, zero_fill, date_separator, time_separator) {
	//library_namespace.debug('[' + (typeof date_value) + '] ' + date_value + ', mode: ' + mode);

	// initiate
	if (!mode)
		mode = 0;

	var output_UTC, a, b = mode, time_mode, return_string = '',
	show_number = zero_fill ? function(n) {
		return n > 9 ? n : '0' + n;
	} : function(n) {
		return n;
	};

	//	date & time mode
	mode %= 64;
	//	UTC mode
	b = (b - mode) / 64;
	//	input UTC
	a = b % 2 == 1 ? 1 : 0;
	output_UTC = b - a === 1;

	time_mode = mode % 8;
	//	date mode
	mode = (mode - time_mode) / 8;
	// time_mode > 4 && mode > 3: error mode: 沒啥好顯示的了

	//	處理各種不同的 date
	b = typeof date_value;
	if (b === 'number' && date_value >= 0){
		// 全球標準時間(UCT)與本地時間之差距
		// UTC time = local time + format_date.UTC_offset(ms)
		if (!a && isNaN(a = format_date.UTC_offset))
			//	input UTC 時之差距(ms)
			//	.getTimezoneOffset() is in minute. 60*1000(ms)=6e4(ms)
			a = format_date.UTC_offset = 6e4 * (new Date).getTimezoneOffset();

		// 值過小時當作時間: d<90000000~24*60*60*1000，判別為當天，只顯示時間。不允許 d<0！
		date_value = new Date(Math.abs(a += date_value) < 9e7 ? a : date_value);
		mode = 32;
	}else if (b === 'string' && (a = date_value.toDate()))
		date_value = a;
	else if (b === 'date')
		// 應對在 Excel 等外部程式會出現的東西
		date_value = new Date(date_value);
	else if (
			//	http://www.interq.or.jp/student/exeal/dss/ejs/1/1.html
			//	引数がオブジェクトを要求してくる場合は instanceof 演算子を使用します
			//	typeof date_value!=='object'||date_value.constructor!=Date
			!(date_value instanceof Date))
		//	new Date === new Date()
		date_value = new Date;


	// 處理 date
	if (mode < 4) {
		return_string = show_number((output_UTC ? date_value.getUTCMonth()
				: date_value.getMonth()) + 1);
		if (!date_separator)
			date_separator = '/';
		if (mode < 3)
			return_string = (output_UTC ? date_value.getUTCFullYear() : date_value
					.getFullYear())
					+ date_separator + return_string;
		if (mode !== 2) {
			return_string += date_separator
			+ show_number(output_UTC ? date_value.getUTCDate() : date_value
					.getDate());
			if (mode === 1)
				return_string += '(' + (output_UTC ? date_value.getUTCDay()
						: date_value.getDay()) + ')';
		}
	}

	// 處理 time
	if (time_mode < 4) {
		if (mode < 4)
			// 日期 & 時間中間分隔
			return_string += ' ';
		if (!time_separator)
			time_separator = ':';
		return_string += show_number(output_UTC ? date_value.getUTCHours()
				: date_value.getHours());
		if (time_mode < 3) {
			return_string += time_separator
			+ show_number(output_UTC ? date_value.getUTCMinutes()
					: date_value.getMinutes());
			if (time_mode < 2)
				return_string += time_separator
				+ (time_mode ? show_number(output_UTC ? date_value
						.getUTCSeconds() : date_value.getSeconds())
						: (output_UTC ? date_value.getUTCSeconds()
								+ date_value.getUTCMilliseconds() / 1e3
								: date_value.getSeconds() + date_value.getMilliseconds() / 1e3
							).to_fixed(3));
		}
	}

	return return_string;
};



/*
	function經ScriptEngine會轉成/取用'function'開始到'}'為止的字串

	用[var thisFuncName=parse_function().funcName]可得本身之函數名
	if(_detect_)alert('double run '+parse_function().funcName+'() by '+parse_function(arguments.callee.caller).funcName+'()!');

You may use this.constructor


TODO:
to call: parse_function(this,arguments)
e.g., parent_func.child_func=function(){var name=parse_function(this,arguments);}

bug:
函數定義 .toString() 時無法使用。
*/
_// JSDT:_module_
.
/**
 * 函數的文字解譯/取得函數的語法
 * @param {Function|String} function_name	function name or function structure
 * @param flag	=1: reduce
 * @return
 * @example
 * parsed_data = new parse_function(function_name);
 * @see
 * http://www.interq.or.jp/student/exeal/dss/ref/jscript/object/function.html,
 * Syntax error: http://msdn.microsoft.com/library/en-us/script56/html/js56jserrsyntaxerror.asp
 * @_memberOf	_module_
 * @since	2010/5/16 23:04:54
 */
parse_function = function parse_function(function_name, flag) {
	if (!function_name
			&& typeof (function_name = parse_function.caller) !== 'function')
		return;
	if (typeof function_name === 'string'
			&& !(function_name = library_namespace.get_various(function_name)))
		return;

	var fs = '' + function_name, m = fs.match(/^function[\s\n]+(\w*)[\s\n]*\(([\w,\s\n]*)\)[\s\n]*\{[\s\n]*((.|\n)*)[\s\n]*\}[\s\n]*$/);
	//library_namespace.debug(typeof function_name + '\n' + fs + '\n' + m);

	// detect error, 包含引數
	// 原先：functionRegExp=/^\s*function\s+(\w+) ..
	// 因為有function(~){~}這種的，所以改變。
	if (!m)
		// JScript5 不能用throw!
		// http://www.oldversion.com/Internet-Explorer.html
		throw new Error(1002, 'Syntax error (語法錯誤)');

	if (function_name != m[1])
		library_namespace.warn('Function name unmatch (函數名稱不相符，可能是用了reference？)');

	//library_namespace.debug('function ' + m[1] + '(' + m[2] + '){\n' + m[3] + '\n}');

	return {
		string : fs,
		name : m[1],
		// 去除前後空白
		arguments : m[2].replace(/[\s\n]+/g, '').split(','),
		code : m[3]
	};
};




//	補強String.fromCharCode()
function fromCharCode(c) {
	if (!isNaN(c))
		return String.fromCharCode(c);
	try {
		// 直接最快
		return eval('String.fromCharCode(' + c + ');');
	} catch (e) {
	}

/*
if (typeof c == 'string')
	return eval('String.fromCharCode(' + n + ')');// c=c.split(','); 後者可以通過審查
if (typeof c == 'object') {
	var t = '', d, i, a, n = [];
	if (c.length)
		a = c;
	else {
		a = [];
		for (i in c)
			a.push(c[i]);
	}
	for (i = 0; i < a.length; i++)
		if (!isNaN(c = a[i]) || !isNaN(c = ('' + a[i]).charCodeAt(0)))
			n.push(c); // 跳過無法判讀的值
	return eval('String.fromCharCode(' + n + ')');//n.join(',')	這樣較快
}
*/
};





_// JSDT:_module_
.
/**
 * 對付有時 charCodeAt 會傳回 >256 的數值。
 * 若確定編碼是 ASCII (char code 是 0~255) 即可使用此函數替代 charCodeAt。
 * @param text	string
 * @param position	at what position
 * @return
 * @since	2008/8/2 10:10:49
 * @see
 * http://www.alanwood.net/demos/charsetdiffs.html
 * @_memberOf	_module_
 */
toASCIIcode=function (text, position) {
	var _f = arguments.callee, c;

	if (!_f.t) {
		// initial
		var i = 129, t = _f.t = [], l = {
			8364 : 128,
			8218 : 130,
			402 : 131,
			8222 : 132,
			8230 : 133,
			8224 : 134,
			8225 : 135,
			710 : 136,
			8240 : 137,
			352 : 138,
			8249 : 139,
			338 : 140,
			381 : 142,
			8216 : 145,
			8217 : 146,
			8220 : 147,
			8221 : 148,
			8226 : 149,
			8211 : 150,
			8212 : 151,
			732 : 152,
			8482 : 153,
			353 : 154,
			8250 : 155,
			339 : 156,
			382 : 158,
			376 : 159
		};
		for (; i < 256; i += 2)
			t[i] = i;
		for (i in l)
			// sl(i+' = '+l[i]),
			t[Math.floor(i)] = l[i];
	}

	if (position < 0 && !isNaN(text))
		c = text;
	else
		c = text.charCodeAt(position || 0);

	return c < 128 ? c : (_f.t[c] || c);
};


/*	2008/8/2 9:9:16
	encodeURI, encodeURIComponent 僅能編成 utf-8，對於其他 local 編碼可使用本函數。

e.g.,
f.src='http://www.map.com.tw/search_engine/searchBar.asp?search_class=address&SearchWord='+encodeUC(q[0],'big5')




perl
#use Encode qw(from_to);
use Encode;

my $tEnc='utf-8';

$t="金";

$t=Encode::decode($t,'big5');

Encode::from_to($t,$lEnc,$outEnc);

Encode::from_to

@b=split(//,$a);

for($i=0;$i<scalar(@b);$i++){
 $r.=sprintf('%%%X',ord($b[$i]));
};


*/
//encodeUC[generateCode.dLK]='toASCIIcode';
function encodeUC(u, enc) {
	if (!enc || enc == 'utf8')
		return encodeURI(u);

	var i = 0, c = new ActiveXObject("ADODB.Stream"), r = [];
	// adTypeText;
	c.Type = 2;
	c.Charset = enc;
	c.Open();
	c.WriteText(u);
	c.Position = 0;
	c.Charset = 'iso-8859-1';
	u = c.ReadText();
	c.Close();

	for (; i < u.length; i++)
		r.push((c = u.charCodeAt(i)) < 128 ? u
				.charAt(i) : '%'
				+ toASCIIcode(c, -1).toString(16)
				.toUpperCase());

	return r.join('').replace(/ /g, '+');
}




_// JSDT:_module_
.
/**
 * String pattern (e.g., "/a+/g") to RegExp pattern.
 * qq// in perl.
 * String.prototype.toRegExp = function(f) { return to_RegExp_pattern(this.valueOf(), f); };
 * @param {String} pattern	pattern text
 * @param {Boolean|String} [RegExp_flag]	flags when need to return RegExp object
 * @param {RegExp} [escape_pattern]	char pattern need to escape
 * @return	{RegExp} RegExp object
 */
to_RegExp_pattern = function(pattern, RegExp_flag, escape_pattern) {
	var r = pattern
		// 不能用 $0
		.replace(escape_pattern || /([.+*?|()\[\]\\{}])/g, '\\$1')
		// 這種方法不完全，例如 /\s+$|^\s+/g
		.replace(/^([\^])/, '\\^').replace(/([$])$/, '\\$');
	return RegExp_flag ? new RegExp(r, /^[igms]+$/i.test(RegExp_flag) ? RegExp_flag : '') : r;
};



_// JSDT:_module_
.
/**
 * 重新設定 RegExp object 之 flag
 * @param {RegExp} regexp	RegExp object to set
 * @param {String} flag	flag of RegExp
 * @return	{RegExp}
 * @example
 * 附帶 'g' flag 的 RegExp 對相同字串作 .test() 時，第二次並不會重設。因此像下面的 expression 兩次並不會得到相同結果。
 * var r=/,/g,t='a,b';
 * WScript.Echo(r.test(t)+','+r.test(t));
 * 
 * //	改成這樣就可以了：
 * var r=/,/g,t='a,b',s=renew_RegExp_flag(r,'-g');
 * WScript.Echo(s.test(t)+','+s.test(t));
 * 
 * //	這倒沒問題：
 * r=/,/g,a='a,b';
 * if(r.test(a))library_namespace.debug(a.replace(r,'_'));
 * 
 * //	delete r.lastIndex; 無效，得用 r.lastIndex=0; 因此下面的亦可：
 * if(r.global)r.lastIndex=0;
 * if(r.test(a)){~}
 * 
 * @see
 * http://msdn.microsoft.com/zh-tw/library/x9h97e00(VS.80).aspx,
 * 如果規則運算式已經設定了全域旗標，test 將會從 lastIndex 值表示的位置開始搜尋字串。如果未設定全域旗標，則 test 會略過 lastIndex 值，並從字串之首開始搜尋。
 * http://www.aptana.com/reference/html/api/RegExp.html
 * @_memberOf	_module_
 */
renew_RegExp_flag = function(regexp, flag) {
	var i, flag_set = {
		global : 'g',
		ignoreCase : 'i',
		multiline : 'm'
	};

	// 未指定 flag: get flag
	if (!flag) {
		flag = '';
		for (i in flag_set)
			if (regexp[i])
				flag += flag_set[i];
		return flag;
	}

	var a = flag.charAt(0), F = '', m;
	a = a === '+' ? 1 : a === '-' ? 0 : (F = 1);

	if (F)
		// 無 [+-]
		F = flag;
	else
		// f: [+-]~ 的情況，parse flag
		for (i in flag_set)
			if ((m = flag.indexOf(flag_set[i], 1) != -1) && a || !m
					&& regexp[i])
				F += flag_set[i];

	// for JScript<=5
	try{
		return new RegExp(regexp.source, F);
	}catch (e) {
		// TODO: handle exception
	}
};


/*	2004/5/27 16:08
	將 MS-DOS 萬用字元(wildcard characters)轉成 RegExp, 回傳 pattern
	for search

usage:
	p=new RegExp(turnWildcardToRegExp('*.*'))


flag&1	有變化的時候才 return RegExp
flag&2	add ^$


萬用字元經常用在檔名的置換。
* 代表任意檔案名稱
如：ls * 表示列出所有檔案名稱。
? 則代表一個字元
如: ls index.??? 表示列出所有 index.三個字元 的檔案名稱
[ ] 代表選擇其中一個字元
[Ab] 則代表 A 或 b 二者之中的一個字元
如: ls [Ab]same 為 Asame 或 bsame
[! ] 代表除外的一個字元
[!Ab] 則代表 不是 A 且 不是 b 的一個字元
如: [!0-9] 表不是數字字元
如: *[!E] 表末尾不是 E 的檔名

memo:
檔案名稱不可包含字元	** 不包含目錄分隔字元 [\\/]:
/:*?"<>|/

*/

//	萬用字元 RegExp source, ReadOnly
turnWildcardToRegExp.w_chars = '*?\\[\\]';

function turnWildcardToRegExp(p, f) { // pattern, flag

	if (p instanceof RegExp)
		return p;
	if (!p || typeof p != 'string')
		return;

	var ic = arguments.callee.w_chars, r;
	if ((f & 1) && !new RegExp('[' + ic + ']').test(p))
		return p;

	ic = '[^' + ic + ']';
	r = p
		//	old: 考慮 \
		//.replace(/(\\*)(\*+|\?+|\.)/g,function($0,$1,$2){var c=$2.charAt(0);return $1.length%2?$0:$1+(c=='*'?ic+'*':c=='?'?ic+'{'+$2.length+'}':'\\'+$2);})

		//	處理目錄分隔字元：多轉一，'/' → '\\' 或相反
		.replace(/[\\\/]+/g, typeof dirSp === 'string' ? dirSp : '\\')

		//	在 RegExp 中有作用，但非萬用字元，在檔名中無特殊作用的
		.replace(/([().^$\-])/g, '\\$1')

		//	* 代表任意檔案字元
		.replace(/\*+/g, '\0*')

		//	? 代表一個檔案字元
		.replace(/\?+/g, function($0) {
			return '\0{' + $0.length + '}';
		})

		//	translate wildcard characters
		.replace(/\0+/g, ic)

		//	[ ] 代表選擇其中一個字元
		//pass

		//	[! ] 代表除外的一個字元
		.replace(/\[!([^\]]*)\]/g, '[^$1]')
		;


	// 有變化的時候才 return RegExp
	if (!(f & 1) || p !== r)
		try {
			p = new RegExp(f & 2 ? '^' + r + '$' : r, 'i');
		} catch (e) {
			//	輸入了不正確的 RegExp：未預期的次數符號等
		}

	return p;
}




//	string & Number處理	-----------------------------------------------

//	set prototype's function of 內建物件 for 相容性(not good way..)
//setTool[generateCode.dLK]='*setTool();';//,product,countS,to_fixed,getText,turnUnicode,trimStr,String_to_Date,Date_to_String,JSalert
function setTool(){
	add_method(String.prototype, {
		x : product,
		count : countS,
		gText : getText,
		turnU : turnUnicode,
		trim : trimStr,
		toDate : String_to_Date
	});
	add_method(Date.prototype, {
		toStr : Date_to_String
	});
	add_method(Number.prototype, {
		to_fixed : to_fixed
	});
	add_method(library_namespace.global, {
		//	在HTML中typeof alert=='object'
		alert : JSalert
	});
	//	建議不用，因為在for(in Array)時會..
	//if(!Array.prototype.unique&&typeof Aunique==='function')Array.prototype.unique=function() { return uniqueArray(this); };
}

// array,sortFunction
function uniqueArray(a, f) {
	if (f)
		a.sort(f);
	else
		a.sort();
	var i = 1, j = -1;
	for (; i < a.length; i++)
		if (a[i] == a[i - 1]) {
			if (j < 0)
				j = i;
		} else if (j >= 0)
			a.splice(j, i - j), i = j, j = -1;
	if (j >= 0)
		a.splice(j, i - j);
	return a;
}

function product(c) {
	if (isNaN(c) || (c = Math.floor(c)) < 1)
		return '';
	var i, r = '', s = [];
	s[i = 1] = this;
	while (i + i <= c)
		s[i + i] = s[i] + s[i], i += i;
	while (c) {
		if (i <= c)
			r += s[i], c -= i;
		i /= 2;
	}
	return r;//in VB:String(c,this)
}
//	計算string中出現k之次數	用s///亦可@perl
function countS(k) { // k亦可用RegExp
	//var c=0,s=this,i=0,l;if(k&&typeof k=='string'){l=k.length;while((i=this.indexOf(k,i))!=-1)c++,i+=l;}return c;
	return (this.length - this.replace(k, '').length) / k.length;
}


_// JSDT:_module_
.
/**
 * 取至小數 d 位，
 * 肇因： JScript即使在做加減運算時，有時還是會出現 1.4000000000000001、0.0999999999999998 等數值。此函數可取至 1.4 與 0.1。
 * c.f., round()
 * @param {Number} [digits]	1,2,..: number of decimal places shown
 * @param {Number} [max]	max digits	max===0:round() else floor()
 * @return
 * @see
 * https://bugzilla.mozilla.org/show_bug.cgi?id=5856
 * IEEE754の丸め演算は最も報告されるES3「バグ」である。
 * http://www.jibbering.com/faq/#FAQ4_6
 * http://en.wikipedia.org/wiki/Rounding
 * @example
 * {var d=new Date,v=0.09999998,i=0,a;for(;i<100000;i++)a=v.to_fixed(2);alert(v+'\n→'+a+'\ntime:'+format_date(new Date-d));}
 * @_memberOf	_module_
 */
to_fixed = function(digits, max) {
	var v = this.valueOf(),
	i, n;

	if (isNaN(v))
		return v;

	if (isNaN(digits) || digits < 0)
		// 內定：8位
		digits = 8;
	else if (digits > 20)
		digits = 20;

	if (!max && Number.prototype.toFixed)
		return parseFloat(v.toFixed(digits));

	if (v < 0)
		// 負數
		n = 1, v = -v;
	if ((i = (v = v.toString(10)).indexOf('e')) !== -1)
		return v.charAt(i + 1) == '-' ? 0 : v;

	//library_namespace.debug(v);
	//	TODO: using +.5 的方法
	//	http://clip.artchiu.org/2009/06/26/%E4%BB%A5%E6%95%B8%E5%AD%B8%E7%9A%84%E5%8E%9F%E7%90%86%E8%99%95%E7%90%86%E3%80%8C%E5%9B%9B%E6%8D%A8%E4%BA%94%E5%85%A5%E3%80%8D/
	if ((i = v.indexOf('.')) !== -1) {
		if (i + 1 + digits < v.length)
			if (max)
				v = v.slice(0, i + 1 + digits);
			else {
				v = '00000000000000000000' + Math.round(
						v.slice(0, i++) + v.substr(i, digits) + '.'
						+ v.charAt(i + digits)).toString(10);
				// (v!=0?library_namespace.debug(v+','+v.length+','+digits+','+v.substr(0,v.length-digits)+','+v.substr(max)):0);
				v = v.slice(0, max = v.length - digits) + '.' + v.substr(max);
			}
	}

	return v ? parseFloat((n ? '-' : '') + v) : 0;
};
/*	old:very slow
function to_fixed(d,m){
 var v=this.valueOf(),i;if(isNaN(v))return v;
 if(isNaN(d)||d<0)d=8;	//	內定：8位
 if(!m){
  v=Math.round(Math.pow(10,d)*v);v=v<0?'-'+'0'.x(d)+(-v):'0'.x(d)+v;
  v=v.slice(0,i=v.length-d)+'.'+v.substr(i);
 }else if(i=(v=''+v).indexOf('.')+1)v=v.slice(0,i+(d?d:d-1));
 return parseFloat(v||0);
}
*/

/*
//	增添單位
var addDenominationSet={};
addDenominationSet.a=',,,,'.split(',');
function addDenomination(a,b){

}
*/




//var sourceF=WScript.ScriptName,targetF='test.js';simpleWrite('tmp.js',alert+'\n'+simpleRead+'\n'+simpleWrite+'\nvar t="",ForReading=1,ForWriting=2,ForAppending=8\n,TristateUseDefault=-2,TristateTrue=-1,TristateFalse=0\n,WshShell=WScript.CreateObject("WScript.Shell"),fso=WScript.CreateObject("Scripting.FileSystemObject");\nt='+dQuote(simpleRead(sourceF),80)+';\nsimpleWrite("'+targetF+'",t);//eval(t);\nalert(simpleRead("'+sourceF+'")==simpleRead("'+targetF+'")?"The same (test dQuote OK!)":"Different!");');//WshShell.Run('"'+getFolder(WScript.ScriptFullName)+targetF+'"');
//	determine quotation mark:輸入字串，傳回已加'或"之字串。
/*
dQuote.qc=function(c,C){
	return c<32?'\\'+c:C;
};
*/
function dQuote(s,len,sp){	//	string,分割長度(會採用'~'+"~"的方式),separator(去除末尾用)
 var q;s=String(s);if(sp)s=s.replace(new RegExp('['+sp+']+$'),'');	//	去除末尾之sp
 if(isNaN(len)||len<0)len=0;
 if(len){
  var t='';
  for(;s;)t+='+'+dQuote(s.slice(0,len))+'\n',s=s.substr(len);	//	'\n':NewLine
  return t.substr(1);
 }
 //if(len){var t='';for(;s;)t+='t+='+dQuote(s.slice(0,len))+'\n',s=s.substr(len);return t.substr(3);}	//	test用
 s=s.replace(/\\/g,'\\\\')
	.replace(/\r/g,'\\r').replace(/\n/g,'\\n')	//	\b,\t,\f
	//	轉換控制字符
	.replace(/([\0-\37\x7f\xff])/g,function($0,$1){var c=$1.charCodeAt(0);return c<64?'\\'+c.toString(8):'\\x'+(c<16?'0':'')+c.toString(16);})
	//.replace(/([\u00000100-\uffffffff])/g,function($0,$1){})
	;
 //q=s.length;while(s.charAt(--q)==sp);s=s.slice(0,q+1);
 if(s.indexOf(q="'")!=-1)q='"';
 if(s.indexOf(q)!=-1)s=s.replace(new RegExp(q="'",'g'),"\\'");	//	,library_namespace.debug("Can't determine quotation mark, the resource may cause error.\n"+s);
 return q+s+q;
}


_// JSDT:_module_
.
/**
 * check input string send to SQL server
 * @param {String} string	input string
 * @return	{String}	轉換過的 string
 * @since	2006/10/27 16:36
 * @see
 * from lib/perl/BaseF.pm (or program/database/BaseF.pm)
 * @_memberOf	_module_
 */
checkSQLInput = function(string) {
	if (!string)
		return '';

	// 限制長度
	if (maxInput && string.length > maxInput)
		string = string.slice(0, maxInput);

	return string
		// for \uxxxx
		.replace(/\\u([\da-f]{4})/g, function($0, $1) {
			return String.fromCharCode($1);
		}).replace(/\\/g, '\\\\')
	
		// .replace(/[\x00-\x31]/g,'')
		.replace(/\x00/g, '\\0')
	
		// .replace(/\x09/g,'\\t')
		// .replace(/\x1a/g,'\\Z')
	
		// .replace(/\r\n/g,' ')
		.replace(/\r/g, '\\r').replace(/\n/g, '\\n')
	
		// .replace(/"/g,'\\"')
		.replace(/'/g, "''");
};

/**
 * check input string send to SQL server 並去掉前後 space
 * @param {String} string	input string
 * @return	{String}	轉換過的 string
 * @since	2006/10/27 16:36
 * @see
 * from lib/perl/BaseF.pm (or program/database/BaseF.pm)
 * function strip() @ Prototype JavaScript framework
 * @_memberOf	_module_
 */
function checkSQLInput_noSpace(string) {
	return string ? checkSQLInput(string
			// .replace(/[\s\n]+$|^[\s\n]+/g,'')
			.replace(/^\s+|\s+$/g, ''))
		: '';
}
;
/*

2010/6/1
test time:

'   fhdgjk   lh gjkl ;sfdf d  hf gj '

.replace(/^\s+|\s+$/g, '')
~<
.replace(/\s+$|^\s+/g, '')
<
.replace(/^\s+/, '').replace(/\s+$/, '')
~<
.replace(/\s+$/, '').replace(/^\s+/, '')

*/



_// JSDT:_module_
.
/**
 * 轉換字串成數值，包括分數等。分數亦將轉為分數。
 * @param {String} number	欲轉換之值
 * @return
 * @_memberOf	_module_
 */
parse_number = function(number) {
	var m = typeof number;
	if (m === 'number')
		return number;
	if (!number || m !== 'string')
		return NaN;

	number = number.replace(/(\d),(\d)/g, '$1$2');
	if (m = number.match(/(-?[\d.]+)\s+([\d.]+)\/([\d.]+)/)) {
		var p = parseFloat(m[1]), q = parseFloat(m[2]) / parseFloat(m[3]);
		return p + (m[1].charAt(0) === '-' ? -q : q);
	}
	if (m = number.match(/(-?[\d.]+)\/([\d.]+)/))
		// new quotient(m[1],m[2])
		return parseFloat(m[1]) / parseFloat(m[2]);

/*
	try {
		return isNaN(m = parseFloat(number)) ?
				//	TODO: security hole
				eval(number) : m;
	} catch (e) {
		return m;
	}
*/
};



return (
	_// JSDT:_module_
);
}


});

