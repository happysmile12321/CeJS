
/**
 * @name	CeL rational number function
 * @fileoverview
 * 本檔案包含了分數/有理數 (rational number) 的 functions，相當/類似於 BigRational, BigQuotient (numerator and denominator), BigDecimal。<br />
 * 在純 javascript 的環境下，藉由原生計算功能，盡可能提供高效的大數計算。<br />
 *
 * @example
 * <code>
 * CeL.run('data.math.rational');
 * </code>
 *
 * @since	
 */


/*
TODO:

規格書:

rational = new Rational(numerator, denominator, base);

rational = new Rational(10783, 2775);
rational = new Rational('10783/2775');
rational = new Rational('3+2458/2775');
rational = new Rational('3 2458/2775');
//https://en.wikipedia.org/wiki/Vinculum_(symbol)
rational = new Rational('3.88¯576');
//Brackets
rational = new Rational('3.88(576)');

numerator 10783
denominator 2775

integer part 整數部分 == quotient == continued fraction[0]
fractional part 分數/小數部分 == remainder / denominator

mixed fraction 帶分數 == integer part + fractional part
vulgar fraction 真分數/假分數 == 

decimal approximation (numerical value) 無限小數 3.88576576576576576576576576
//https://en.wikipedia.org/wiki/Overline#Math_and_science
repeating decimal 循環小數 3.88¯576

continued fraction 連分數 == [3; 1, 7, 1, 3, 15, 1, 1, 2]

Egyptian fraction expansion 古埃及分數

最簡分數(irreducible fraction)約分 reduce

*/



'use strict';
if (typeof CeL === 'function')
	CeL.run(
	{
		name: 'data.math.rational',
		require: 'data.code.compatibility.|data.native.|data.math.integer.',
		no_extend: 'random,compare',
		code: function (library_namespace) {

			//	requiring
			var Integer = library_namespace.data.math.integer;
			//eval(this.use());

			// ---------------------------------------------------------------------//
			// 定義基本常數。
			var
			// copy from data.math.integer.

			// 乘法單位元素
			// https://en.wikipedia.org/wiki/Identity_element
			// number * MULTIPLICATIVE_IDENTITY === number
			// 2/2, 3/3, ..
			MULTIPLICATIVE_IDENTITY = 1 / 1,
						//https://en.wikipedia.org/wiki/Exponentiation
			//(any number) ^ 0 === Math.pow(number, 0) === ZERO_EXPONENT
			//Math.pow(2, 0), Math.pow(3, 0), ..
			ZERO_EXPONENT = Math.pow(1, 0),

			//{Integer}
			KEY_NUMERATOR = 'numerator',
			//{Integer|Undefined}
			KEY_DENOMINATOR = 'denominator',
			//{Boolean|Undefined}
			KEY_IRREDUCIBLE = 'irreducible',

			// 應與 parseInt() 一致。
			DEFAULT_RADIX = parseInt('10'),

			//可辨認之數字字串。
			//	[ full , sign, integer part 整數部分, sign of fractional part 小數部分, numerator, denominator ]
			PATTERN_FRACTION = /([+\-]?)(?:(\d+)([ +\-]))?(\d+)\/(\d+)/,
			//	[ full , sign, integer part 整數部分, fractional part 小數部分, repeating decimal 循環小數1, repeating decimal 循環小數2 ]
			PATTERN_DECIMAL = /([+\-]?)(\d*)\.(\d*)(?:¯(\d+)|\((\d+)\))?/
			;

			// ---------------------------------------------------------------------//
			// 初始調整並規範基本常數。


			// ---------------------------------------------------------------------//
			// 工具函數

			function do_modified(rational, not_amount) {
				if (!not_amount)
					delete rational[KEY_IRREDUCIBLE];
			}


			// ---------------------------------------------------------------------//
			//	definition of module integer

			/**
			 * 任意大小、帶正負號的有理數。rational number instance.
			 *
			 * @example
			 * <code>
			 * </code>
			 *
			 * @class	Integer 的 constructor
			 * @constructor
			 */
			function Rational(number) {
				if (!(this instanceof Rational))
					return 1 === arguments.length && is_Rational(number) ? number : assignment.apply(new Rational, arguments);
				if (arguments.length > 0)
					assignment.apply(this, arguments);
			}

			//	instance public interface	-------------------

			// https://en.wikipedia.org/wiki/Operation_(mathematics)
			var OP_REFERENCE = {
				'+': add,
				'-': subtract,
				'*': multiply,
				'/': divide,
				'^': power,
				'=': assignment,
				'==': compare
			};

			library_namespace.extend(OP_REFERENCE, Integer.prototype);

			library_namespace.extend({
				reduce: reduce,
				// 下面全部皆為 assignment，例如 '+' 實為 '+='。
				assignment: assignment,

				// add_assignment
				add: add,
				// subtract_assignment
				subtract: subtract,
				// multiply_assignment
				multiply: multiply,
				// divide_assignment
				divide: divide,
				div: divide,

				power: power,
				pow: power,
				square_root: square_root,
				sqrt: square_root,
				square: square,
				// 至此為 assignment。

				clone: clone,

				//https://en.wikipedia.org/wiki/Absolute_value
				abs: function (negative) {
					this[KEY_NUMERATOR].abs(negative);
					return this;
				},
				//變換正負號。
				negate: function () {
					do_modified(this, true);
					this[KEY_NUMERATOR].negate();
					return this;
				},
				is_positive: function () {
					return this.compare(0) > 0;
				},
				is_negative: function () {
					return this[KEY_NUMERATOR].is_negative();
				},
				// https://en.wikipedia.org/wiki/Sign_(mathematics)
				// https://en.wikipedia.org/wiki/Sign_function
				sign: function (negative) {
					return this[KEY_NUMERATOR].sign(negative);
				},

				to_repeating_decimal: to_repeating_decimal,
				toPrecision: toPrecision,

				log: log,

				is_0: function () {
					return this[KEY_NUMERATOR].is_0();
				},
				//compare_amount: compare_amount,
				compare: compare,
				equals: function (number) {
					return this.compare(number) === 0;
				},

				op: operate,
				valueOf: valueOf,
				toString: toString
			}, Rational.prototype);

			//	class public interface	---------------------------
			function is_Rational(value) {
				return value instanceof Rational;
			}

			function Rational_compare(number1, number2) {
				if (typeof number1 === 'number' && typeof number2 === 'number')
					return number1 - number2;

				if (!is_Rational(number1))
					number1 = new Rational(number1);
				return number1.compare(number2);
			}

			//get the extreme value (極端值: max/min) of input values
			function extreme(values, get_minima) {
				var index = values.length, extreme_value, value, compare;
				if (!index)
					//ES6: Math.max: If no arguments are given, the result is −∞.
					return get_minima ? Infinity : -Infinity;

				extreme_value = values[--index];
				while (0 < index--) {
					//WARNING 注意: 當碰上許多大數時，會出現需要多次轉換 extreme_value 成 Integer 的效能低下情形!
					//但若許多數字不同底，而最大的是 String，則可能獲得部分效能。
					if (Number.isNaN(compare = Rational_compare(extreme_value, value = values[index])))
						//ES6: Math.max: If any value is NaN, the result is NaN.
						return NaN;

					if (get_minima ? compare > 0 : compare < 0)
						extreme_value = value;

					//依規範，必須掃描一次，確定沒 NaN。不可中途跳出。
					if (false && (get_minima ? compare > 0 : compare < 0)
						//當有改變時才偵測。
						&& typeof (extreme_value = value) === 'number' && !Number.isFinite(extreme_value = value))
						break;
				}
				return extreme_value;
			}

			//TODO: max
			function random(max) {
				return new Rational(Integer.random(), Integer.random());
			}

			function is_0(value, little_natural) {
				if (typeof value === 'string')
					value = new Rational(value);
				return value === (little_natural || 0) || (is_Rational(value) ? value[KEY_NUMERATOR] : Integer(value)).is_0(little_natural);
			}

			library_namespace.extend({
				random: random,
				max: function Rational_max() {
					// get max()
					return extreme(arguments);
				},
				min: function Rational_min() {
					// get min()
					return extreme(arguments, true);
				},
				compare: Rational_compare,
				// little_natural: little natural number, e.g., 1
				is_0: is_0,

				is_Rational: is_Rational
			}, Rational);


			// ---------------------------------------------------------------------//

			//因 clone 頗為常用，作特殊處置以增進效率。
			function clone() {
				var rational = new Rational;
				rational[KEY_NUMERATOR] = this[KEY_NUMERATOR].clone();
				if (KEY_DENOMINATOR in this)
					rational[KEY_DENOMINATOR] = this[KEY_DENOMINATOR].clone();
				if (KEY_IRREDUCIBLE in this)
					rational[KEY_IRREDUCIBLE] = this[KEY_IRREDUCIBLE];
				return rational;
			}

			//正規化(normalize)
			function normalize(rational) {
				if (KEY_DENOMINATOR in rational) {
					//確保不使用 exponent，使 exponent 為 0。
					var e_n = rational[KEY_NUMERATOR].get_exponent() - rational[KEY_DENOMINATOR].get_exponent(), e_d = 0;
					if (e_n < 0)
						e_d = -e_n, e_n = 0;
					rational[KEY_NUMERATOR].get_exponent(e_n);
					rational[KEY_DENOMINATOR].get_exponent(e_d);
					rational[KEY_DENOMINATOR].expand_exponent();

					//將正負符號擺在 [KEY_NUMERATOR]，確保 [KEY_DENOMINATOR] 不為負。
					if (rational[KEY_DENOMINATOR].is_negative())
						rational[KEY_NUMERATOR].negate(), rational[KEY_DENOMINATOR].negate();

					// [KEY_DENOMINATOR] 預設即為 MULTIPLICATIVE_IDENTITY。
					if (rational[KEY_DENOMINATOR].equals(MULTIPLICATIVE_IDENTITY))
						delete rational[KEY_DENOMINATOR];
				}
				if (rational[KEY_NUMERATOR].expand_exponent().is_0()
					//TODO: or Infinity
					|| rational[KEY_NUMERATOR].isNaN()
					)
					delete rational[KEY_DENOMINATOR];
			}

			function assignment(numerator, denominator, base) {
				var matched;
				if (is_Rational(numerator)) {
					//shift arguments
					base = denominator;
					denominator = numerator[KEY_DENOMINATOR];
					numerator = numerator[KEY_NUMERATOR];
				}

				if (denominator) {
					// rational = new Rational(10783, 2775);
					this[KEY_NUMERATOR] = new Integer(numerator, base);
					this[KEY_DENOMINATOR] = new Integer(denominator, base);
					normalize(this);

				} else if (typeof numerator === 'number') {
					this[KEY_NUMERATOR] = numerator = new Integer(numerator, base);
					if (numerator.get_exponent() < 0) {
						(this[KEY_DENOMINATOR] = new Integer(numerator.get_base(), numerator.get_base()))
							.power(-numerator.get_exponent());
						numerator.get_exponent(0);
					}
					normalize(this);

				} else if (typeof numerator === 'string' && (matched = numerator.match(PATTERN_FRACTION))) {
					//rational = new Rational('10783/2775');
					//rational = new Rational('3+2458/2775');
					//rational = new Rational('3 2458/2775');

					//	[ full , sign, integer part 整數部分, sign of fractional part 小數部分, numerator, denominator ]
					if (matched[3] === '-' && matched[1] !== '-')
						library_namespace.err('assignment: Invalid number sign!');

					this[KEY_DENOMINATOR] = denominator = new Integer(matched[5], base);
					numerator = new Integer(matched[4], base);
					if (matched[2])
						numerator = (new Integer(matched[2], base)).multiply(denominator).add(numerator);
					if (matched[1] === '-')
						numerator.negate();
					this[KEY_NUMERATOR] = numerator;

				} else if (typeof numerator === 'string' && (matched = numerator.match(PATTERN_DECIMAL))) {
					//https://en.wikipedia.org/wiki/Vinculum_(symbol)
					//rational = new Rational('3.88¯576');
					//Brackets
					//rational = new Rational('3.88(576)');

					//	[ full , sign, integer part 整數部分, fractional part 小數部分, repeating decimal 循環小數1, repeating decimal 循環小數2 ]
					// e.g., 1111.222¯33333 → 1111 + (22233333 - 222) / 99999000

					if (!base)
						base = DEFAULT_RADIX;

					//處理完小數部分之 numerator。
					if (matched[4] || (matched[4] = matched[5])) {
						//有循環節。
						numerator = new Integer(matched[3] + matched[4], base);
						if (matched[3])
							numerator.add(new Integer(matched[3], base), true);
						denominator = (base - 1).toString(base).repeat(matched[4].length);
					} else {
						//無循環節。
						numerator = new Integer(matched[3] || 0, base);
						denominator = MULTIPLICATIVE_IDENTITY;
					}

					if (matched[3])
						denominator += '0'.repeat(matched[3].length);
					if (denominator === MULTIPLICATIVE_IDENTITY)
						delete this[KEY_DENOMINATOR];
					else
						//assert: {String} denominator
						this[KEY_DENOMINATOR] = new Integer(denominator, base);

					if (matched[2])
						numerator.add(new Integer(matched[2], base).multiply(this[KEY_DENOMINATOR]));

					if (matched[1] === '-')
						numerator.negate();
					this[KEY_NUMERATOR] = numerator;

				} else {
					delete this[KEY_DENOMINATOR];
					this[KEY_NUMERATOR] = denominator = new Integer(numerator, base);
					if (denominator.isNaN())
						library_namespace.err('assignment: Invalid number: [' + numerator + '].');
					else
						normalize(this);
				}

				return this;
			}

			function reduce() {
				if ((KEY_DENOMINATOR in this) && !this[KEY_IRREDUCIBLE]) {
					var gcd = this[KEY_NUMERATOR].clone().Euclidean_algorithm(this[KEY_DENOMINATOR].clone())[1];
					this[KEY_NUMERATOR].divide(gcd);
					if (this[KEY_DENOMINATOR].equals(gcd))
						delete this[KEY_DENOMINATOR];
					else
						this[KEY_DENOMINATOR].divide(gcd);
					this[KEY_IRREDUCIBLE] = true;
				}

				return this;
			}

			/**
			 * 測試大小/比大小
			 * @param number	the number to compare
			 * @return	{Number}	0:==, <0:<, >0:>
			 * @_name	_module_.prototype.compare_to
			 */
			function compare(number) {
				if (typeof number === 'string')
					number = new Rational(number);
				if (is_Rational(number) && (KEY_DENOMINATOR in number.reduce()))
					return this.reduce()[KEY_NUMERATOR].clone().multiply(number[KEY_DENOMINATOR])
					//
					.compare(KEY_DENOMINATOR in this ? this[KEY_DENOMINATOR].clone().multiply(number[KEY_NUMERATOR]) : number[KEY_NUMERATOR]);

				else {
					if (is_Rational(number))
						number = number[KEY_NUMERATOR];
					return this.reduce()[KEY_NUMERATOR]
					//
					.compare(KEY_DENOMINATOR in this ? this[KEY_DENOMINATOR].clone().multiply(number) : number);
				}
			}


			// ---------------------------------------------------------------------//
			//四則運算，即加減乘除， + - * / (+-×÷)**[=]
			//https://en.wikipedia.org/wiki/Elementary_arithmetic

			//和
			function add(addend, is_subtract) {
				if (typeof addend === 'string')
					addend = new Rational(addend);

				if (!is_0(addend)) {
					//	assert: addend != 0.

					do_modified(this.reduce());

					addend = Rational(addend);

					if (is_Rational(addend) && !(KEY_DENOMINATOR in addend.reduce()))
						addend = addend[KEY_NUMERATOR];
					//assert: addend is non-Rational or reduced Rational with denominator.

					if (is_Rational(addend)
						//分母相同時，直接相加減分子。
					 ? (KEY_DENOMINATOR in this) && addend[KEY_DENOMINATOR].equals(this[KEY_DENOMINATOR])
						//分母相同(=1)時，直接相加減分子。
					 : !(KEY_DENOMINATOR in this))
						this[KEY_NUMERATOR].add(is_Rational(addend) ? addend[KEY_DENOMINATOR] : addend, is_subtract);
						//分母相同，毋須更動。

					else {
						// n1/d1 ± n2/d2 = (n1d2 ± n2d1)/d1d2
						//assert: d1 != d2
						var denominator_need_multiply;
						if (is_Rational(addend)) {
							//僅在 (KEY_DENOMINATOR in addend) 時，才須處理分母。
							if (KEY_DENOMINATOR in this)
								//為不干擾 this[KEY_NUMERATOR].add() 之操作，另作 cache。
								denominator_need_multiply = addend[KEY_DENOMINATOR];
							else
								//為不干擾 addend，另外創建。
								this[KEY_DENOMINATOR] = addend[KEY_DENOMINATOR].clone();
							this[KEY_NUMERATOR].multiply(addend[KEY_DENOMINATOR]);
							addend = addend[KEY_NUMERATOR];
						}
						this[KEY_NUMERATOR].add(KEY_DENOMINATOR in this ? this[KEY_DENOMINATOR].clone().multiply(addend) : addend, is_subtract);
						if (denominator_need_multiply)
							this[KEY_DENOMINATOR].multiply(denominator_need_multiply);
					}
				}

				return this;
			}

			//差
			function subtract(number) {
				return this.add(number, true);
			}

			function multiply(number) {
				if (typeof number === 'string')
					number = new Rational(number);

				if (!is_0(number, 1)) {
					do_modified(this.reduce());

					if (is_0(number)) {
						this[KEY_NUMERATOR].assignment(0);
						delete this[KEY_DENOMINATOR];

					} else {
						if (is_Rational(number) && !(KEY_DENOMINATOR in number.reduce()))
							number = number[KEY_NUMERATOR];
						//assert: number is non-Rational or reduced Rational with denominator.

						if (is_Rational(number)) {
							this[KEY_NUMERATOR].multiply(number[KEY_NUMERATOR]);
							if (KEY_DENOMINATOR in this)
								this[KEY_DENOMINATOR].multiply(number[KEY_DENOMINATOR]);
							else
								this[KEY_DENOMINATOR] = number[KEY_DENOMINATOR].clone();
						} else
							this[KEY_NUMERATOR].multiply(number);
					}
				}

				return this;
			}

			function divide(number) {
				if (typeof number === 'string')
					number = new Rational(number);

				if (!is_0(number, 1)) {
					do_modified(this.reduce());

					if (is_0(number)) {
						this[KEY_NUMERATOR].assignment(NaN);
						delete this[KEY_DENOMINATOR];

					} else {
						if (is_Rational(number)) {
							if (KEY_DENOMINATOR in number.reduce())
								this[KEY_NUMERATOR].multiply(number[KEY_DENOMINATOR]);
							number = number[KEY_NUMERATOR];
						}

						if (KEY_DENOMINATOR in this)
							this[KEY_DENOMINATOR].multiply(number);
						else
							this[KEY_DENOMINATOR] = number.clone();
					}
				}

				return this;
			}


			// ---------------------------------------------------------------------//

			function to_continued_fraction() {
				return KEY_DENOMINATOR in this
				//
				? this[KEY_NUMERATOR].clone().Euclidean_algorithm(this[KEY_DENOMINATOR].clone())[0]
				//
				: [this[KEY_NUMERATOR].clone()];
			}

			// precise divide, to repeating decimal
			// radix===1: get {Integer} object instead of {String}
			// return [ integer part, non-repeating fractional part, repeating decimal part ]
			// https://en.wikipedia.org/wiki/Repeating_decimal
			function to_repeating_decimal(radix) {
				return this[KEY_NUMERATOR].precise_divide(this[KEY_DENOMINATOR] || 1, radix);
			}

			//precision: 不包含小數點，共取 precision 位，precision > 0。
			function toPrecision(precision) {
				if (!(0 < precision))
					return this.toString();

				var d, c, is_negative = this[KEY_NUMERATOR].is_negative();
				d = this.to_repeating_decimal();

				if (d[0].length === precision + (is_negative ? 1 : 0))
					return d[0];

				if (is_negative)
					//減少負擔。
					d[0] = d[0].slice(1);
				if (d[0].length < precision) {
					//會用到小數部分。
					d[0] += '.' + d[1];
					//-2: '.', 判斷用之位數1位
					if (d[0].length - 2 < precision) {
						if (!d[2])
							d[2] = '0';
						d[0] += d[2].repeat(Math.ceil((precision - d[0].length + 2) / d[2].length));
					}
					//34.56  3
					d = (5 <= (d[0].charAt(precision + 1) | 0)
						? d[0].slice(0, precision) + ((d[0].charAt(precision) | 0) + 1)
						: d[0].slice(0, precision + 1));

				} else
					d = d[0].charAt(0) + '.'
						+ (5 <= (d[0].charAt(precision) | 0)
						? d[0].slice(1, --precision) + ((d[0].charAt(precision) | 0) + 1)
						: d[0].slice(1, precision))
						+ 'e+' + (d[0].length - 1);

				if (is_negative)
					d = '-' + d;

				return d;
			}

			// ---------------------------------------------------------------------//
			//advanced functions

			function square() {
				do_modified(this.reduce());

				this[KEY_NUMERATOR].square();

				if (KEY_DENOMINATOR in this)
					this[KEY_DENOMINATOR].square();

				return this;
			}

			function power(exponent) {
				do_modified(this.reduce());

				this[KEY_NUMERATOR].power(exponent);

				if (KEY_DENOMINATOR in this)
					this[KEY_DENOMINATOR].power(exponent);

				return this;
			}

			//WARNING 注意: this will get floor(sqrt(this))，結果僅會回傳整數！
			function square_root(precision) {
				do_modified(this.reduce());

				if (KEY_DENOMINATOR in this) {
					this[KEY_NUMERATOR].divide(this[KEY_DENOMINATOR], precision);
					delete this[KEY_DENOMINATOR];
				}

				this[KEY_NUMERATOR].square_root(precision);

				return this;
			}

			function log(base) {
				var value = this[KEY_NUMERATOR].log(base);

				if (KEY_DENOMINATOR in this)
					value -= this[KEY_DENOMINATOR].log(base);

				return value;
			}


			// ---------------------------------------------------------------------//

			/**
			 * front end of operation(運算)
			 * @param {String}operator	operator
			 * @param number	the second integer
			 * @return	計算後的結果
			 * @see
			 * https://en.wikipedia.org/wiki/Operation_(mathematics)
			 * <a href="http://www.javaworld.com.tw/jute/post/view?bid=35&amp;id=30169&amp;tpg=1&amp;ppg=1&amp;sty=1&amp;age=0#30169" accessdate="2010/4/16 20:47">JavaWorld@TW Java論壇 - post.view</a>
			 * @_name	_module_.prototype.op
			 */
			function operate(operator, number, flag) {
				var target;
				if (operator.slice(-1) === '=') {
					if (operator === '===')
						return this === number;
					if (operator !== '=' && operator !== '==')
						operator = operator.slice(0, -1);
					target = this;
				} else
					target = this.clone();

				if (operator in OP_REFERENCE)
					OP_REFERENCE[operator].call(target, number, flag);
				else
					library_namespace.err('operate: Invalid operator [' + operator + ']!');

				return target;
			}

			// ---------------------------------------------------------------------//

			//WARNING 注意: 若回傳非 Number.isSafeInteger()，則會有誤差，不能等於最佳近似值。
			function valueOf(type) {
				var n = this[KEY_NUMERATOR].valueOf(), d;
				if (KEY_DENOMINATOR in this)
					if (isFinite(n) || isFinite(d = this[KEY_DENOMINATOR].valueOf()))
						n /= d;
					else
						n = this[KEY_NUMERATOR].ratio_to(this[KEY_DENOMINATOR]);
				return n;
			}

			var TYPE_MIX = 1,
			TYPE_DECIMAL = 2;
			function toString(type) {
				if (!(KEY_DENOMINATOR in this))
					return this[KEY_NUMERATOR].toString();

				var string = this[KEY_NUMERATOR];
				if (type === TYPE_DECIMAL) {
					string = string.precise_divide(this[KEY_DENOMINATOR]);
					if (string[2])
						string[1] += '¯' + string[2];
					if (string[1])
						string[0] += '.' + string[1];
					return string[0];
				}

				return (type === TYPE_MIX ? (string = string.clone()).division(this[KEY_DENOMINATOR]).toString() + ' ' + string.abs().toString() : string.toString())
				//
				+ '/' + this[KEY_DENOMINATOR].toString();
			}


			// ---------------------------------------------------------------------//

			return Rational;
		}

	});
