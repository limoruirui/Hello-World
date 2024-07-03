//芒果tv登录密码解密 入口get_pwd(pwd) 参数为明文密码
var Nt, Dt, zt, Ut = 16, Ft = 2 << 15, Vt = Ft - 1;
var ce = new Array(0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535);
var ue = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535);
var Wt = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
var Zt = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

function Rt(t) {
    return qt(131),
        t = function () {
            var t = String(Date.parse(new Date)).substring(0, 10)
                , e = String(Math.random())
                , n = String(e + t + t + e).substring(0, 32);
            return t + n
        }() + t,
        function (t, e) {
            for (var n = new Array, i = e.length, r = 0; r < i;)
                n[r] = e.charCodeAt(r),
                    r++;
            for (; n.length % t.chunkSize != 0;)
                n[r++] = 0;
            var o, a, s, c = n.length, l = "";
            for (r = 0; r < c; r += t.chunkSize) {
                for (s = new Ht,
                         o = 0,
                         a = r; a < r + t.chunkSize; ++o)
                    s.digits[o] = n[a++],
                        s.digits[o] += n[a++] << 8;
                var u = t.barrett.powMod(s, t.e);
                l += (16 == t.radix ? Jt(u) : Yt(u, t.radix)) + " "
            }
            return l.substring(0, l.length - 1)
        }(new Lt("10001", "", "A5245A4630DD7CE9D8A967E33A50EB52C2634FD042C4BFBCF5A5C1317A234FD0D1D2C75D083946AF70CE480C399FAD8EEBE9F5A904F30E4D3C91CDD7C27C4D07E27015D46B29A003E9D49834E19041A7BA45A95E6161697975721E88949E8023DA682895086223683593F054E7AAE0E07C40DB33BD80EE5909CE48D17C07D097"), t)
}

function Ht(t) {
    this.digits = "boolean" == typeof t && 1 == t ? null : Nt.slice(0),
        this.isNeg = !1
}

function qt(t) {
    Nt = new Array(t);
    for (var e = 0; e < Nt.length; e++)
        Nt[e] = 0;
    Dt = new Ht,
        (zt = new Ht).digits[0] = 1
}

function Lt(t, e, n) {
    this.e = te(t),
        this.d = te(e),
        this.m = te(n),
        this.chunkSize = 2 * ne(this.m),
        this.radix = 16,
        this.barrett = new me(this.m)
}

function Xt(t) {
    return t >= 48 && t <= 57 ? t - 48 : t >= 65 && t <= 90 ? 10 + t - 65 : t >= 97 && t <= 122 ? 10 + t - 97 : 0
}

function $t(t) {
    for (var e = 0, n = Math.min(t.length, 4), i = 0; i < n; ++i)
        e <<= 4,
            e |= Xt(t.charCodeAt(i));
    return e
}

function ne(t) {
    for (var e = t.digits.length - 1; e > 0 && 0 == t.digits[e];)
        --e;
    return e
}

function te(t) {
    for (var e = new Ht, i = t.length, n = 0; i > 0; i -= 4,
        ++n)
        e.digits[n] = $t(t.substr(Math.max(i - 4, 0), Math.min(i, 4)));
    return e
}

function re(t) {
    var e, n = ne(t), i = t.digits[n], r = (n + 1) * Ut;
    for (e = r; e > r - Ut && 0 == (32768 & i); --e)
        i <<= 1;
    return e
}

function ae(t, e, n, i, r) {
    for (var o = Math.min(e + r, t.length), a = e, s = i; a < o; ++a,
        ++s)
        n[s] = t[a]
}

function le(t, e) {
    var n = Math.floor(e / Ut)
        , i = new Ht;
    ae(t.digits, 0, i.digits, n, i.digits.length - n);
    for (var r = e % Ut, o = Ut - r, a = i.digits.length - 1, s = a - 1; a > 0; --a,
        --s)
        i.digits[a] = i.digits[a] << r & Vt | (i.digits[s] & ce[r]) >>> o;
    return i.digits[0] = i.digits[a] << r & Vt,
        i.isNeg = t.isNeg,
        i
}

function ge(t, e) {
    var n, i, r = re(t), o = re(e), a = e.isNeg;
    if (r < o)
        return t.isNeg ? ((n = Gt(zt)).isNeg = !e.isNeg,
            t.isNeg = !1,
            e.isNeg = !1,
            i = ie(e, t),
            t.isNeg = !0,
            e.isNeg = a) : (n = new Ht,
            i = Gt(t)),
            new Array(n, i);
    n = new Ht,
        i = t;
    for (var s = Math.ceil(o / Ut) - 1, c = 0; e.digits[s] < 32768;)
        e = le(e, 1),
            ++c,
            ++o,
            s = Math.ceil(o / Ut) - 1;
    i = le(i, c),
        r += c;
    for (var l = Math.ceil(r / Ut) - 1, u = fe(e, l - s); -1 != ve(i, u);)
        ++n.digits[l - s],
            i = ie(i, u);
    for (var h = l; h > s; --h) {
        var f = h >= i.digits.length ? 0 : i.digits[h]
            , d = h - 1 >= i.digits.length ? 0 : i.digits[h - 1]
            , p = h - 2 >= i.digits.length ? 0 : i.digits[h - 2]
            , v = s >= e.digits.length ? 0 : e.digits[s]
            , g = s - 1 >= e.digits.length ? 0 : e.digits[s - 1];
        n.digits[h - s - 1] = f == v ? Vt : Math.floor((f * Ft + d) / v);
        for (var b = n.digits[h - s - 1] * (v * Ft + g), m = 4294967296 * f + (d * Ft + p); b > m;)
            --n.digits[h - s - 1],
                b = n.digits[h - s - 1] * (v * Ft | g),
                m = f * Ft * Ft + (d * Ft + p);
        (i = ie(i, se(u = fe(e, h - s - 1), n.digits[h - s - 1]))).isNeg && (i = ee(i, u),
            --n.digits[h - s - 1])
    }
    return i = he(i, c),
        n.isNeg = t.isNeg != a,
    t.isNeg && (n = a ? ee(n, zt) : ie(n, zt),
        i = ie(e = he(e, c), i)),
    0 == i.digits[0] && 0 == ne(i) && (i.isNeg = !1),
        new Array(n, i)
}

function he(t, e) {
    var n = Math.floor(e / Ut)
        , i = new Ht;
    ae(t.digits, n, i.digits, 0, t.digits.length - n);
    for (var r = e % Ut, o = Ut - r, a = 0, s = a + 1; a < i.digits.length - 1; ++a,
        ++s)
        i.digits[a] = i.digits[a] >>> r | (i.digits[s] & ue[r]) << o;
    return i.digits[i.digits.length - 1] >>>= r,
        i.isNeg = t.isNeg,
        i
}

function ie(t, e) {
    var n;
    if (t.isNeg != e.isNeg)
        e.isNeg = !e.isNeg,
            n = ee(t, e),
            e.isNeg = !e.isNeg;
    else {
        var i, r;
        n = new Ht,
            r = 0;
        for (var o = 0; o < t.digits.length; ++o)
            i = t.digits[o] - e.digits[o] + r,
                n.digits[o] = i % Ft,
            n.digits[o] < 0 && (n.digits[o] += Ft),
                r = 0 - Number(i < 0);
        if (-1 == r) {
            for (r = 0,
                     o = 0; o < t.digits.length; ++o)
                i = 0 - n.digits[o] + r,
                    n.digits[o] = i % Ft,
                n.digits[o] < 0 && (n.digits[o] += Ft),
                    r = 0 - Number(i < 0);
            n.isNeg = !t.isNeg
        } else
            n.isNeg = t.isNeg
    }
    return n
}

function se(t, e) {
    var n, i, r, o = new Ht;
    n = ne(t),
        i = 0;
    for (var a = 0; a <= n; ++a)
        r = o.digits[a] + t.digits[a] * e + i,
            o.digits[a] = r & Vt,
            i = r >>> 16;
    return o.digits[1 + n] = i,
        o
}

function ve(t, e) {
    if (t.isNeg != e.isNeg)
        return 1 - 2 * Number(t.isNeg);
    for (var n = t.digits.length - 1; n >= 0; --n)
        if (t.digits[n] != e.digits[n])
            return t.isNeg ? 1 - 2 * Number(t.digits[n] > e.digits[n]) : 1 - 2 * Number(t.digits[n] < e.digits[n]);
    return 0
}

function me(t) {
    this.modulus = Gt(t),
        this.k = ne(this.modulus) + 1;
    var e = new Ht;
    e.digits[2 * this.k] = 1,
        this.mu = function (t, e) {
            return ge(t, e)[0]
        }(e, this.modulus),
        this.bkplus1 = new Ht,
        this.bkplus1.digits[this.k + 1] = 1,
        this.modulo = be,
        this.multiplyMod = ye,
        this.powMod = we
}

function Gt(t) {
    var e = new Ht(!0);
    return e.digits = t.digits.slice(0),
        e.isNeg = t.isNeg,
        e
}

function Yt(t, e) {
    var n = new Ht;
    n.digits[0] = e;
    for (var i = ge(t, n), r = Wt[i[1].digits[0]]; 1 == ve(i[0], Dt);)
        i = ge(i[0], n),
            digit = i[1].digits[0],
            r += Wt[i[1].digits[0]];
    return (t.isNeg ? "-" : "") + Qt(r)
}

function Kt(t) {
    for (var e = "", i = 0; i < 4; ++i)
        e += Zt[15 & t],
            t >>>= 4;
    return Qt(e)
}

function Qt(t) {
    for (var e = "", n = t.length - 1; n > -1; --n)
        e += t.charAt(n);
    return e
}

function Jt(t) {
    for (var e = "", n = (ne(t),
        ne(t)); n > -1; --n)
        e += Kt(t.digits[n]);
    return e
}

function ee(t, e) {
    var n;
    if (t.isNeg != e.isNeg)
        e.isNeg = !e.isNeg,
            n = ie(t, e),
            e.isNeg = !e.isNeg;
    else {
        n = new Ht;
        for (var i, r = 0, o = 0; o < t.digits.length; ++o)
            i = t.digits[o] + e.digits[o] + r,
                n.digits[o] = i % Ft,
                r = Number(i >= Ft);
        n.isNeg = t.isNeg
    }
    return n
}

function oe(t, e) {
    for (var n, i, r, o = new Ht, a = ne(t), s = ne(e), c = 0; c <= s; ++c) {
        n = 0,
            r = c;
        for (var l = 0; l <= a; ++l,
            ++r)
            i = o.digits[r] + t.digits[l] * e.digits[c] + n,
                o.digits[r] = i & Vt,
                n = i >>> 16;
        o.digits[c + a + 1] = n
    }
    return o.isNeg = t.isNeg != e.isNeg,
        o
}

function be(t) {
    var e = de(t, this.k - 1)
        , i = de(oe(e, this.mu), this.k + 1)
        , s = ie(pe(t, this.k + 1), pe(oe(i, this.modulus), this.k + 1));
    s.isNeg && (s = ee(s, this.bkplus1));
    for (var n = ve(s, this.modulus) >= 0; n;)
        n = ve(s = ie(s, this.modulus), this.modulus) >= 0;
    return s
}

function ye(t, e) {
    var n = oe(t, e);
    return this.modulo(n)
}

function we(t, e) {
    var n = new Ht;
    n.digits[0] = 1;
    for (var i = t, r = e; 0 != (1 & r.digits[0]) && (n = this.multiplyMod(n, i)),
    0 != (r = he(r, 1)).digits[0] || 0 != ne(r);)
        i = this.multiplyMod(i, i);
    return n
}

function fe(t, e) {
    var n = new Ht;
    return ae(t.digits, 0, n.digits, e, n.digits.length - e),
        n
}

function de(t, e) {
    var n = new Ht;
    return ae(t.digits, e, n.digits, 0, n.digits.length - e),
        n
}

function pe(t, e) {
    var n = new Ht;
    return ae(t.digits, 0, n.digits, 0, e),
        n
}

function get_pwd(pwd) {
    return Rt(pwd)
}
