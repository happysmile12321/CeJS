

/**
 * @name	CeL file function
 * @fileoverview
 * 本檔案包含了 file functions。
 * @since
 * @see
 * <a href="http://dev.w3.org/2006/webapi/FileAPI/" accessdate="2010/6/20 14:49">File API</a>	
 */

'use strict';
if (typeof CeL === 'function')
CeL.run(
{
name:'application.storage.file',
code : function(library_namespace) {


/**
 * null module constructor
 * @class	檔案操作相關之 function。
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




//	path處理	-------------------------------------------------------

/**
 * 減縮 path. 尚未處理：: * ?
 * 
 * @example <code>
 * reduce_path('http://hostname/../aaa/bbb/../ccc/../ddd',1);
 * </code>
 * 
 * @param {String}
 *            path
 * @param {Number}
 *            mode =1: 去除檔名，只餘目錄。如輸入 http://hostname/aaa/bbb/ccc，得到
 *            http://hostname/aaa/bbb/
 * @returns
 */
function reduce_path(path, mode) {
	library_namespace.debug('[' + typeof path + '] [' + path + ']', 2, 'reduce_path');
	if (!(path = '' + path))
		return;

	var t;
	if (t = path.match(/^"([^"]*)/))
		path = t[1];
	if (t = path.match(/(.*)\|<>/))
		path = t[1];

	// Windows environment variables 在真實 path 前,尚未測試！
	if (typeof WinEnvironment == 'object' && (t = path.match(/%(.+)%/g)))
		for (i in t)
			if (WinEnvironment[i])
				path.replace(new RegExp(i, "ig"), WinEnvironment[i]);

	var path_separator = library_namespace.env.path_separator,
	path_separator_RegExp = library_namespace.env.path_separator_RegExp;

	path = path.replace(new RegExp(path_separator == '/' ? '\\\\' : '/', "g"),
			path_separator);

	if (mode && (t = path.lastIndexOf(path_separator)) != -1
			&& t + 1 != path.length)
		// 去除檔名：假如輸入sss/ddd，會把ddd除去！需輸入sss/ddd/以標示ddd為目錄.
		path = path.slice(0, t + 1);

	// \\→\，未考慮到'\\pictures\scenic\canyon.bmp'的情況
	if (false)
		path = path.replace(new RegExp(path_separator + path_separator, 'g'),
				path_separator);

	path = path
		// .\→''
		.replace(new RegExp('^(\\.' + path_separator_RegExp + ')+'), '')
		// \.\→\
		.replace(new RegExp(path_separator_RegExp + '(\\.' + path_separator_RegExp + ')+', 'g'), path_separator)
		// xx\..\→''
		.replace(new RegExp('[^.' + path_separator_RegExp + ']+'
				+ path_separator_RegExp + '\\.\\.' + path_separator_RegExp, 'g'), '');
	library_namespace.debug('→ [' + path + ']', 2, 'reduce_path');
	return path;
}

_// JSDT:_module_
.
reduce_path = reduce_path;


//	去除hostname等，如輸入http://hostname/aaa/bbb/ccc得到aaa/bbb/ccc/
//	假如輸入的格式不正確，可能得出不預期的回應值！
/*	對library_namespace.env.path_separator.length>1的情形（嚴謹）
function getPathOnly(p){
 //discard hash & search
 var i=p.lastIndexOf('?'),j=p.lastIndexOf('#'),dirSpL=library_namespace.env.path_separator.length;
 if(i==-1)i=j;else if(j!=-1&&i>j)i=j;if(i!=-1)p=p.slice(0,i);
 //	去除http://hostname/等
 if(p.slice(0,5)=='file:///')p=p.substr('file:///'.length);	//	對file:///特別處理！
 else if((i=p.indexOf(':'+library_namespace.env.path_separator+library_namespace.env.path_separator))!=-1&&(i=p.indexOf(library_namespace.env.path_separator,i+(':'+library_namespace.env.path_separator+library_namespace.env.path_separator).length))!=-1))p=p.substr(i+dirSpL);	//	http://hostname/path→path
 else if(p.slice(0,dirSpL)==library_namespace.env.path_separator)
 //	/usr/local/→usr/local/
 if(p.substr(dirSpL,dirSpL)!=library_namespace.env.path_separator)p=p.substr(dirSpL);
 //	去除\\hostname\
 else if((i=p.indexOf(library_namespace.env.path_separator,dirSpL+dirSpL))>dirSpL+dirSpL)p=p.substr(i+dirSpL);
 //	\\\zzzz的情形：不合法的路徑
 else if(i!=-1)throw new Error(1,'illegal path:'+p);
 return p;
}
*/
//	對library_namespace.env.path_separator.length==1的情形簡化
//getPathOnly[generateCode.dLK]='library_namespace.env.path_separator';//,isFile
function getPathOnly(p){
 //discard hash & search
 var i=p.lastIndexOf('?'),j=p.lastIndexOf('#');
 if(i==-1)i=j;else if(j!=-1&&i>j)i=j;if(i!=-1)p=p.slice(0,i);
 //	去除http://hostname/等
 if(p.slice(0,8)=='file:///')p=p.substr(8);	//	對file:///（應該是file:）特別處理！
 else if((i=p.indexOf(':'+library_namespace.env.path_separator+library_namespace.env.path_separator))!=-1&&(i=p.indexOf(library_namespace.env.path_separator,i+3)!=-1))p=p.substr(i+1);	//	http://hostname/path→path
 else if(p.charAt(0)==library_namespace.env.path_separator)
  //	/usr/local/→usr/local/
  if(p.charAt(1)!=library_namespace.env.path_separator)p=p.substr(1);
  //	去除\\hostname\	不去除：.replace(/[^\\]+$/,'')
  else if((i=p.indexOf(library_namespace.env.path_separator,2))>2)p=p.substr(i+1);
  //	\\\zzzz的情形：不合法的路徑
  else if(i!=-1)throw new Error(1,'illegal path:'+p);
 if(typeof isFile=='function'&&isFile(p))	//	!isWeb()&&~
  p=p.replace(new RegExp(library_namespace.env.path_separator_RegExp+'[^'+library_namespace.env.path_separator_RegExp+']+$'),library_namespace.env.path_separator);
 return p;
}



var path_separator_candidates = [ '/', '\\' ],
path_separator_candidates_length = path_separator_candidates.length,
//path_separator_candidates_Regex=new RegExp(path_separator_candidates.join(''), 'g'),
path_separator_RegExp;

_// JSDT:_module_
.
guess_path_separator = function(path) {
	if (typeof path !== 'string' || !path)
		return;

	var count = 0, candidate, i, m;

	if (!path_separator_RegExp)
		//	初始設定
		for (path_separator_RegExp = [], i = 0; i < path_separator_candidates_length; i++)
			path_separator_RegExp[i] = new RegExp('\\' + path_separator_candidates[i], 'g');

	//	偵測最符合的
	for (i = 0; i < path_separator_candidates_length; i++) {
		m = path.match(path_separator_RegExp[i]);
		if (m && m.length > count)
			count = m.length, candidate = path_separator_candidates[i];
	}

	return candidate;
};


_// JSDT:_module_
.
/**
 * 取得 base_path 相對於 working_path 的路徑。
 * <p>
 * 當前處於 working_path，欲取得 base_path 下所指到的 resource_file_path，可使用: <code>
 * get_relative_path(base_path, working_path) + resource_file_path
 * </code>
 * </p>
 * TODO: 找出最大連續相同路徑。
 * 
 * @example
 * <code>
 * CeL.run('application.storage.file',function(){CeL.set_debug(2);CeL.log(CeL.get_relative_path('a/b/same/d/file','same/e/'));});
 * </code>
 * 
 * <code>
 * CeL.set_debug(2);CeL.get_relative_path('a/b/same/d/f/file','e/r/t/same/e/',1);
 * </code>
 * 
 * <code>
 * base_path = CeL.get_relative_path('kanashimi/www/cgi-bin/game/');
 * </code>
 * 
 * <code>
 * //	想要保持 Protocol，但卻是不同機器時。	<a href="http://nedbatchelder.com/blog/200710.html#e20071017T215538" accessdate="2011/8/28 0:18" title="Ned Batchelder: October 2007">Http-https transitions and relative URLs</a>
 * CeL.get_relative_path('cgi-bin/game/photo/','//lyrics.meicho.com.tw/game/game.pl?seg=diary21',1);
 * </code>
 * 
 * @param {String}
 *            base_path 給定 base path 的範本結構, base_path_structure.
 * @param {String}
 *            working_path 當前處於 working_path.
 * @param {Boolean}
 *            get_full_path 藉由 working_path 推測 base path 的 full path.
 *            否則回傳相對路徑(relative path)，會增加 ../ 等。
 * @returns {String} 推測的 base path 相對於 working_path 的 path.
 * 
 * @since 2003/10/1 15:57
 * @since 2011/8/28 00:16:40
 * @requres reduce_path,getPathOnly,library_namespace.env.path_separator,library_namespace.env.path_separator_RegExp
 * @_memberOf _module_
 */
get_relative_path = function(base_path, working_path, get_full_path) {

	library_namespace.debug('phase 1: 簡化並審查 path<br />base_path [' + base_path
			+ ']<br />working_path [' + working_path + ']', 2, 'get_relative_path');

	if (!working_path)
		working_path = library_namespace.get_script_base_path();
	else// if (reduce_path)
		working_path = reduce_path(working_path);

	if (!working_path)
		return;

	if (!base_path)
		base_path = (library_namespace.is_WWW() ? location.href
				: typeof WshShell === 'object' ? WshShell.CurrentDirectory
				: typeof WScript === 'object' ? WScript.ScriptFullName
				//	TODO: path_separator_candidates
				: '').replace(/[^\/\\]+$/, '');
	else// if (reduce_path)
		base_path = reduce_path(base_path);

	if (!base_path
			// base_path 需要是絕對路徑
			// || !is_absolute_path(base_path)
	)
		return working_path;

	library_namespace.debug(
			'phase 2: 將 path 分解成 Array，從尾至頭比對，以 base_path 為基準，找尋 working_path 是否有相同的目錄名。<br />base_path ['
			+ base_path
			+ ']<br />working_path ['
			+ working_path
			+ ']', 2, 'get_relative_path');

	var path_separator =
		//library_namespace.env.path_separator
		//	在 IE 或 HTA 中，path_separator === '\\' 但輸入的 path 為 '/'；甚至於 working_path, base_path 兩者可能不同。
		_.guess_path_separator(working_path);

	working_path = working_path.split(path_separator);
	if (!working_path[working_path.length - 1])
		//	防止輸入 a/b/c/ 而非 a/b/c 的情況。
		working_path.pop();
	base_path = base_path.split(_.guess_path_separator(base_path));
	//alert(working_path + '\n' + base_path);

	var file_name = base_path.pop();

	var index_base_path = base_path.length, index_working_path, working_path_length = working_path.length, directory, not_found = true;
	for (; index_base_path && not_found;)
		// 取得第 index_base_path 識別用目錄名
		if (directory = base_path[--index_base_path]) {
			for (index_working_path = working_path_length; index_working_path;)
				if (directory === working_path[--index_working_path]) {
					not_found = false;
					// 第一個找到就 break 了。
					// TODO: 找出最大連續相同路徑。
					break;
				}
		}

	library_namespace.debug('phase 3: ' + (not_found ? +'找不到' : '找到 index: base_path[' + index_base_path
					+ '], working_path[' + index_working_path + ']'), 2, 'get_relative_path');
	if (not_found)
		library_namespace.debug("Can't find base directory of this file!\n"
				+ working_path + '\n\nTreat base directory as:\n' + base_path, 2, 'get_relative_path'),
		directory = get_full_path ? working_path.concat(base_path) : base_path;
	else {
		if (get_full_path)
			directory = working_path.slice(0, index_working_path + 1);
		else {
			directory = [];
			for ( var i = index_working_path + 1; i < working_path_length; i++)
				directory.push('..');
		}

		//directory.append(base_path, index_base_path + 1);
		directory = directory.concat(base_path.slice(index_base_path + 1));
	}

	directory.push(file_name);
	return directory.join(path_separator);
};




_// JSDT:_module_
.
/**
 * cf: get_file_name(), parse_URL
 * @param {String} path	path name
 * @return
 * @_memberOf	_module_
 */
parse_path = function(path) {
	if (typeof path !== 'string' || !path)
		return;

	var path_data = {
		input_data : path
	}, m;

	if (m = path.match(/^(([A-Za-z]):\\)?(([^\\]+\\)*)([^\\]*)?$/)) {
		path_data.is_absolute = !!(path_data.drive = m[2]);
		path_data.path_name = m[3];
		path_data.file_name = m[5];
		library_namespace.debug('type: Windows/MS-DOS file path', 2);
	} else if (m = path.match(/^file:\/\/\/([A-Za-z]):\/(([^\/]+\/)*)([^\/]*)?$/)) {
		path_data.is_absolute = true;
		path_data.drive = m[1];
		path_data.path_name = m[2];
		path_data.file_name = m[4];
		library_namespace.debug('type: URL of Windows/MS-DOS local file path', 2);
	} else if (m = path.match(/^((\/)?([^\/]+\/)*)([^\/]*)?$/)) {
		path_data.is_absolute = !!m[2];
		path_data.path_name = m[1];
		path_data.file_name = m[4];
		library_namespace.debug('type: UNIX file path', 2);
	} else {
		library_namespace.debug('Failure to parse [' + path + ']');
	}

	//	正規化
	path_data.path_name = path_data.path_name.replace(/[\/\\]/g, library_namespace.env.path_separator);

	m = path_data.file_name.match(/^(.*?)(\.([^.]*))?$/);
	path_data.name = m[1];
	path_data.extension = m[3];

	path_data.path = path_data.path_name + path_data.file_name;
	path_data.location = path_data.drive + ':\\' + path_data.path;
	path_data.directory = path_data.drive + ':\\' + path_data.path_name;

	return path_data;
};


_// JSDT:_module_
.
/**
 * Test if local path is absolute or relative path, not very good solution.
 * TODO:
 * test FULL path.
 * @param {String} local path
 * @return
 * @requires	library_namespace.env.path_separator,library_namespace.env.path_separator_RegExp
 * @_memberOf	_module_
 */
is_absolute_path = function (path) {
	//alert(typeof path + '\n' + path);
	return /^(\/|[A-Z]+:([\\\/]|$)|\\\\[^\\])/i.test(path);
	/*
	return path
		&& (library_namespace.env.path_separator === '/' && path.charAt(0) === library_namespace.env.path_separator || new RegExp(
		'^(\\\\|[A-Za-z]+:)' + library_namespace.env.path_separator_RegExp).test(path))
		// ?true:false
		;
	*/
};


//	轉成path（加'\'）
function turnToPath(p){return p?p+(p.slice(-1)=='\\'?'':'\\'):'';}
//	僅取得path部分(包括 library_namespace.env.path_separator)，不包括檔名。
//getFilePath[generateCode.dLK]='library_namespace.env.path_separator';
function getFilePath(p){
 var i=p.lastIndexOf(library_namespace.env.path_separator);
 if(i==-1)p+=library_namespace.env.path_separator;	//	相對路徑?
 else if(i<p.length-1)p=p.slice(0,i+1);	//	取得path部分
 return p;
}

//get_file_path[generateCode.dLK]='reduce_path,is_absolute_path,getPathOnly,get_relative_path';
/**
 * 傳回包括檔名之絕對/相對路徑，假如是資料夾，也會回傳資料夾路徑。可包含'.','..'等 the return value include ? # of
 * URI<br />
 * 在Win/DOS下輸入'\'..會加上base driver。<br />
 * 若只要相對路徑，可用reduce_path()。取得如'..\out'的絕對路徑可用 get_file_path('../out',1)
 * 
 * @param {String}path
 *            路徑
 * @param {Number}[mode]
 *            0:傳回auto(維持原狀), 1:傳回絕對路徑, 2:傳回相對路徑。
 * @param {String}[base_path]
 *            base path
 * 
 * @returns
 */
function get_file_path(path, mode, base_path) {
	if (!path)
		return '';

	// old, deprecated:
	if (false)
		return (path.lastIndexOf('\\') == -1 && path.lastIndexOf('/') == -1 ?
		// get_file_object
		getFolder(getScriptFullName()) : '') + path;

	var matched;
	if (path.charAt(0) == '\\'
			&& (matched = get_relative_path(base_path).match(/^(\\\\|[A-Z]:)/i)))
		path = matched[1] + path;

	path = reduce_path(path);
	if (mode == 1) {
		// 當為相對路徑時前置 base path。
		if (!is_absolute_path(path))
			path = reduce_path((base_path ? getPathOnly(base_path)
					: get_relative_path())
					+ path);
	} else if (mode == 2 && is_absolute_path(path))
		path = get_relative_path(base_path, path, 1);

	return path;
}

_.get_file_path = get_file_path;

// get_file_name[generateCode.dLK]='get_file_path,library_namespace.env.path_separator';
/**
 * 傳回檔名部分，the return value include ? # of URI<br />
 * 
 * @param {String}path
 *            路徑
 * @param {String}[base_path]
 *            base path
 * @param {Number}[mode]
 *            0:檔名,1:(當輸入為不可信賴的字串時)去除檔名中不允許的字元，割掉? #等
 * 
 * @returns 檔名部分
 */
function get_file_name(path, base_path, mode) {
	path = get_file_path(path, 0, base_path);

	// 比起(mode=path.lastIndexOf(library_namespace.env.path_separator))==-1?path:path.substr(mode+1);此法比較直接，不過感覺多一道手續…
	path = path
	// 不能用.substr(path.lastIndexOf(library_namespace.env.path_separator))+library_namespace.env.path_separator,因為path.lastIndexOf(library_namespace.env.path_separator)可能==-1
	.slice(path.lastIndexOf(library_namespace.env.path_separator) + 1);

	if (mode) {
		if (path.match(/[#?]/))
			path = path.substr(0, RegExp.lastIndex - 1);
		// 處理 illegal file name. 去除檔名中不被允許的字元。cf. application.net.to_file_name()
		// [ \.]
		path = path.replace(/[\\\/:*?"<>|]/g, '_');
	}
	return path;
}

_.get_file_name = get_file_name;


//	傳回檔案/資料夾物件	FileSystemObjectのバグ(制限)で、環境によっては2G以上の領域を認識できません。WSH5.6ではこのバグが修正されています。
//get_file_object[generateCode.dLK]='isFile,parse_shortcut,get_file_path,library_namespace.env.path_separator,getFolder,initialization_WScript_Objects';
function get_file_object(p,m,bp){	//	path,mode=0:auto(維持原狀),1:絕對路徑,2:相對路徑,base path
 try{return isFile(p=parse_shortcut(get_file_path(p,m,bp),1))?fso.GetFile(p):fso.GetFolder(p);}
 catch(e){return p.indexOf(library_namespace.env.path_separator)==-1?get_file_object(getFolder(WScript.ScriptFullName)+p,m,bp):null;}
}
//alert(get_file_path('\program files\\xxx\\xxx.exe',2));



_// JSDT:_module_
.
/**
 * 取得 file 之 file name extension(副檔名).
 * 
 * @example <code>
 * // get 'htm'.
 * get_file_extension('test.htm');
 * </code>
 * @param {String}filename	檔案名稱
 * @returns {String} file name extension(副檔名)
 */
get_file_extension = function(filename) {
	var m = ('' + filename).match(/\.([^.]*)$/);
	return m ? m[1] : '';
};

_// JSDT:_module_
.
/**
 * 設定/更改 file 之 extension(副檔名).
 * 
 * @example <code>
 * // get 'test.html'.
 * set_file_extension('test.htm','html');
 * </code>
 * @param {String}filename	檔案名稱
 * @param {String}change_to
 *            更改成 change_to
 * @returns {String} 更改 extension 後之 filename.
 */
set_file_extension = function(filename, change_to) {
	if (change_to)
		filename = ('' + filename).replace(/\.[^.]*$/, '') + '.' + change_to;
	return filename;
};


// http://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid
// URL_encoded('http://authority.ddbc.edu.tw/time/search.php?chk=nextLevel&julianSwitch=off&dpk=新羅') === false;
function URL_encoded(URL) {
	return /^(?:https?|ftp):\/\/(?:[a-zA-Z0-9\-._~\/?#\[\]@!$&'()*+,;=]|%[a-fA-Z0-9]{2})+$/.test(URL);
}

var get_file = library_namespace.get_file,
//
write_file;

/**
 * 
 * @param {String}URL
 * @param {Object}options
 */
function cache_file(URL, options) {

	// 前置處理。
	if (!library_namespace.is_Object(options))
		options = library_namespace.null_Object();

	// 決定將 URL 存放至何處。
	var file_path = options.file_name || get_file_name;
	if (typeof file_path === 'function')
		file_path = file_path(URL);

	if (options.base_path)
		file_path = options.base_path + file_path;

	if (!URL_encoded(URL))
		URL = encodeURI(URL);

	var file_encoding = options.file_encoding || options.encoding || 'UTF-8', data;

	if (!options.force)
		try {
			data = get_file(file_path, file_encoding);
		} catch (e) {
			library_namespace.debug('嘗試讀取 cache file [' + file_path + '] 失敗。');
		}

	if (data === undefined) {
		library_namespace.debug('重新取得 [' + URL + ']');
		if ((data = get_file(URL, options.encoding))
		//
		&& (write_file || (write_file = library_namespace.write_file))) {
			// 插入網域識別標記之網頁註解 MOTW (Mark of the Web)。 e.g., about:internet
			// http://msdn.microsoft.com/en-us/library/ms537628(v=vs.85).aspx
			var MOTW = String(URL.length), line_separator = data.match(/\r?\n/);
			MOTW = '<!-- saved from url=(' + '0000'.slice(MOTW.length) + MOTW + ')' + URL + ' -->'
			//
			+ (line_separator ? line_separator[0] : library_namespace.env.line_separator);
			library_namespace.debug('write to [' + file_path + ']');
			write_file(file_path, MOTW + data, file_encoding);
		}
	}

	return data;
}

_.cache_file = cache_file;




return (
	_// JSDT:_module_
);
}


});

