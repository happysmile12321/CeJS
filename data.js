
/**
 * @name	CeL data function
 * @fileoverview
 * 本檔案包含了 data 處理的 functions。
 * @since	
 */


if (typeof CeL === 'function')
CeL.setup_module('data',
{
require : 'data.native.to_fixed',
code : function(library_namespace, load_arguments) {
'use strict';

//	requiring
var to_fixed;
eval(library_namespace.use_function(this));


/**
 * null module constructor
 * @class	data 處理的 functions
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




/*
	eval(uneval(o)): IE 沒有 uneval
	http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone

way1:
return YAHOO.lang.JSON.parse( YAHOO.lang.JSON.stringify( obj ) );

TODO:
1.
防止交叉參照版: try
var a=function(){this.a=1,this.b={a:this.a},this.a={b:this.b};},b=cloneObject(a);
.or.
var a={},b;
a.a={a:1};
a.b={a:a.a};
a.a={b:a.b};
b=cloneObject(a);

恐須改成
=new cloneObject();


2.
equal()

*/
_// JSDT:_module_
.
clone_object =
/**
 * clone native Object
 * @param {Object} object
 * @param {Boolean} not_trivial
 * @return
 * @since	2008/7/19 11:13:10
 */
function clone_object(object, not_trivial) {
	if (!object || !(object instanceof Object)
			// || typeof(object) != 'object'
			)
		return object;
	var i, r = new object.constructor(object); // o.constructor()
	for (i in object)
		// o[i]===o: 預防 loop, 但還是不能防止交叉參照
		r[i] = not_trivial/* ||o[i]===o */? object[i] : clone_object(object[i], deep);
	return r;
};


/*	2004/5/5
	輸入('"','dh"fdgfg')得到2:指向"的位置
*/
function getQuoteIndex(quote,str){	//	quote:['"/]，[/]可能不太適用，除非將/[/]/→/[\/]/
 var i,l=0;
 while(i=str.indexOf(quote,l),i>0&&str.charAt(i-1)=='\\')
  if( str.slice(l,i-2).match(/(\\+)$/) && RegExp.$1.length%2 )break;
  else l=i+1;
 return i;
}





//{var a=[],b,t='',i;a[20]=4,a[12]=8,a[27]=4,a[29]=4,a[5]=6,a.e=60,a.d=17,a.c=1;alert(a);b=sortValue(a);alert(a+'\n'+b);for(i in b)t+='\n'+b[i]+'	'+a[b[i]];alert(t);}
//	依值排出key array…起碼到現在，我還看不出此函數有啥大功用。
//	array,否則會出現error!	mode=1:相同value的以','合併,mode=2:相同value的以array填入
function sortValue(a,mode){
	var s=[],r=[],i,j,b,k=[];
	// 使用(i in n)的方法，僅有數字的i會自動排序；這樣雖不必用sort()，但數字亦會轉成字串。
	for(i in a)
		if((b=isNaN(i)?i:parseFloat(i)),typeof s[j=isNaN(j=a[i])?j:parseFloat(j)]=='undefined')
			k.push(j),s[j]=b;
		else if(typeof s[j]=='object')s[j].push(b);
		else s[j]=[s[j],b];
	// sort 方法會在原地排序 Array 物件
	for(i=0,k.sort(function(a,b){return a-b;});i<k.length;i++)
		if(typeof(b=s[k[i]])=='object')
			if(mode==1)
				// b.join(',')與''+b效能相同
				r.push(b.join(','));
			else if(mode==2)r.push(b);
			else for(j in b)r.push(b[j]);
		else r.push(b);
	return r;
}


/*	2005/7/18 21:26
	依照所要求的index(sortByIndex_I)對array排序。
	sortByIndex_Datatype表某index為數字/字串或function
	先設定sortByIndex_I,sortByIndex_Datatype再使用array.sort(sortByIndex);

	example:
var array=[
'123	avcf	334',
'131	hj	562',
'657	gfhj	435',
'131	ajy	52',
'345	fds	562',
'52	gh	435',
];
sortByIndex_I=[0,1],sortByIndex_Datatype={0:1,2:1};
for(i in array)array[i]=array[i].split('	');
array.sort(sortByIndex);
alert(array.join('\n'));
*/
var sortByIndex_I,sortByIndex_Datatype;
function sortByIndex(a,b){
 //alert(a+'\n'+b);
 for(var i=0,n;i<sortByIndex_I.length;i++)
  if(sortByIndex_Datatype[n=sortByIndex_I[i]]){
   if(typeof sortByIndex_Datatype[n]=='function'){
    if(n=sortByIndex_Datatype[n](a[n],b[n]))return n;
   }else if(n=a[n]-b[n])return n;
  }else if(a[n]!=b[n])return a[n]>b[n]?1:-1;
 return 0;
}

/*	2005/7/18 21:26
	依照所要求的index對array排序，傳回排序後的index array。
	**假如設定了separator，array的元素會先被separator分割！

	example:
var array=[
'123	avcf	334',
'131	hj	562',
'657	gfhj	435',
'131	ajy	52',
'345	fds	562',
'52	gh	435',
];
alert(getIndexSortByIndex(array,'	',[0,1],[0,2]));
alert(array.join('\n'));	//	已被separator分割！

*/
function getIndexSortByIndex(array, separator, indexArray, isNumberIndex) {
	//	判定與事前準備(設定sortByIndex_I,sortByIndex_Datatype)
	if (typeof indexArray === 'number') sortByIndex_I = [indexArray];
	else if (typeof indexArray !== 'object' || indexArray.constructor != Array) sortByIndex_I = [0];
	else sortByIndex_I = indexArray;
	var i, sortByIndex_A = [];
	sortByIndex_Datatype = {};
	if (typeof isNumberIndex == 'object') {
		if (isNumberIndex.constructor == Array) {
			sortByIndex_Datatype = {};
			for (i = 0; i < isNumberIndex.length; i++) sortByIndex_Datatype[isNumberIndex[i]] = 1;
		} else sortByIndex_Datatype = isNumberIndex;
		for (i in sortByIndex_Datatype)
			if (isNaN(sortByIndex_Datatype[i]) || parseInt(sortByIndex_Datatype[i]) != sortByIndex_Datatype[i]) delete sortByIndex_Datatype[i];
	}
	if (typeof array != 'object') return;

	//	main work: 可以不用重造array資料的話..
	for (i in array) {
		if (separator) array[i] = array[i].split(separator);
		sortByIndex_A.push(i);
	}
	sortByIndex_A.sort(function (a, b) { return sortByIndex(array[a], array[b]); });

	/*	for: 重造array資料
	var getIndexSortByIndexArray=array;
	for(i in getIndexSortByIndexArray){
	if(separator)getIndexSortByIndexArray[i]=getIndexSortByIndexArray[i].split(separator);
	sortByIndex_A.push(i);
	}
	sortByIndex_A.sort(function (a,b){return sortByIndex(getIndexSortByIndexArray[a],getIndexSortByIndexArray[b]);});
	*/

	return sortByIndex_A;
}


//simpleWrite('char_frequency report3.txt',char_frequency(simpleRead('function.js')+simpleRead('accounts.js')));
//{var t=reduceCode(simpleRead('function.js')+simpleRead('accounts.js'));simpleWrite('char_frequency source.js',t),simpleWrite('char_frequency report.txt',char_frequency(t));}	//	所費時間：十數秒（…太扯了吧！）
_// JSDT:_module_
.
/**
 * 測出各字元的出現率。 普通使用字元@0-127：9-10,13,32-126，reduce後常用：9,32-95,97-125
 * 
 * @param {String} text
 *            文檔
 * @return
 * @_memberOf _module_
 */
char_frequency=function (text) {
	var i, a, c = [], d, t = '' + text, l = t.length, used = '', unused = '', u1 = -1, u2 = u1;
	for (i = 0; i < l; i++)
		if (c[a = t.charCodeAt(i)])
			c[a]++;
		else
			c[a] = 1;
	for (i = u1; i < 256; i++)
		if (c[i]) {
			if (u2 + 1 === i)
				used += ',' + i, unused += (u2 < 0 ? '' : '-' + u2);
			u1 = i;
		} else {
			if (u1 + 1 === i)
				unused += ',' + i, used += (u1 < 0 ? '' : '-' + u1);
			u2 = i;
		}
	//	若是reduceCode()的程式，通常在120項左右。
	for (i = 0, t = 'used:' + used.substr(1) + '\nunused:' + unused.substr(1)
			+ '\n', d = sortValue(c, 2).reverse(); i < d.length; i++) {
		t += NewLine
				+ (a = d[i])
				+ '['
				+ fromCharCode(a).replace(/\0/g, '\\0').replace(/\r/g, '\\r')
						.replace(/\n/g, '\\n').replace(/\t/g, '\\t') + ']'
				+ ':	' + (a = c[typeof a === 'object' ? a[0] : a]) + '	'
				+ (100 * a / l);
		//if(200*v<l)break;	//	.5%以上者←選購
	}
	alert(t);
	return t;
};

/*	
flag:
	(flag&1)==0	表情符號等不算一個字
	(flag&1)==1	連表情符號等也算一個字
	(flag&2)==1	將 HTML tag 全部消掉

可讀性/適讀性
http://en.wikipedia.org/wiki/Flesch-Kincaid_Readability_Test
http://en.wikipedia.org/wiki/Gunning_fog_index
Gunning-Fog Index：簡單的來說就是幾年的學校教育才看的懂你的文章，數字越低代表越容易閱讀，若是高於17那表示你的文章太難囉，需要研究生才看的懂，我是6.08，所以要受過6.08年的學校教育就看的懂囉。
Flesch Reading Ease：這個指數的分數越高，表示越容易了解，一般標準的文件大約介於60~70分之間。
Flesch-Kincaid grade level：和Gunning-Fog Index相似，分數越低可讀性越高，越容易使閱讀者了解，至於此指數和Gunning-Fog Index有何不同，網站上有列出計算的演算法，有興趣的人可以比較比較。

DO.normalize(): 合併所有child成一String, may crash IE6 Win!	http://www.quirksmode.org/dom/tests/splittext.html
*/
_// JSDT:_module_
.
/**
 * 計算字數 count words.
 * 
 * @param {String} text
 *            文檔
 * @param {Number} flag	文檔格式/處理方法
 * @return	{Number} 字數 
 * @_memberOf _module_
 */
count_word = function(text, flag) {
	var is_HTML = flag & 2;

	//	is HTML object
	if (typeof text === 'object')
		if (text.innerText)
			text = text.innerText, is_HTML = 0;
		else if (text.innerHTML)
			text = text.innerHTML, is_HTML = 1;

	if (typeof text !== 'string')
		return 0;

	//	和perl不同，JScript常抓不到(.*?)之後還接特定字串的東西，大概因為沒有s。(.*?)得改作([\s\S]*?)？ 或者該加/img？
	if (is_HTML)
		text = text
				.replace(/<!--([\s\S]*?)-->/g, '')
				.replace(/<[\s\n]*\/?[\s\n]*[a-z][^<>]*>/gi, '');

	if (flag & 1)
		//	連表情符號或 '（~。），' / 破折號　'——' /　刪節號 '……' 等標點符號也算一個字
		text = text.replace(/[\+\-–*\\\/?!,;.<>{}\[\]@#$%^&_|"'~`—…、，；。！？：()（）「」『』“”‘’]{2,}/g, ';');

	return text
			//	去掉注解用的括弧、書名號、專名號、印刷符號等
			.replace(/[()（）《》〈〉＊＃]+/g, '')
			//	將英文、數字等改成單一字母。[.]: 縮寫
			//	http://en.wikibooks.org/wiki/Unicode/Character_reference/0000-0FFF
			.replace(/[a-zA-ZÀ-ÖØ-öø-ʨ\-–'.\d]{2,}/g, 'w')
			//	date/time or number
			.replace(/[\d:+\-–\.\/,]{2,}/g, '0')
			//	再去掉*全部*空白
			.replace(/[\s\n]+/g, '')
			.length;
};







_// JSDT:_module_
.
/**
 * 運算式值的二進位表示法	已最佳化:5.82s/100000次dec_to_bin(20,8)@300(?)MHz,2.63s/100000次dec_to_bin(20)@300(?)MHz
 * @param {Number} number	number
 * @param places	places,字元數,使用前置0來填補回覆值
 * @return
 * @example
 * {var d=new Date,i,b;for(i=0;i<100000;i++)b=dec_to_bin(20);alert(gDate(new Date-d));}
 * @_memberOf	_module_
 */
dec_to_bin = function(number, places) {
	if (places && number + 1 < (1 << places)) {
		var h = '', b = number.toString(2), i = b.length;
		for (; i < places; i++)
			h += '0';
		return h + b;
	}
	//	native code 還是最快！
	return number.toString(2);

	//	上兩代：慢	var b='',c=1;for(p=p&&n<(p=1<<p)?p:n+1;c<p;c<<=1)b=(c&n?'1':'0')+b;return b;	//	不用'1:0'，型別轉換比較慢.不用i，多一個變數會慢很多
	//	上一代：慢	if(p&&n+1<(1<<p)){var h='',c=1,b=n.toString(2);while(c<=n)c<<=1;while(c<p)c<<=1,h+='0';return h+(n?n.toString(2):'');}
};





/*
	value	(Array)=value,(Object)value=
	[null]=value	累加=value
	value=[null]	value=''

	type: value type	['=','][int|float|_num_]
	*前段
		以[']或["]作分隔重定義指定號[=]與分隔號[,]
	*後段
		數字表累加
		'int'表整數int，累加1
		'float'表示浮點數float，累加.1	bug:應該用.to_fixed()
		不輸入或非數字表示string

	mode
	_.set_Object_value.F.object
	_.set_Object_value.F.array(10進位/當做數字)
	number: key部分之base(10進位，16進位等)

	example:
	set_Object_value('UTCDay','Sun,Mon,Tue,Wed,Thu,Fri,Sat','int');	//	自動從0開始設，UTCDay.Tue=2
	set_Object_value('UTCDay','Sun,Mon,Tue,Wed,Thu,Fri,Sat');	//	UTCDay.Sun=UTCDay.Fri=''
	set_Object_value('add','a=3,b,c,d',2);	//	累加2。add.b=5
	set_Object_value('add','a,b,c,d',1,_.set_Object_value.F.array);	//	add[2]='c'
	set_Object_value('add','4=a,b,c,d',2,_.set_Object_value.F.array);	//	累加2。add[8]='c'

*/
_// JSDT:_module_
.
/**
 * 設定object之值，輸入item=[value][,item=[value]..]。
 * value未設定會自動累加。
 * 使用前不必需先宣告…起碼在現在的JS版本中
 * @param obj	object name that need to operate at
 * @param value	valueto set
 * @param type	累加 / value type
 * @param mode	mode / value type
 * @return
 * @_memberOf	_module_
 */
set_Object_value = function(obj, value, type, mode) {
	if (!value || typeof o !== 'string')
		return;

	var a, b, i = 0, p = '=', sp = ',', e = "if(typeof " + obj + "!='object')"
			+ obj + "=new " + (mode ?
				//	"[]":"{}"
				//	Array之另一種表示法：[value1,value2,..], Object之另一種表示法：{key1:value1,key2:value2,..}
				"Array" : "Object")
			+ ";",
		//	l: item, n: value to 累加
		n, Tint = false, cmC = '\\u002c', eqC = '\\u003d';
	if (type) {
		if (typeof a === 'string') {
			a = type.charAt(0);
			if (a === '"' || a === "'") {
				a = type.split(a);
				p = a[1], sp = a[2], type = a[3];
			}
		}
		if (type === 'int')
			type = 1, Tint = true;
		else if (type === 'float')
			type = .1;
		else if (isNaN(type))
			type = 0;
		else if (type == parseInt(type))
			type = parseInt(type), Tint = true;
		else
			type = parseFloat(type); // t被設成累加數
	}
	//else t=1;

	if (typeof value === 'string')
		value = value.split(sp);
	// escape regex characters from jQuery
	cmC = new RegExp(cmC.replace(
			/([\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"), 'g'),
			eqC = new RegExp(eqC.replace(
					/([\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"), 'g');

	if (type)
		//	n: 現在count到..
		n = -type;

	for (; i < value.length; i++) {
		if (value[i].indexOf(p) === -1)
			value[i] = mode ? p + value[i] : value[i] + p;// if(v[i].indexOf(p)==-1&&m)v[i]=p+v[i];//
			if (mode && value[i] === p) {
				n += type;
				continue;
			}
			a = value[i].split(p);
			if (!mode && !a[0])
				//	去掉不合理的(Array可能有NaN index，所以不設條件。)
				continue;
			a[0] = a[0].replace(cmC, ',').replace(eqC, '='), a[1] = a[1].replace(
					cmC, ',').replace(eqC, '=');
			if (type)
				if (mode) {
					if (!a[0])
						a[0] = (n += type);
					else if (!isNaN(b = mode > 0 ? parseInt(a[0], mode) : a[0]))
						n = Tint ? (a[0] = parseInt(b)) : parseFloat(b);
				} else if (!a[1])
					a[1] = (n += type);
				else if (!isNaN(a[1]))
					n = Tint ? parseInt(a[1]) : parseFloat(a[1]);
					if (!type || Tint && isNaN(b = parseInt(a[1]))
							|| isNaN(b = parseFloat(a[1])))
						b = a[1];
					a = a[0];
					e += obj + '[' + (!type || isNaN(a) ? dQuote(a) : a) + ']='
						+ (!type || isNaN(b) ? dQuote(b) : b) + ';';
	}

	try {
		//if(o=='kk')alert(e.slice(0,500));
		//	因為沒想到其他方法可存取Global的object，只好使用eval..可以試試obj=set_Object_value(0,..){this=new Aaaray/Object}
		return library_namespace.eval_code(e);
	} catch (e) {
		library_namespace.err('Error @ ' + obj);
		library_namespace.err(e);
		return;
	}
};

_.set_Object_value.F = {
	// object is default
	'object' : 0,
	'array' : -1
};



_// JSDT:_module_
.
/**
 * 將字串組分作 Object
 * @param {String} value_set	字串組, e.g., 'a=12,b=34'
 * @param assignment_char	char to assign values, e.g., '='
 * @param end_char	end char of assignment
 * @return
 * @since	2006/9/6 20:55, 2010/4/12 23:06:04
 * @_memberOf	_module_
 */
split_String_to_Object = function(value_set, assignment_char, end_char) {
	if (typeof value_set !== 'string' || !value_set)
		return {};

	value_set = value_set.split(end_char || /[,;]/);

	if (!assignment_char)
		assignment_char = /[=:]/;

	var a, o = {}, _e = 0, l = value_set.length;
	for (; _e < l; _e++) {
		//	http://msdn.microsoft.com/library/en-us/jscript7/html/jsmthsplit.asp
		a = value_set[_e].split(assignment_char, 2);
		//library_namespace.debug(value_set[_e] + '\n' + a[0] + ' ' + a[1], 2);
		if (a[0] !== '')
			o[a[0]] = a[1];
	}
	return o;
};






/*	2003/10/1 15:46
	比較string:m,n從起頭開始相同字元數
	return null: 格式錯誤，-1: !m||!n
	若一開始就不同：0


TODO:

test starting with

2009/2/7 7:51:58
看來測試 string 的包含，以 .indexOf() 最快。
即使是比較 s.length 為極小常數的情況亦復如此

下面是快到慢：

//	long,short
var contain_substring=[
function(l,s){
 var a=0==l.indexOf(s);
 return a;
}
,function(l,s){
 return 0==l.indexOf(s);
}
,function(l,s){
 return s==l.slice(0,s.length);
}
,function(l,s){
 return l.match(s);
}
,function(l,s){
 for(var i=0;i<s.length;i++)
  if(s.charAt(i)!=l.charAt(i))return 0;
 return 1;
}
];

function test_contain_substring(){
 for(var i=0;i<contain_substring.length;i++){
  var t=new Date;
  for(var j=0;j<50000;j++){
   contain_substring[i]('sdfgjk;sh*dn\\fj;kgsamnd nwgu!eoh;nfgsj;g','sdfgjk;sh*dn\\fj;kgsamnd nwgu!');
   contain_substring[i]('sdbf6a89* /23hsauru','sdbf6a89* /23');
  }
  sl(i+': '+(new Date-t));
 }
}


//	極小常數的情況:
//	long,short
var contain_substring=[
function(l,s){
 var a=0==l.indexOf(s);
 return a;
}
,function(l,s){
 return 0==l.indexOf(s);
}
,function(l,s){
 return s==l.slice(0,1);
}
,function(l,s){
 return s.charAt(0)==l.charAt(0);
}
,function(l,s){
 return l.match(/^\//);
}
];

function test_contain_substring(){
 for(var i=0;i<contain_substring.length;i++){
  var t=new Date;
  for(var j=0;j<50000;j++){
   contain_substring[i]('a:\\sdfg.dfg\\dsfg\\dsfg','/');
   contain_substring[i]('/dsfg/adfg/sadfsdf','/');
  }
  sl(i+': '+(new Date-t));
 }
}


*/

_// JSDT:_module_
.
/**
 * test if 2 string is at the same length
 * @param s1	string 1
 * @param s2	string 2
 * @return
 * @_memberOf	_module_
 */
same_length = function(s1, s2) {
	if (typeof m !== 'string' || typeof n !== 'string')
		return;
	if (!s1 || !s2)
		return 0;

	var i = s1.length, b = 0, s = s2.length;
	if (i < s) {
		if (
				//m==n.slice(0,i=m.length)
				0 === s2.indexOf(s1))
			return i;
	} else if (
			//s2==s1.slice(0,i=s2.length)
			i = s, 0 === s1.indexOf(s2))
		return i;

	//sl('*same_length: start length: '+i);
	while ((i = (i + 1) >> 1) > 1 && (s = s2.substr(b, i)))
		//{sl('same_length: '+i+','+b+'; ['+m.substr(b)+'], ['+s+'] of ['+n+']');
		if (s1.indexOf(s, b) === b)
			b += i;
	//sl('*same_length: '+i+','+b+'; ['+m.charAt(b)+'], ['+n.charAt(b)+'] of ['+n+']');
	//var s_l=i&&m.charAt(b)==n.charAt(b)?b+1:b;
	//sl('*same_length: '+s_l+':'+m.slice(0,s_l)+',<em>'+m.slice(s_l)+'</em>; '+n.slice(0,s_l)+',<em>'+n.slice(s_l)+'</em>');
	return i && s1.charAt(b) === s2.charAt(b) ? b + 1 : b;
};



//-----------------------------------------------------------------------------



/*	
	http://www.bipm.org/en/si/si_brochure/chapter3/prefixes.html
	http://en.wikipedia.org/wiki/International_System_of_Units
	http://www.merlyn.demon.co.uk/js-maths.htm#RComma
	http://physics.nist.gov/cuu/Units/prefixes.html
	http://www.uni-bonn.de/~manfear/numbers_names.php
	http://wawa.club.hinet.net/cboard1/HCB_Dis.asp?BrdNo=78&SubNo=78761&Club=0&ClsName=%B1%D0%A8%7C%BE%C7%B2%DF
	http://bbs.thu.edu.tw/cgi-bin/bbscon?board=English&file=M.1046073664.A&num=106
*/
//to_SI_prefix[generateCode.dLK]='setTool,to_fixed,-to_SI_prefix.n,-to_SI_prefix.v';


/**
 * 將數字轉為 K, M, G 等 SI prefixes 表示方式，例如 6458 轉成 6.31K。
 * @param {Number} number	數字
 * @param {Number} digits	to fixed digit
 * @type	{String}
 * @return	{String}	SI prefixes 表示方式
 * @requires	setTool,to_fixed
 * @_memberOf	_module_
 */
function to_SI_prefix() {
	//	Initialization
	//	在 IE5 中，因為 base 沒有預先定義，因此在這邊會出現錯誤。
	var
	//	define what is "1k"
	base = 1024,
	N = base, v = [ base ],
	s = 'k,M,G,T,P,E,Z,Y'.split(','),
	l = s.length;
	while (l--)
		v.push(N *= base);

	return function(number, digits) {
		var p = 1;
		if (number < v[0])
			return number;

		while (number >= v[p])
			p++;

		return to_fixed.call(number / v[--p], isNaN(digits) ? 2 : digits)
				+ s[p];
	};
};


library_namespace.set_initializor(to_SI_prefix, _);


//	將漢字轉為阿拉伯數字表示法(0-99999)
function turnKanjiToNumbers(num) {
	if (!num) return 0;
	if (!isNaN(num)) return num;
	var i = 0, l, m, n = '〇,一,二,三,四,五,六,七,八,九'.split(','), d = '萬,千,百,十,'.split(','), r = 0
	//	Ｏ, ○=[〇]	http://zh.wikipedia.org/wiki/%E6%97%A5%E8%AA%9E%E6%95%B8%E5%AD%97
	, p = ('' + num).replace(/\s/g, '').replace(/[Ｏ○]/g, '〇')
	;
	for (; i < n.length; i++) n[n[i]] = i;
	for (i = 0; i < d.length; i++) {
		if (p && (m = d[i] ? p.indexOf(d[i]) : p.length) != -1)
			if (!m && d[i] === '十') r += 1, p = p.slice(1); else if (isNaN(l = n[p.slice(0, m).replace(/^〇+/, '')])) return num; else r += l, p = p.slice(m + 1);
		if (d[i]) r *= 10;
	}
	return r;
}
//alert(turnKanjiToNumbers('四萬〇三百七十九'));
//alert(turnKanjiToNumbers('十'));

//	將阿拉伯數字轉為中文數字大、小兩種表示法/讀法	,to_Chinese_numeralD,to_Chinese_numeralInit,"to_Chinese_numeralInit();",_to_Chinese_numeral,to_Chinese_numeral
var to_Chinese_numeralD;
//to_Chinese_numeralInit[generateCode.dLK]='to_Chinese_numeralD';
function to_Chinese_numeralInit(){
 to_Chinese_numeralD={
  'num':['〇,一,二,三,四,五,六,七,八,九'.split(','),'零,壹,貳,參,肆,伍,陸,柒,捌,玖'.split(',')]	//	數字	叄
  //	http://zh.wikipedia.org/wiki/%E4%B8%AD%E6%96%87%E6%95%B0%E5%AD%97	http://zh.wikipedia.org/wiki/%E5%8D%81%E8%BF%9B%E5%88%B6	http://zh.wikipedia.org/wiki/%E4%B8%AD%E6%96%87%E6%95%B0%E5%AD%97	http://lists.w3.org/Archives/Public/www-style/2003Apr/0063.html	http://forum.moztw.org/viewtopic.php?t=3043	http://www.moroo.com/uzokusou/misc/suumei/suumei.html	http://espero.51.net/qishng/zhao.htm	http://www.nchu.edu.tw/~material/nano/newsbook1.htm
  //	十億（吉）,兆（萬億）,千兆（拍）,百京（艾）,十垓（澤）,秭（堯）,秭:禾予;溝(土旁);,無量大數→,無量,大數;[載]之後的[極]有的用[報]	異體：阿僧[禾氏],For Korean:阿僧祗;秭:禾予,抒,杼,For Korean:枾	For Korean:不可思議(不:U+4E0D→U+F967)
  //	Espana應該是梵文所譯 因為根據「大方廣佛華嚴經卷第四十五卷」中在「無量」這個數位以後還有無邊、無等、不可數、不可稱、不可思、不可量、不可說、不可說不可說，Espana應該是指上面其中一個..因為如果你有心查查Espana其實應該是解作西班牙文的「西班牙」
  ,'d':',萬,億,兆,京,垓,秭,穰,溝,澗,正,載,極,恒河沙,阿僧祇,那由他,不可思議,無量,大數,Espana'	//	denomination, 單位
  //	http://zh.wikipedia.org/wiki/%E5%8D%81%E9%80%80%E4%BD%8D
  //	比漠微細的，是自天竺的佛經上的數字。而這些「佛經數字」已成為「古代用法」了。
  //	小數單位(十退位)：分,釐(厘),毫(毛),絲,忽,微,纖,沙,塵（納）,埃,渺,漠(皮),模糊,逡巡,須臾（飛）,瞬息,彈指,剎那（阿）,六德(德),虛,空,清,淨	or:,虛,空,清,淨→,空虛,清淨（仄）,阿賴耶,阿摩羅,涅槃寂靜（攸）
  ,'bd':0	//	暫時定義
 };
  to_Chinese_numeralD.bd=[(',十,百,千'+to_Chinese_numeralD.d).split(','),(',拾,佰,仟'+to_Chinese_numeralD.d).split(',')]	//	base denomination
  ,to_Chinese_numeralD.d=to_Chinese_numeralD.d.split(',');
}
to_Chinese_numeralInit();
/*	處理1-99999的數,尚有bug
	東漢時期的《數述記遺》
		一是上法，為自乘系統: 萬萬為億，億億為兆，兆兆為京。
		二是中法，為萬進系統，皆以萬遞進
		三是下法，為十進系統，皆以十遞進←現代的科學技術上用的“兆”，以及_to_Chinese_numeral()用的
*/
//_to_Chinese_numeral[generateCode.dLK]='to_Chinese_numeralD,*to_Chinese_numeralInit();';
function _to_Chinese_numeral(numStr, kind) {
	if (!kind)
		kind = 0;
	// 用r=[]約多花一倍時間!
	var i = 0, r = '', l = numStr.length - 1, d, tnum = to_Chinese_numeralD.num[kind], tbd = to_Chinese_numeralD.bd[kind], zero = tnum[0];
	for (; i <= l; i++)
		// if(d=parseInt(numStr.charAt(i)))比較慢
		if ((d = numStr.charAt(i)) != '0')
			// '〇一二三四五六七八'.charAt(d) 比較慢
			r += tnum[d] + tbd[l - i];
		else if (r.slice(-1) != zero)
			if (Math.floor(numStr.substr(i + 1)))
				r += zero;
			else
				break;
	return r;
}
//2.016,2.297,2.016
//{var d=new Date,v='12345236',i=0,a;for(;i<10000;i++)a=to_Chinese_numeral(v);alert(v+'\n→'+a+'\ntime:'+gDate(new Date-d));}

//to_Chinese_numeral[generateCode.dLK]='to_Chinese_numeralD,to_Chinese_numeralInit,_to_Chinese_numeral,to_Chinese_numeral';//,*to_Chinese_numeralInit();
/**
 * 將數字轉為漢字表示法。
 * num>1京時僅會取概數，此時得轉成string再輸入！
 * TODO:
 * 統整:尚有bug。
 * 廿卅
 * @param num
 * @param kind
 * @returns
 */
function to_Chinese_numeral(num, kind) {
	// num=parseFloat(num);
	if (typeof num == 'number')
		num = num.toString(10);
	num = ('' + num).replace(/[,\s]/g, '');
	if (isNaN(num))
		return '(非數值)';
	if (num.match(/(-?[\d.]+)/))
		num = RegExp.$1;
	if (!kind)
		kind = 0;

	var j, i, d = num.indexOf('.'), k, l, m, addZero = false, tnum = to_Chinese_numeralD.num[kind], zero = tnum[0], td = to_Chinese_numeralD.d;// i:integer,整數;d:decimal,小數
	if (d == -1)
		d = 0;
	else
		for (num = num.replace(/0+$/, ''), i = num.substr(d + 1), num = num
				.slice(0, d), d = '', j = 0; j < i.length; j++)
			// 小數
			d += tnum[i.charAt(j)];

	// 至此num為整數
	if (num.charAt(0) == '-')
		i = '負', num = num.substr(1);
	else
		i = '';
	num = num.replace(/^0+/, '');

	m = num.length % 4, j = m - 4, l = (num.length - (m || 4)) / 4;
	// addZero=false, l=Math.floor((num.length-1)/4)
	for (; j < num.length; m = 0, l--)
		// 這邊得用 parseInt( ,10): parseInt('0~')會用八進位，其他也有奇怪的效果。
		if (Math.floor(m = m ? num.slice(0, m) : num.substr(j += 4, 4))) {
			m = _to_Chinese_numeral(m, kind);
			if (addZero = addZero && m.charAt(0) != zero)
				i += zero + m + td[l], addZero = false;
			else
				i += m + td[l];
		} else
			addZero = true;

	return (i ? i.slice(0, 2) == '一十' ? i.substr(1) : i : zero)
			+ (d ? '點' + d : '');
}

_// JSDT:_module_
.
//	轉換成貨幣:新台幣金額中文大寫表示法 Converted into money notation
//turnToMoney[generateCode.dLK]='to_Chinese_numeral';
turn_to_TWD = function (num) {
	if (typeof num === 'string')
		num = num.replace(/[\s,$]+/g, '');
	var i = (num = to_Chinese_numeral(num, 1)).indexOf('點');
	//	銀行習慣用法，零可以不用寫。
	num = num.replace(/([仟萬億兆京垓秭穰溝澗正載極])零/g, '$1');
	return '新臺幣' + (i == -1 ? num + '圓整' : num.slice(0, i) + '圓' + num.charAt(++i)
			+ '角' + (++i == num.length ? '' : num.charAt(i++) + '分')
			+ num.substr(i));
};


//	分斷行	2003/1/25 22:40
function getText() {//html→text
	//<.+?>	<[^>]+>	<\s*\/?\s*[a-zA-Z](.*?)>	<!	過慢?
	return this.valueOf().replace(/<s>[^<]*<\/s>/gi, '').replace(/<w?br[^>]*>/gi, '\n').replace(/<\/?[A-Za-z][^>]*>/g, '');
}
function trimStr_(s, l, m) {
 var lt,lt2,gt,i=0,c=l,t='',I=0;//less than,great than,index,left count index(left length now),text now,text index
 while(I<s.length){
  //將lt,gt定在下一label之首尾,i為下一次搜尋起點.label定義:/<.+?>/
  if(i!=-1)if((lt=s.indexOf('<',i))!=-1){
   if((gt=s.indexOf('>',lt+1))==-1)i=lt=-1;
   else{i=gt+1;while(lt!=-1&&(lt2=s.indexOf('<',lt+1))!=-1&&lt2<gt)lt=lt2;}
  }else i=lt=-1;
  //if(s.indexOf('')!=-1)alert(i+','+lt+','+gt+';'+l+','+c+'\n'+t);
  if(lt==-1)gt=lt=s.length;
  //未來:考慮中英文大小，不分隔英文字。前提:'A'<'z'..或許不用
  while(I+c<=lt){t+=s.substr(I,c)+(m?'\n':'<br/>');I+=c;c=l;}
  t+=s.slice(I,gt+1);c-=lt-I;I=gt+1;
 }
 return t;
}
/*	將字串以長l分隔
	m==0: html用, 1:text
*/
//trimStr[generateCode.dLK]='trimStr_';
function trimStr(l,m){
 var s=this.valueOf(),t=[],sp='<br/>';
 if(!s||!l||l<1||!String.fromCharCode)return m?s.gText():s;//||!String.charCodeAt:v5.5
 s=s.turnU(m);//(m):這樣就不用再費心思了.不過既然都作好了,就留著吧..不,還是需要
 if(s.length<=l)return s;
 if(!m)s=s.replace(/<w?br([^>]*)>/gi,sp);

 s=s.split(sp=m?'\n':sp);//deal with line
 try{
  //	預防JS5不能push
  for(var i=0;i<s.length;i++)t.push(trimStr_(s[i],l,m));
 }catch(e){return this.valueOf();}
 return t.join(sp);
}





//-----------------------------------------------------------------------------


//mode=1:不取空字串
//	.split() appears from Internet Explorer 4.0
//	<a href="http://msdn.microsoft.com/en-us/library/s4esdbwz%28v=VS.85%29.aspx" accessdate="2010/4/16 20:4">Version Information (Windows Scripting - JScript)</a>
function strToArray(s, mode) {
	var a = [], last = 0, i;
	while ((i = s.indexOf(sp, last)) != -1) {
		if (mode == 0 || last != i) a[a.length] = s.slice(last, i);
		last = i + 1;
	}
	if (mode == 0 || last != s.length) a[a.length] = s.slice(last);
	return a;
}

//去除s之空白,包括字與字之間的
function disposeSpace(s) {
	if (!s) return s;
	var r = "", i, last;
	while ((i = s.indexOf(' ', last)) != -1)
		r += s.slice(last, i), last = i + 1;
	r += s.slice(last);
	return r;
}

//以label,mode:m置換s,先找到先贏
//輸入t['$k']=..會有問題，需用t['\\$k']=..
function changeV(s, l, m) {
	var i, r, re, t; //var I='';
	if (!m) m = 'g';
	if (s && (t = l ? l : label)) for (i in t) {
		//I+=', '+i+'='+t[i];
		re = new RegExp(i, m);
		s = s.replace(re, t[i]); //r=s.replace(re,t[i]);s=r;
	}
	//pLog(I.substr(2));
	//pLog('changeV:'+s);
	return s;
}

/*
//以label置換s,先找到先贏
function changeV(s) {
	for (var i, j = 0; j < labelN.length; j++)
		if ((i = s.indexOf(labelN[j])) != -1)
			s = s.slice(0, i) + labelV[j] + s.slice(i + labelN[j].length)
			, j = 0; //research from begin
	return s;
}
*/



//TODO: Object.keys(obj)
//	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
_// JSDT:_module_
.
get_Object_key = function(o) {
	//if (library_namespace.is_Array(o)) return o;
	//if (!library_namespace.is_Object(o)) return;
	var i, l = [];
	for(i in o)
		l.push(i);
	return l;
};

_// JSDT:_module_
.
get_Object_value = function(o) {
	//if (library_namespace.is_Array(o)) return o;

	//if (!library_namespace.is_Object(o)) return;
	var i, l = [];
	for(i in o)
		l.push(o[i]);
	return l;
};

_// JSDT:_module_
.
/**
 * 互換 key/value pairs.
 * @example
 * swap_key_value({A:1,B:2,s:4,t:[]}, [], /^[A-Z_\-\d]+$/) === [,'A','B']
 * @param {Object|object}pairs	key/value pairs
 * @param {Object|Array}[base]	把互換結果放在 base
 * @param {RegExp}[key_filter]	僅放入符合的 key
 * @returns
 */
swap_key_value = function(pairs, base, key_filter) {
	if (!base)
		base = {};

	var k;
	if (key_filter instanceof RegExp) {
		for (k in pairs)
			if (key_filter.test(k))
				base[pairs[k]] = k;
	} else
		for (k in pairs)
			base[pairs[k]] = k;

	return base;
};



return (
	_// JSDT:_module_
);
}


});

