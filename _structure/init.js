

//setTool(),oldVadapter();	//	當用此檔debug時請執行此行
//alert(ScriptEngine()+' '+ScriptEngineMajorVersion()+'.'+ScriptEngineMinorVersion()+'.'+ScriptEngineBuildVersion());



/*	initialization of function.js
	僅僅執行此檔時欲執行的程序。

TODO

setTool(),oldVadapter();	//	當用此檔debug時請執行此行

	利用.js加上此段與init()，以及.hta（<script type="text/javascript" src="~.js"></script>），可造出 GUI / none GUI 兩種可選擇之介面。
	if(typeof args==='object')init();else window.onload=init;
*/
//args=args.concat(['turnCode.js']);
var _library_onload;
if (_library_onload === undefined && typeof CeL === 'function'){
	_library_onload = function() {
		//WScript.Echo(CeL.env.ScriptName);
		//CeL.log(CeL.env.ScriptName);
		if (1 && CeL.env.ScriptName === 'ce') {
			//WScript.Echo(CeL.env.ScriptName);
			CeL.use('OS.Windows.registry');
			//CeL.log(CeL.registryF);

			var _p = CeL.registryF.getValue(CeL._iF.p) || '(null)';
			if (_p != CeL.env.library_base_path) {
				CeL.log('Change path of [' + CeL.env.ScriptName + '] from:\n' + _p
						+ '\n to\n' + CeL.env.library_base_path + '\n\n' + CeL._iF.p);
				CeL.registryF.setValue.cid = 1;
				CeL.registryF.setValue(CeL._iF.p, CeL.env.library_base_path, 0, 0, 1);
				CeL.registryF.setValue.cid = 0;
			}

			if (
					//	args instanceof Array
					typeof args === 'object') {
				//	getEnvironment();
				//	alert('Get arguments ['+args.length+']\n'+args.join('\n'));
				if (args.length) {
					var i = 0, p, enc, f, backupDir = dBasePath('kanashimi\\www\\cgi-bin\\program\\log\\');
					if (!fso.FolderExists(backupDir))
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							backupDir = dBasePath('kanashimi\\www\\cgi-bin\\game\\log\\');
						}
					if (!fso.FolderExists(backupDir))
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							if (2 == alert(
									'無法建立備份資料夾[' + backupDir + ']！\n接下來的操作將不會備份！',
									0, 0, 1 + 48))
								WScript.Quit();
							backupDir = '';
						}
					// addCode.report=true; // 是否加入報告
					for (; i < args.length; i++)
						if ((f = dealShortcut(args[i], 1))
								.match(/\.(js|vbs|hta|s?html?|txt|wsf|pac)$/i)
								&& isFile(f)) {
							p = alert(
									'是否以預設編碼['
											+ ((enc = autodetectEncode(f)) == simpleFileDformat ? '內定語系(' + simpleFileDformat + ')'
													: enc) + ']處理下面檔案？\n' + f,
									0, 0, 3 + 32);
							if (p == 2)
								break;
							else if (p == 6) {
								if (backupDir)
									fso.CopyFile(f, backupDir + getFN(f), true);
								addCode(f);
							}
						}
				} else if (1 == alert('We will generate a reduced ['
						+ CeL.env.ScriptName + ']\n  to [' + CeL.env.ScriptName
						+ '.reduced.js].\nBut it takes several time.', 0, 0,
						1 + 32))
					reduceScript(0, CeL.env.ScriptName + '.reduced.js');
			}//else window.onload=init;

			//CeL._iF=undefined;
		} //	if(1&&CeL.env.ScriptName==='function'){
	}; //	_library_onload
}



/*

//	test WinShell	http://msdn.microsoft.com/en-us/library/bb787810(VS.85).aspx
if (0) {
	alert(WinShell.Windows().Item(0).FullName);

	var i, cmd, t = '', objFolder = WinShell.NameSpace(0xa), objFolderItem = objFolder
			.Items().Item(), colVerbs = objFolderItem.Verbs(); // 假如出意外，objFolder==null
	for (i = 0; i < colVerbs.Count; i++) {
		t += colVerbs.Item(i) + '\n';
		if (('' + colVerbs.Item(i)).indexOf('&R') != -1)
			cmd = colVerbs.Item(i);
	}
	objFolderItem.InvokeVerb('' + cmd);
	alert('Commands:\n' + t);

	// objShell.NameSpace(FolderFrom).CopyHere(FolderTo,0); // copy folder
	// objFolderItem=objShell.NameSpace(FolderFrom).ParseName("clock.avi");objFolderItem.Items().Item().InvokeVerb([動作]);
	// objShell.NameSpace(FolderFromPath).Items.Item(mName).InvokeVerb();

	// Sets or gets the date and time that a file was last modified.
	// http://msdn.microsoft.com/en-us/library/bb787825(VS.85).aspx
	// objFolderItem.ModifyDate = "01/01/1900 6:05:00 PM";
	// objShell.NameSpace("C:\Temp").ParseName("Test.Txt").ModifyDate =
	// DateAdd("d", -1, Now()) CDate("19 October 2007")

	// Touch displays or sets the created, access, and modified times of one or
	// more files. http://www.stevemiller.net/apps/
}

//	測試可寫入的字元:0-128,最好用1-127，因為許多編輯器會將\0轉成' '，\128又不確定
if (0) {
	var t = '', f = 'try.js', i = 0;
	for (; i < 128; i++)
		t += String.fromCharCode(i);
	if (simpleWrite(f, t))
		alert('Write error!\n有此local無法相容的字元?');
	else if (simpleRead(f) != t)
		alert('內容不同!');
	else if (simpleWrite(f, dQuote(t) + ';'))
		alert('Write error 2!\n有此local無法相容的字元?');
	else if (eval(simpleRead(f)) != t)
		alert('eval內容不同!');
	else
		alert('OK!');
}
*/


if(_library_onload)
	_library_onload();
