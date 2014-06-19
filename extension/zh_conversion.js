/**
 * @name CeL function for 繁簡中文字詞彙轉換。
 * 
 * TODO:<br />
 * words conversion
 * 
 * @fileoverview 本檔案包含了繁體/簡體中文轉換的 functions。
 * @example <code>
 * CeL.run('extension.zh_conversion',function () {
 *  // 可設定 errata 勘誤表。
 *  //CeL.CN_to_TW.errata = {};
 *  var text = CeL.CN_to_TW('简体中文文字');
 * 	CeL.CN_to_TW.file('from.htm', 'to.htm', 'utf-8');
 * });
 * </code>
 * @see
 * @since 2014/6/17 22:39:16
 */

'use strict';
if (typeof CeL === 'function')
	CeL.run({
		name : 'extension.zh_conversion',
		require : 'data.pair|application.OS.Windows.file.',
		code : function(library_namespace) {
			// requiring
			var pair;
			eval(this.use());

			/**
			 * null module constructor
			 * 
			 * @class 中文繁簡轉換的 functions
			 */
			var _// JSDT:_module_
			= function() {
				// null module constructor
			};

			/**
			 * for JSDT: 有 prototype 才會將之當作 Class
			 */
			_// JSDT:_module_
			.prototype = {};

			var CN_to_TW_conversions,
			// using BYVoid / OpenCC 開放中文轉換 (Open Chinese Convert)
			// https://github.com/BYVoid/OpenCC/tree/master/data/dictionary
			dictionary_base = library_namespace.get_module_path(this.id,
					'OpenCC/');

			function CN_to_TW(text, options) {
				if (!CN_to_TW_conversions) {
					// initialization.
					CN_to_TW_conversions = (
					// 因 STPhrases 太多，若是使用 new RegExp(keys.join('|'), 'g') 的方法，
					// 可能出現 "記憶體不足" 之問題。
					'STPhrases,STCharacters,TWPhrasesName,TWPhrasesIT'
					// 因此得要一個個 replace。
					+ ',TWPhrasesOther,TWVariants,TWVariantsRevPhrases')
							.split(',');

					CN_to_TW_conversions.forEach(function(file_name, index) {
						var path = dictionary_base + file_name + '.txt',
						//
						source = library_namespace.get_file(path);
						if (source)
							CN_to_TW_conversions[index]
							// 載入 resource。
							= new pair(source, {
								item_processor : function(item) {
									return item.replace(/ .+$/, '');
								}
							});
						else
							library_namespace.err(
							//
							'CN_to_TW: Can not get contents of [' + file_name
									+ '] (' + path + ')!');
					});

					// 手動修正表。
					CN_to_TW_conversions.push(new pair(library_namespace
							.get_file(dictionary_base.replace(/[^\/]+\/$/,
									'corrections.txt'))));

					if (CN_to_TW.errata) {
						CN_to_TW_conversions.push(new pair(CN_to_TW.errata, {
							flag : CN_to_TW.flag || 'gi'
						}));
					}
				}

				CN_to_TW_conversions.forEach(function(conversion) {
					text = conversion.convert(text);
				});

				if (options && options.errata)
					text = (new pair(options.errata, {
						flag : options.flag || 'gi'
					})).convert(text);

				return text;
			}

			CN_to_TW.file = function(from, to, target_encoding) {
				var text = library_namespace.get_file(from);
				text = CN_to_TW(text);
				library_namespace.write_file(to, text, target_encoding);
			};

			// 勘誤表。
			// 可以 Object.assign(CeL.CN_to_TW.errata = {}, {}) 來新增 errata。
			// CN_to_TW.errata = {};

			_.CN_to_TW = CN_to_TW;

			return (_// JSDT:_module_
			);
		}

	});
