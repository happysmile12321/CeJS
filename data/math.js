
/**
 * @name	CeL function for math
 * @fileoverview
 * 本檔案包含了數學演算相關的 functions。
 * @since	
 */

/*
TODO:
大數計算
方程式圖形顯示 by SVG
*/



if (typeof CeL === 'function')
CeL.setup_module('data.math',
{
require : '',
code : function(library_namespace, load_arguments) {
'use strict';

	
//	requiring
//var ;
eval(library_namespace.use_function(this));



/**
 * null module constructor
 * @class	數學相關的 functions
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
	Math	---------------------------------------------------------------
*/

/*
//{var v=Math.LN2,d=mutual_division(v),q=to_rational_number(v);alert('值	'+v+'\n序列	'+d+'\n近似值	'+q[0]+' / '+q[1]+'\n約	'+(q=q[0]/q[1])+'\n值-近似	'+(q-=v)+'\n差'+(Math.abs(q=10000*q/v)>1?'萬分之'+q.to_fixed(2)+' ( '+q+' / 10000 )':'億分之'+(q*=10000).to_fixed(2)+' ( '+q+' / 100000000 )'),0,'近似值	'+v);}

//{var d=new Date,a=.142857,b=1000000,i=0,c;for(i=0;i<10000;i++)c=mutual_division(a);alert(c+'\n'+gDate(new Date-d));}
*/

_// JSDT:_module_
.
/**
 * 輾轉相除 n1/n2 或 小數 n1/1 轉成 整數/整數
 * @param {Number} n1	number 1
 * @param {Number} [n2]	number 2
 * @param {Number} times	max 次數, 1,2,..
 * @return	{Array}	連分數序列 ** 負數視 _.mutual_division.done 而定!
 */
mutual_division = function mutual_division(n1, n2, times) {
	var q = [], c;
	if (isNaN(times) || times <= 0)
		times = 80;
	if (!n2 || isNaN(n2))
		n2 = 1;

	if (n1 != Math.floor(n1)) {
		c = n1;
		var i = 9, f = n2;
		while (i--)
			//	以整數運算比較快！這樣會造成整數多4%，浮點數多1/3倍的時間，但仍值得。
			if (f *= 10, c *= 10, c === Math.floor(c)) {
				n1 = c, n2 = f;
				break;
			}
	}

	//	連分數負數之處理。更沒問題的: (n1 < 0?1:0) ^ (n2 < 0?1:0)
	if (_.mutual_division.mode && ((n1 < 0) ^ (n2 < 0))) {
		// 使兩數皆為正
		if (n2 < 0)
			n2 = -n2;
		else
			n1 = -n1;

		q.push(-(1 + (n1 - (c = n1 % n2)) / n2));
		n1 = n2, n2 -= c;
	}

	/* old:
	 while(b&&n--)
	  d.push((a-(c=a%b))/b),a=b,b=c;	//	2.08s@10000	可能因為少設定（=）一次c所以較快。但（若輸入不為整數）不確保d為整數？用Math.floor((a-(c=a%b))/b)可確保，速度與下式一樣快。
	  //d.push(c=Math.floor(a/b)),c=a-b*c,a=b,b=c;	//	2.14s@10000:mutual_division(.142857)
	  //d.push(Math.floor(a/b)),b=a%(c=b),a=c;	//	2.2s@10000
	 //if(n)d.push(0);
	*/

	//	2.4s@10000	可能因為少設定（=）一次c所以較快。但（若輸入不為整數）不確保d為整數？用Math.floor((a-(c=a%b))/b)可確保，速度與下式一樣快。
	while (times--)
		if (n2)
			q.push((n1 - (c = n1 % n2)) / n2), n1 = n2, n2 = c;
		else {
			//	[ .. , done mark, (最後非零的餘數。若原 n1, n2 皆為整數，則此值為 GCD。但請注意:這邊是已經經過前面為了以整數運算，增加倍率過的數值!!) ]
			q.push(_.mutual_division.done, n1);
			//library_namespace.debug('done: ' + q);
			break;
		}

	//	2.26s@10000
	//while(b&&n--)if(d.push((a-(c=a%b))/b),a=b,!(b=c)){d.push(0);break;}

	//var m=1;c=1;while(m&&n--)d.push(m=++c%2?b?(a-(a%=b))/b:0:a?(b-(b%=a))/a:0);//bug

	return q;
};
_// JSDT:_module_
.
mutual_division.done = -7;//''

_// JSDT:_module_
.
/**
 * !!mode:連分數處理，對負數僅有最初一數為負。
 */
mutual_division.mode = 0;

_// JSDT:_module_
.
/**
 * 取得連分數序列的數值
 * @param {Array} sequence	序列
 * @param {Number} [max_no]	取至第 max_no 個
 * @requires	mutual_division.done
 * @return
 * @see
 * var a=continued_fraction([1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
 * alert(a+'\n'+a[0]/a[1]+'\n'+Math.SQRT2+'\n'+(Math.SQRT2-a[0]/a[1])+'\n'+mutual_division(a[0],a[1]));
 */
continued_fraction = function(sequence, max_no) {
	if (!library_namespace.is_Array(sequence) || !sequence.length)
		return sequence;

	if (sequence[sequence.length - 2] === _.mutual_division.done)
		sequence.length -= 2;

	if (sequence.length < 1)
		return sequence;

	if (!max_no/* ||max_no<2 */|| max_no > sequence.length)
		max_no = sequence.length;

	var a, b;
	if (max_no % 2)
		b = 1, a = 0;
	else
		a = 1, b = 0;
	//sequence[max_no++]=1;if(--max_no%2)b=sequence[max_no],a=s[--max_no];else a=sequence[max_no],b=sequence[--max_no];

	//library_namespace.debug('a=' + a + ', b=' + b + ', max_no=' + max_no);
	while (max_no--)
		if (max_no % 2)
			b += a * sequence[max_no];
		else
			a += b * sequence[max_no];
	//library_namespace.debug('a=' + a + ', b=' + b);
	return [ a, b ];
};


_// JSDT:_module_
.
/**
 * The best rational approximation. 取得值最接近之有理數 (use 連分數 continued fraction), 取近似值.
 * c.f., 調日法
 * 在分子或分母小於下一個漸進分數的分數中，其值是最接近精確值的近似值。
 * @example
 * to_rational_number(4088/783)
 * @param {Number} number	number
 * @param {Number} [rate]	比例在 rate 以上
 * @param {Number} [max_no]	最多取至序列第 max_no 個
 * 					TODO : 並小於 l: limit
 * @return	[分子, 分母, 誤差]
 * @requires	mutual_division,continued_fraction
 * @see
 * http://en.wikipedia.org/wiki/Continued_fraction#Best_to_rational_numbers
 */
to_rational_number = function(number, rate, max_no) {
	if (!rate)
		//	This is a magic number: 我們無法準確得知其界限為何。
		rate = 65536;
	var d = _.mutual_division(number, 1, max_no && max_no > 0 ? max_no : 20),
	i = 0, a, b = d[0], done = _.mutual_division.done;

	if (!b)
		b = d[++i];
	while (++i < d.length && (a = d[i]) !== done)
		if (a / b < rate)
			b = a;
		else
			break;

	if(0)
		library_namespace.debug(
			number + ' ' +
			//	連分數表示
			(d.length > 1 && d[d.length - 2] === _.mutual_division.done ?
				'=' + ' [<em>' + d[0] + ';' + d.slice(1, i).join(', ') + '</em>'
					+ (i < d.length - 2 ? ', ' + d.slice(i, -2).join(', ') : '')
					+ '] .. ' + d.slice(-1) :
				//	約等於的符號是≈或≒，不等於的符號是≠。
				//	http://zh.wikipedia.org/wiki/%E7%AD%89%E4%BA%8E
				'≈' + ' [<em>' + d[0] + ';' + d.slice(1, i).join(', ') + '</em>'
					+ (i < d.length ? ', ' + d.slice(i).join(', ') : '') + ']: '
					+ d.length + ',' + i + ',' + d[i]
			)
		);
	d = _.continued_fraction(d, i);
	//library_namespace.debug('→ ' + d[0] + '/' + d[1]);
	if (d[1] < 0)
		d[0] = -d[0], d[1] = -d[1];

	return [ d[0], d[1], d[0] / d[1] - number ];
};


_// JSDT:_module_
.
/**
 * 求多個數之 GCD(Greatest Common Divisor, 最大公因數/公約數). Using Euclidean
 * algorithm(輾轉相除法).<br />
 * 
 * TODO: 判斷互質.
 * 
 * @example <code>
 * // type 1: input number sequence
 * CeL.GCD(6,9);
 * // type 2: input Array
 * CeL.GCD([5,3,8,2,6,9]);
 * </code>
 * @param {Integers} number_array
 *            number array
 * @returns {Integer} GCD of the numbers specified
 */
GCD = function(number_array) {
	if (arguments.length > 1)
		number_array = Array.prototype.slice.call(arguments);

	var i = 0, l = number_array.length, gcd = 0, r, n;
	for (; i < l && gcd !== 1; i++) {
		if (n = Math.abs(parseInt(number_array[i]))) {
			if (gcd) {
				// Euclidean algorithm 輾轉相除法
				while (r = n % gcd){
					n = gcd;
					//	使用絕對值最小的餘數
					gcd = Math.min(r, gcd - r);
				}
			} else {
				gcd = n;
			}
		}
	}
	return gcd;
};


_// JSDT:_module_
.
/**
 * 求多個數之 LCM(Least Common Multiple, 最小公倍數): method 1. Using 類輾轉相除法.<br />
 * 
 * TODO: 更快的方法： 短除法? 一次算出 GCD, LCM?
 * 
 * @example <code>
 * // type 1: input number sequence
 * CeL.LCM(6,9);
 * // type 2: input Array
 * CeL.LCM([5,3,8,2,6,9]);
 * </code>
 * @param {Integers} number_array
 *            number array
 * @returns {Integer} LCM of the numbers specified
 */
LCM = function(number_array) {
	if (arguments.length > 1)
		number_array = Array.prototype.slice.call(arguments);

	var i = 0, l = number_array.length, lcm, r = [], n, n0, lcm0;
	// 正規化數字
	for (; i < l; i++) {
		if (n = Math.abs(parseInt(number_array[i])))
			r.push(n);
		// 允許 0:
		// else if (n === 0) return 0;
	}
	// r.sort().reverse();
	for (number_array = r, l = number_array.length, lcm = number_array[0], i = 1; i < l; i++) {
		n = n0 = number_array[i];
		lcm0 = lcm;
		// 倒反版的 Euclidean algorithm 輾轉相除法.
		while (lcm !== n) {
			if (lcm > n) {
				if (r = -lcm % n0) {
					n = lcm + n0 + r;
				} else {
					//	n0 整除 lcm: 取 lcm 即可.
					break;
				}
			} else {
				if (r = -n % lcm0) {
					lcm = n + lcm0 + r;
				} else {
					//	lcm0 整除 n: 取 n 即可.
					lcm = n;
					break;
				}
			}
		}
	}
	return lcm;
};

_// JSDT:_module_
.
/**
 * 求多個數之 LCM(Least Common Multiple, 最小公倍數): method 2. Using 類輾轉相除法.<br />
 * 
 * @example <code>
 * // type 1: input number sequence
 * CeL.LCM2(6,9);
 * // type 2: input Array
 * CeL.LCM2([5,3,8,2,6,9]);
 * </code>
 * @param {Integers} number_array
 *            number array
 * @returns {Integer} LCM of the numbers specified
 */
LCM2 = function(number_array) {
	if (arguments.length > 1)
		number_array = Array.prototype.slice.call(arguments);

	var i = 0, l = number_array.length, lcm = 1, r, n, num, gcd;
	for (; i < l && lcm; i++) {
		// 每個數字都要做運算，雖可確保正確，但沒有效率!
		if (!isNaN(num = n = Math.abs(parseInt(number_array[i])))) {
			gcd = lcm;
			// Euclidean algorithm.
			while (r = n % gcd)
				n = gcd, gcd = r;
			lcm = num / gcd * lcm;
		}
	}
	return lcm;
};


/*
http://www.math.umbc.edu/~campbell/NumbThy/Class/Programming/JavaScript.html
http://aoki2.si.gunma-u.ac.jp/JavaScript/
*/

_// JSDT:_module_
.
/**
 * 得到平方數，相當於 Math.floor(Math.sqrt(number)).
 * get integer square root
 * @param {Number} positive number
 * @return	r, r^2 <= number < (r+1)^2
 * @example
 * var p = 20374345, q = CeL.math.floor_sqrt(p = p * p - 1); CeL.log(q + '<br />' + (q * q) + '<br />' + p + '<br />' + (++q * q));
 * @see
 * <a href="http://www.azillionmonkeys.com/qed/sqroot.html" accessdate="2010/3/11 18:37">Paul Hsieh's Square Root page</a>
 * <a href="http://www.embeddedrelated.com/usenet/embedded/show/114789-1.php" accessdate="2010/3/11 18:34">Suitable Integer Square Root Algorithm for 32-64-Bit Integers on Inexpensive Microcontroller? | Comp.Arch.Embedded | EmbeddedRelated.com</a>
 */
floor_sqrt = function(number){
	if (isNaN(number = Math.floor(number)))
		return;
	var g = 0, v, h, t;
	while ((t = g << 1) < (v = number - g * g)) {
		//library_namespace.debug(t + ', ' + v);
		h = 1;
		while (h * (h + t) <= v)
			// 因為型別轉關係，還是保留 << 而不用 *2
			h <<= 1;//h *= 2;
		g += h >> 1;//h / 2;//
	}
	//library_namespace.debug('end: ' + t + ', ' + v);
	return g;
};


_// JSDT:_module_
.
/**
 * 取得某數的質因數分解，因式分解/素因子分解, factorization, get floor factor.
 * 唯一分解定理(The Unique Factorization Theorem)告訴我們素因子分解是唯一的，這即是稱為算術基本定理 (The Fundamental Theorem of Arithmeric) 的數學金科玉律。
 * @param {Number} number
 * @return	{Array} [prime1,power1,prime2,power2,..]
 * @see
 * <a href="http://homepage2.nifty.com/m_kamada/math/10001.htm" accessdate="2010/3/11 18:7">Factorizations of 100...001</a>
 * @requires	floor_sqrt
 */
factorization = function(number) {
	var f = 2, p, a, l, r = [];
	if (isNaN(number) || number < 1 || number >
			/*
			 * javascript 可以表示的最大整數值
			 * 10^21-2^16-1 = 999999999999999934463
			 * @see
			 * http://www.highdots.com/forums/javascript/how-js-numbers-represented-internally-166538-4.html
			 */
			999999999999999934469)
		return;
	number = Math.floor(number);

	// 2,3
	while (number > 1) {
		if (number % f === 0) {
			p = 0;
			do
				number /= f, p++;
			while (number % f === 0); // do{n/=f,p++;}while(n%f==0);
			r.push(f, p);
		}
		if (++f > 3)
			break;
	}

	a = 4, f = 5, l = _.floor_sqrt(number); // 5-初始化
	while (number > 1) {
		if (f > l) {
			r.push(number, 1);
			break;
		}
		// document.write('<br />'+f+','+n);
		if (number % f === 0) {
			p = 0;
			do {
				number /= f, p++;
			} while (number % f === 0);
			l = _.floor_sqrt(number), r.push(f, p);
		}
		f += a = a === 2 ? 4 : 2;
	}
	return r;
};

/*	test
function count(n){
var a=factorization(n),s='',v=1;
if(a){
 for(var i=0;i<a.length;i+=2){s+='*'+a[i]+(a[i+1]>1?'^'+a[i+1]:'');v*=Math.pow(a[i],a[i+1]);}
 s=s.substr(1)+'='+v+'='+n;
}else s='error! '+n;
document.getElementById('result').value+=s+'\n-------------------------------------------\n';
}
*/



_// JSDT:_module_
.
/**
 * 猜測一個數可能的次方數。
 * 
 * @example <code>
 * var t = guess_exponent(Math.pow(2 / 3, 1 / 1));
 * alert(t[0] + '/' + t[1] + '^' + t[2] + '/' + t[3]);
 * </code>
 * 
 * @param {Number} number 數字
 * @param {Boolean} type
 *            false: base 為整數, true: base 為有理數
 * @returns [{Integer} base 分子, {Integer} base 分母, {Integer} exponent 分子, {Integer} exponent 分母]
 * @since 2005/2/18 19:20 未完成
 */
guess_exponent = function(number, type) {
	var bn, bd, en = 1, ed, sq = [ 1, number ], t, q,
	// error: 容許誤差
	error = 1e-9, g = function(n) {
		q = _.to_rational_number(n, 99999);
		if ((!type || q[1] === 1) && !(q[0] > 99999 && q[1] > 99999)
				&& q[2] / n < error)
			bn = q[0], bd = q[1], ed = t;
	};

	if (!ed)
		g(sq[t = 1]);
	if (!ed)
		g(sq[t = 2] = sq[1] * sq[1]);
	if (!ed)
		g(sq[t = 3] = sq[1] * sq[2]);
	if (!ed)
		g(sq[t = 4] = sq[2] * sq[2]);
	if (!ed)
		g(sq[t = 5] = sq[2] * sq[3]);
	if (!ed)
		bn = number, bd = ed = 1;

	return [ bn, bd, en, ed ];
};




/*
for 出題目

runCode.setR=0;
for(var i=0,j,t,s,n_e;i<10;){
 t=2000+8000*Math.random();
 s=get_random_prime.get_different_number_set(3,t,t/8);
 if(s.LCM>9999)continue;
 n_e=[];
 n_e[s.GCD]=1;
 for(j=0;j<s.length;j++)
  if(n_e[s[j]])continue;
  else n_e[s[j]]=1;
 sl([s.GCD,s.LCM]+'<b style="color:#c4a">;</b> '+s);i++;
}

*/

/**
 * get random prime(s)
 * 
 * @param {Integer} count
 *            個數
 * @param {Boolean} exclude
 *            排除
 * @param all_different
 * @returns random prime / random prime array
 * @since 2009/10/21 11:57:47
 */
function get_random_prime(count, exclude, all_different) {
	var _f = get_random_prime, i, j, p = [], l;
	if (!count || count < 1)
		count = 1;
	if (!_f.excluded)
		_f.excluded = [];
	if (exclude)
		exclude = [];

	for (j = 0; j < count; j++) {
		// timeout
		l = 80;
		do {
			i = Math.round(10 * Math.tan(Math.random() * 1.5));
			if (!--l)
				// timeout
				return;
		} while (_f.excluded[i]);
		p.push(_f.primes[i]);
		if (exclude)
			exclude.push(i);
	}

	// 選完才排除本次選的
	if (exclude)
		for (j = 0, l = exclude.length; j < l; j++) {
			i = exclude[j];
			if (_f.excluded[i])
				_f.excluded[i]++;
			else
				_f.excluded[i] = 1;
		}

	return count === 1 ? p[0] : p;
}

get_random_prime.primes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
	    47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
	    127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193,
	    197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271,
	    277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359,
	    367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443,
	    449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541,
	    547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619,
	    631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719,
	    727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821,
	    823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
	    919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997 ];

//	return [GCD, n1, n2, ..]
get_random_prime.get_different_number_set = function(count, till, GCD_till) {
	delete this.excluded;
	if (!GCD_till)
		GCD_till = 1e5;
	if (!till)
		till = 1e5;

	/**
	 * 求乘積, 乘到比till小就回傳.
	 * @param nums	num array
	 * @param till
	 * @returns {Number}
	 */
	function get_product(nums, till) {
		var p = 1, i = 0, l = nums.length;
		for (; i < l; i++) {
			if (till && p * nums[i] > till)
				break;
			p *= nums[i];
		}
		return p;
	}

	var GCD = get_product(this(20, 1), GCD_till), na = [], n_e = [], n, i = 0, out;
	n_e[GCD] = 1;

	for (; i < count; i++) {
		out = 80; // timeout
		do {
			n = this(20);
			n.unshift(GCD);
			n = get_product(n, till);
		} while (n_e[n] && --out);
		n_e[n] = 1;
		na.push(n);
	}

	if (typeof lcm == 'function')
		na.LCM = lcm(na);
	na.GCD = GCD;
	return na;
};



_// JSDT:_module_
.
/**
 * VBScript has a Hex() function but JScript does not.
 * @param {Number} number
 * @return	{String} number in hex
 * @example
 * alert('0x'+CeL.hex(16725))
 */
hex = function(number) {
	return ((number = Number(number)) < 0 ? number + 0x100000000 : number).toString(16);
};

_// JSDT:_module_
.
/**
 * 補數計算。
 * 正數的補數即為自身。若要求得互補之後的數字，請設成負數。
 * @param {Number} number
 * @return	{Number} base	1: 1's Complement, 2: 2's Complement, (TODO: 3, 4, ..)
 * @example
 * alert(complement())
 * @see
 * http://www.tomzap.com/notes/DigitalSystemsEngEE316/1sAnd2sComplement.pdf
 * http://en.wikipedia.org/wiki/Method_of_complements
 * http://en.wikipedia.org/wiki/Signed_number_representations
 * @since	2010/3/12 23:47:52
 */
complement = function() {
	return this.from.apply(this, arguments);
};

_// JSDT:_module_
.
complement.prototype = {

base : 2,

//	1,2,..
bits : 8,

//	radix complement or diminished radix complement.
//	http://en.wikipedia.org/wiki/Method_of_complements
diminished : 0,

/**
 * 正負符號.
 * 正: 0/false,
 * 負 negative value:!=0 / true
 */
sign : 0,

//	get the value
valueOf : function() {
	return this.sign ? -this.value : this.value;
},

/**
 * set value
 */
set : function(value) {
	var m = Number(value), a = Math.abs(m);
	if (isNaN(m) || m && a < 1e-8 || a > 1e12){
		library_namespace.debug('complement.set: error number: ' + value);
		return;
	}

	this.sign = m < 0;
	// this.value 僅有正值
	this.value = a;

	return this;
},


/**
 * input
 */
from : function(number, base, diminished) {
	//	正規化
	number = ('' + (number||0)).replace(/\s+$|^[\s0]+/g, '') || '0';
	//library_namespace.debug(number + ':' + number.length + ',' + this.bits);

	//	整數部分位數
	var value = number.indexOf('.'), tmp;
	if (value == -1)
		value = number.length;
	//	TODO: not good
	if (value > this.bits)
		//throw 'overflow';
		library_namespace.err('complement.from: overflow: ' + value);

	if (typeof diminished === 'undefined')
		//	illegal setup
		diminished = this.diminished;
	else
		this.diminished = diminished;

	if ((base = Math.floor(base)) && base > 0){
		if (base === 1)
			base = 2, this.diminished = 1;
		this.base = base;
	}else
		//	illegal base
		base = this.base;
	//library_namespace.debug(base + "'s Complement");

	//	TODO: 僅對 integer 有效
	value = parseInt(number, base);
	tmp = Math.pow(base, this.bits - 1);
	if (value >= tmp * base)
		//throw 'overflow';
		library_namespace.err('complement.from: overflow: ' + value);

	//library_namespace.debug('compare ' + value + ',' + tmp);
	if (value < tmp)
		this.sign = 0;
	else
		//library_namespace.debug('負數 ' + (tmp * base - (diminished ? 1 : 0)) + '-'+ value+'='+(tmp * base - (diminished ? 1 : 0) - value)),
		this.sign = 1,
		value = tmp * base - (diminished ? 1 : 0) - value;

	this.value = value;
	//library_namespace.debug(number + ' → '+this.valueOf());

	return this;
},

/**
 * output
 */
to : function(base, diminished) {
	if (!(base = Math.floor(base)) || base < 1)
		base = this.base;
	else if (base === 1)
		base = 2, diminished = 1;
	if (typeof diminished === 'undefined')
		diminished = this.diminished;

	var value = this.value, tmp = Math.pow(base, this.bits - 1);
	if (value > tmp || value === tmp && (diminished || !this.sign))
		//throw 'overflow';
		library_namespace.err('complement.to: overflow: ' + (this.sign ? '-' : '+') + value);

	if (this.sign){
		tmp *= base;
		if (diminished)
			//	TODO: 僅對 integer 有效
			tmp--;
		//library_namespace.debug('負數 ' + value + '，sum=' + tmp);
		// 負數，添上兩補數之和
		value = tmp - value;
	}

	//library_namespace.debug('value: ' + (this.sign ? '-' : '+') + value);

	value = value.toString(Math.max(2, this.base));

	return value;
}

};

_// JSDT:_module_
.
complement.prototype.toString = _.complement.prototype.to;


/*
	↑Math	---------------------------------------------------------------
*/




return (
	_// JSDT:_module_
);
}


});

