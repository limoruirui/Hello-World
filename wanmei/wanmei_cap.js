function get_pwd(place, S, t) {
var e = Encrypt(JSON.stringify(place), Z(S))
var i = Encrypt(JSON.stringify(t), Z(S));
return {e, i}
}
function Z(e) {
return e.substring(1, 3) + e.substring(10, 13) + e.substring(20, 22) + e.substring(26, 31) + e.substring(21, 25)
}
function Encrypt(t, e) {
e = CryptoJS.enc.Utf8.parse(e),
srcs = CryptoJS.enc.Utf8.parse(t);
var i = CryptoJS.AES.encrypt(srcs, e, {
    iv: e,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
});
return CryptoJS.enc.Base64.stringify(i.ciphertext)
}
var CryptoJS = CryptoJS ||
function(s, t) {
var e = {},
i = e.lib = {},
n = function() {},
r = i.Base = {
    extend: function(t) {
        n.prototype = this;
        var e = new n;
        return t && e.mixIn(t),
        e.hasOwnProperty("init") || (e.init = function() {
            e.$super.init.apply(this, arguments)
        }),
        (e.init.prototype = e).$super = this,
        e
    },
    create: function() {
        var t = this.extend();
        return t.init.apply(t, arguments),
        t
    },
    init: function() {},
    mixIn: function(t) {
        for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
        t.hasOwnProperty("toString") && (this.toString = t.toString)
    },
    clone: function() {
        return this.init.prototype.extend(this)
    }
},
c = i.WordArray = r.extend({
    init: function(t, e) {
        t = this.words = t || [],
        this.sigBytes = null != e ? e: 4 * t.length
    },
    toString: function(t) {
        return (t || a).stringify(this)
    },
    concat: function(t) {
        var e = this.words,
        i = t.words,
        n = this.sigBytes;
        if (t = t.sigBytes, this.clamp(), n % 4) for (var r = 0; r < t; r++) e[n + r >>> 2] |= (i[r >>> 2] >>> 24 - r % 4 * 8 & 255) << 24 - (n + r) % 4 * 8;
        else if (65535 < i.length) for (r = 0; r < t; r += 4) e[n + r >>> 2] = i[r >>> 2];
        else e.push.apply(e, i);
        return this.sigBytes += t,
        this
    },
    clamp: function() {
        var t = this.words,
        e = this.sigBytes;
        t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8,
        t.length = s.ceil(e / 4)
    },
    clone: function() {
        var t = r.clone.call(this);
        return t.words = this.words.slice(0),
        t
    },
    random: function(t) {
        for (var e = [], i = 0; i < t; i += 4) e.push(4294967296 * s.random() | 0);
        return new c.init(e, t)
    }
}),
o = e.enc = {},
a = o.Hex = {
    stringify: function(t) {
        var e = t.words;
        t = t.sigBytes;
        for (var i = [], n = 0; n < t; n++) {
            var r = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
            i.push((r >>> 4).toString(16)),
            i.push((15 & r).toString(16))
        }
        return i.join("")
    },
    parse: function(t) {
        for (var e = t.length,
        i = [], n = 0; n < e; n += 2) i[n >>> 3] |= parseInt(t.substr(n, 2), 16) << 24 - n % 8 * 4;
        return new c.init(i, e / 2)
    }
},
p = o.Latin1 = {
    stringify: function(t) {
        var e = t.words;
        t = t.sigBytes;
        for (var i = [], n = 0; n < t; n++) i.push(String.fromCharCode(e[n >>> 2] >>> 24 - n % 4 * 8 & 255));
        return i.join("")
    },
    parse: function(t) {
        for (var e = t.length,
        i = [], n = 0; n < e; n++) i[n >>> 2] |= (255 & t.charCodeAt(n)) << 24 - n % 4 * 8;
        return new c.init(i, e)
    }
},
l = o.Utf8 = {
    stringify: function(t) {
        try {
            return decodeURIComponent(escape(p.stringify(t)))
        } catch(t) {
            throw Error("Malformed UTF-8 data")
        }
    },
    parse: function(t) {
        return p.parse(unescape(encodeURIComponent(t)))
    }
},
d = i.BufferedBlockAlgorithm = r.extend({
    reset: function() {
        this._data = new c.init,
        this._nDataBytes = 0
    },
    _append: function(t) {
        "string" == typeof t && (t = l.parse(t)),
        this._data.concat(t),
        this._nDataBytes += t.sigBytes
    },
    _process: function(t) {
        var e = this._data,
        i = e.words,
        n = e.sigBytes,
        r = this.blockSize,
        o = n / (4 * r);
        if (t = (o = t ? s.ceil(o) : s.max((0 | o) - this._minBufferSize, 0)) * r, n = s.min(4 * t, n), t) {
            for (var a = 0; a < t; a += r) this._doProcessBlock(i, a);
            a = i.splice(0, t),
            e.sigBytes -= n
        }
        return new c.init(a, n)
    },
    clone: function() {
        var t = r.clone.call(this);
        return t._data = this._data.clone(),
        t
    },
    _minBufferSize: 0
});
i.Hasher = d.extend({
    cfg: r.extend(),
    init: function(t) {
        this.cfg = this.cfg.extend(t),
        this.reset()
    },
    reset: function() {
        d.reset.call(this),
        this._doReset()
    },
    update: function(t) {
        return this._append(t),
        this._process(),
        this
    },
    finalize: function(t) {
        return t && this._append(t),
        this._doFinalize()
    },
    blockSize: 16,
    _createHelper: function(i) {
        return function(t, e) {
            return new i.init(e).finalize(t)
        }
    },
    _createHmacHelper: function(i) {
        return function(t, e) {
            return new f.HMAC.init(i, e).finalize(t)
        }
    }
});
var f = e.algo = {};
return e
} (Math); !
function() {
var t = CryptoJS,
c = t.lib.WordArray;
t.enc.Base64 = {
    stringify: function(t) {
        var e = t.words,
        i = t.sigBytes,
        n = this._map;
        t.clamp(),
        t = [];
        for (var r = 0; r < i; r += 3) for (var o = (e[r >>> 2] >>> 24 - r % 4 * 8 & 255) << 16 | (e[r + 1 >>> 2] >>> 24 - (r + 1) % 4 * 8 & 255) << 8 | e[r + 2 >>> 2] >>> 24 - (r + 2) % 4 * 8 & 255, a = 0; a < 4 && r + .75 * a < i; a++) t.push(n.charAt(o >>> 6 * (3 - a) & 63));
        if (e = n.charAt(64)) for (; t.length % 4;) t.push(e);
        return t.join("")
    },
    parse: function(t) {
        var e = t.length,
        i = this._map; (n = i.charAt(64)) && ( - 1 != (n = t.indexOf(n)) && (e = n));
        for (var n = [], r = 0, o = 0; o < e; o++) if (o % 4) {
            var a = i.indexOf(t.charAt(o - 1)) << o % 4 * 2,
            s = i.indexOf(t.charAt(o)) >>> 6 - o % 4 * 2;
            n[r >>> 2] |= (a | s) << 24 - r % 4 * 8,
            r++
        }
        return c.create(n, r)
    },
    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
}
} (),
function(o) {
function S(t, e, i, n, r, o, a) {
    return ((t = t + (e & i | ~e & n) + r + a) << o | t >>> 32 - o) + e
}
function C(t, e, i, n, r, o, a) {
    return ((t = t + (e & n | i & ~n) + r + a) << o | t >>> 32 - o) + e
}
function B(t, e, i, n, r, o, a) {
    return ((t = t + (e ^ i ^ n) + r + a) << o | t >>> 32 - o) + e
}
function A(t, e, i, n, r, o, a) {
    return ((t = t + (i ^ (e | ~n)) + r + a) << o | t >>> 32 - o) + e
}
for (var t = CryptoJS,
e = (n = t.lib).WordArray, i = n.Hasher, n = t.algo, I = [], r = 0; r < 64; r++) I[r] = 4294967296 * o.abs(o.sin(r + 1)) | 0;
n = n.MD5 = i.extend({
    _doReset: function() {
        this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878])
    },
    _doProcessBlock: function(t, e) {
        for (var i = 0; i < 16; i++) {
            var n = t[a = e + i];
            t[a] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
        }
        i = this._hash.words;
        var r, o, a = t[e + 0],
        s = (n = t[e + 1], t[e + 2]),
        c = t[e + 3],
        p = t[e + 4],
        l = t[e + 5],
        d = t[e + 6],
        f = t[e + 7],
        h = t[e + 8],
        u = t[e + 9],
        g = t[e + 10],
        v = t[e + 11],
        x = t[e + 12],
        m = t[e + 13],
        y = t[e + 14],
        b = t[e + 15],
        k = i[0],
        w = A(w = A(w = A(w = A(w = B(w = B(w = B(w = B(w = C(w = C(w = C(w = C(w = S(w = S(w = S(w = S(w = i[1], o = S(o = i[2], r = S(r = i[3], k = S(k, w, o, r, a, 7, I[0]), w, o, n, 12, I[1]), k, w, s, 17, I[2]), r, k, c, 22, I[3]), o = S(o, r = S(r, k = S(k, w, o, r, p, 7, I[4]), w, o, l, 12, I[5]), k, w, d, 17, I[6]), r, k, f, 22, I[7]), o = S(o, r = S(r, k = S(k, w, o, r, h, 7, I[8]), w, o, u, 12, I[9]), k, w, g, 17, I[10]), r, k, v, 22, I[11]), o = S(o, r = S(r, k = S(k, w, o, r, x, 7, I[12]), w, o, m, 12, I[13]), k, w, y, 17, I[14]), r, k, b, 22, I[15]), o = C(o, r = C(r, k = C(k, w, o, r, n, 5, I[16]), w, o, d, 9, I[17]), k, w, v, 14, I[18]), r, k, a, 20, I[19]), o = C(o, r = C(r, k = C(k, w, o, r, l, 5, I[20]), w, o, g, 9, I[21]), k, w, b, 14, I[22]), r, k, p, 20, I[23]), o = C(o, r = C(r, k = C(k, w, o, r, u, 5, I[24]), w, o, y, 9, I[25]), k, w, c, 14, I[26]), r, k, h, 20, I[27]), o = C(o, r = C(r, k = C(k, w, o, r, m, 5, I[28]), w, o, s, 9, I[29]), k, w, f, 14, I[30]), r, k, x, 20, I[31]), o = B(o, r = B(r, k = B(k, w, o, r, l, 4, I[32]), w, o, h, 11, I[33]), k, w, v, 16, I[34]), r, k, y, 23, I[35]), o = B(o, r = B(r, k = B(k, w, o, r, n, 4, I[36]), w, o, p, 11, I[37]), k, w, f, 16, I[38]), r, k, g, 23, I[39]), o = B(o, r = B(r, k = B(k, w, o, r, m, 4, I[40]), w, o, a, 11, I[41]), k, w, c, 16, I[42]), r, k, d, 23, I[43]), o = B(o, r = B(r, k = B(k, w, o, r, u, 4, I[44]), w, o, x, 11, I[45]), k, w, b, 16, I[46]), r, k, s, 23, I[47]), o = A(o, r = A(r, k = A(k, w, o, r, a, 6, I[48]), w, o, f, 10, I[49]), k, w, y, 15, I[50]), r, k, l, 21, I[51]), o = A(o, r = A(r, k = A(k, w, o, r, x, 6, I[52]), w, o, c, 10, I[53]), k, w, g, 15, I[54]), r, k, n, 21, I[55]), o = A(o, r = A(r, k = A(k, w, o, r, h, 6, I[56]), w, o, b, 10, I[57]), k, w, d, 15, I[58]), r, k, m, 21, I[59]), o = A(o, r = A(r, k = A(k, w, o, r, p, 6, I[60]), w, o, v, 10, I[61]), k, w, s, 15, I[62]), r, k, u, 21, I[63]);
        i[0] = i[0] + k | 0,
        i[1] = i[1] + w | 0,
        i[2] = i[2] + o | 0,
        i[3] = i[3] + r | 0
    },
    _doFinalize: function() {
        var t = this._data,
        e = t.words,
        i = 8 * this._nDataBytes,
        n = 8 * t.sigBytes;
        e[n >>> 5] |= 128 << 24 - n % 32;
        var r = o.floor(i / 4294967296);
        for (e[15 + (n + 64 >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8), e[14 + (n + 64 >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8), t.sigBytes = 4 * (e.length + 1), this._process(), e = (t = this._hash).words, i = 0; i < 4; i++) n = e[i],
        e[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
        return t
    },
    clone: function() {
        var t = i.clone.call(this);
        return t._hash = this._hash.clone(),
        t
    }
}),
t.MD5 = i._createHelper(n),
t.HmacMD5 = i._createHmacHelper(n)
} (Math),
function() {
var t, e = CryptoJS,
i = (t = e.lib).Base,
p = t.WordArray,
n = (t = e.algo).EvpKDF = i.extend({
    cfg: i.extend({
        keySize: 4,
        hasher: t.MD5,
        iterations: 1
    }),
    init: function(t) {
        this.cfg = this.cfg.extend(t)
    },
    compute: function(t, e) {
        for (var i = (a = this.cfg).hasher.create(), n = p.create(), r = n.words, o = a.keySize, a = a.iterations; r.length < o;) {
            s && i.update(s);
            var s = i.update(t).finalize(e);
            i.reset();
            for (var c = 1; c < a; c++) s = i.finalize(s),
            i.reset();
            n.concat(s)
        }
        return n.sigBytes = 4 * o,
        n
    }
});
e.EvpKDF = function(t, e, i) {
    return n.create(i).compute(t, e)
}
} (),
CryptoJS.lib.Cipher ||
function(t) {
var e = (h = CryptoJS).lib,
i = e.Base,
a = e.WordArray,
n = e.BufferedBlockAlgorithm,
r = h.enc.Base64,
o = h.algo.EvpKDF,
s = e.Cipher = n.extend({
    cfg: i.extend(),
    createEncryptor: function(t, e) {
        return this.create(this._ENC_XFORM_MODE, t, e)
    },
    createDecryptor: function(t, e) {
        return this.create(this._DEC_XFORM_MODE, t, e)
    },
    init: function(t, e, i) {
        this.cfg = this.cfg.extend(i),
        this._xformMode = t,
        this._key = e,
        this.reset()
    },
    reset: function() {
        n.reset.call(this),
        this._doReset()
    },
    process: function(t) {
        return this._append(t),
        this._process()
    },
    finalize: function(t) {
        return t && this._append(t),
        this._doFinalize()
    },
    keySize: 4,
    ivSize: 4,
    _ENC_XFORM_MODE: 1,
    _DEC_XFORM_MODE: 2,
    _createHelper: function(n) {
        return {
            encrypt: function(t, e, i) {
                return ("string" == typeof e ? u: f).encrypt(n, t, e, i)
            },
            decrypt: function(t, e, i) {
                return ("string" == typeof e ? u: f).decrypt(n, t, e, i)
            }
        }
    }
});
e.StreamCipher = s.extend({
    _doFinalize: function() {
        return this._process(!0)
    },
    blockSize: 1
});
var c = h.mode = {},
p = function(t, e, i) {
    var n = this._iv;
    n ? this._iv = void 0 : n = this._prevBlock;
    for (var r = 0; r < i; r++) t[e + r] ^= n[r]
},
l = (e.BlockCipherMode = i.extend({
    createEncryptor: function(t, e) {
        return this.Encryptor.create(t, e)
    },
    createDecryptor: function(t, e) {
        return this.Decryptor.create(t, e)
    },
    init: function(t, e) {
        this._cipher = t,
        this._iv = e
    }
})).extend();
l.Encryptor = l.extend({
    processBlock: function(t, e) {
        var i = this._cipher,
        n = i.blockSize;
        p.call(this, t, e, n),
        i.encryptBlock(t, e),
        this._prevBlock = t.slice(e, e + n)
    }
}),
l.Decryptor = l.extend({
    processBlock: function(t, e) {
        var i = this._cipher,
        n = i.blockSize,
        r = t.slice(e, e + n);
        i.decryptBlock(t, e),
        p.call(this, t, e, n),
        this._prevBlock = r
    }
}),
c = c.CBC = l,
l = (h.pad = {}).Pkcs7 = {
    pad: function(t, e) {
        for (var i, n = (i = (i = 4 * e) - t.sigBytes % i) << 24 | i << 16 | i << 8 | i, r = [], o = 0; o < i; o += 4) r.push(n);
        i = a.create(r, i),
        t.concat(i)
    },
    unpad: function(t) {
        t.sigBytes -= 255 & t.words[t.sigBytes - 1 >>> 2]
    }
},
e.BlockCipher = s.extend({
    cfg: s.cfg.extend({
        mode: c,
        padding: l
    }),
    reset: function() {
        s.reset.call(this);
        var t = (e = this.cfg).iv,
        e = e.mode;
        if (this._xformMode == this._ENC_XFORM_MODE) var i = e.createEncryptor;
        else i = e.createDecryptor,
        this._minBufferSize = 1;
        this._mode = i.call(e, this, t && t.words)
    },
    _doProcessBlock: function(t, e) {
        this._mode.processBlock(t, e)
    },
    _doFinalize: function() {
        var t = this.cfg.padding;
        if (this._xformMode == this._ENC_XFORM_MODE) {
            t.pad(this._data, this.blockSize);
            var e = this._process(!0)
        } else e = this._process(!0),
        t.unpad(e);
        return e
    },
    blockSize: 4
});
var d = e.CipherParams = i.extend({
    init: function(t) {
        this.mixIn(t)
    },
    toString: function(t) {
        return (t || this.formatter).stringify(this)
    }
}),
f = (c = (h.format = {}).OpenSSL = {
    stringify: function(t) {
        var e = t.ciphertext;
        return ((t = t.salt) ? a.create([1398893684, 1701076831]).concat(t).concat(e) : e).toString(r)
    },
    parse: function(t) {
        var e = (t = r.parse(t)).words;
        if (1398893684 == e[0] && 1701076831 == e[1]) {
            var i = a.create(e.slice(2, 4));
            e.splice(0, 4),
            t.sigBytes -= 16
        }
        return d.create({
            ciphertext: t,
            salt: i
        })
    }
},
e.SerializableCipher = i.extend({
    cfg: i.extend({
        format: c
    }),
    encrypt: function(t, e, i, n) {
        n = this.cfg.extend(n);
        var r = t.createEncryptor(i, n);
        return e = r.finalize(e),
        r = r.cfg,
        d.create({
            ciphertext: e,
            key: i,
            iv: r.iv,
            algorithm: t,
            mode: r.mode,
            padding: r.padding,
            blockSize: t.blockSize,
            formatter: n.format
        })
    },
    decrypt: function(t, e, i, n) {
        return n = this.cfg.extend(n),
        e = this._parse(e, n.format),
        t.createDecryptor(i, n).finalize(e.ciphertext)
    },
    _parse: function(t, e) {
        return "string" == typeof t ? e.parse(t, this) : t
    }
})),
h = (h.kdf = {}).OpenSSL = {
    execute: function(t, e, i, n) {
        return n || (n = a.random(8)),
        t = o.create({
            keySize: e + i
        }).compute(t, n),
        i = a.create(t.words.slice(e), 4 * i),
        t.sigBytes = 4 * e,
        d.create({
            key: t,
            iv: i,
            salt: n
        })
    }
},
u = e.PasswordBasedCipher = f.extend({
    cfg: f.cfg.extend({
        kdf: h
    }),
    encrypt: function(t, e, i, n) {
        return i = (n = this.cfg.extend(n)).kdf.execute(i, t.keySize, t.ivSize),
        n.iv = i.iv,
        (t = f.encrypt.call(this, t, e, i.key, n)).mixIn(i),
        t
    },
    decrypt: function(t, e, i, n) {
        return n = this.cfg.extend(n),
        e = this._parse(e, n.format),
        i = n.kdf.execute(i, t.keySize, t.ivSize, e.salt),
        n.iv = i.iv,
        f.decrypt.call(this, t, e, i.key, n)
    }
})
} (),
function() {
for (var t = CryptoJS,
e = t.lib.BlockCipher,
i = t.algo,
a = [], n = [], r = [], o = [], s = [], c = [], p = [], l = [], d = [], f = [], h = [], u = 0; u < 256; u++) h[u] = u < 128 ? u << 1 : u << 1 ^ 283;
var g = 0,
v = 0;
for (u = 0; u < 256; u++) {
    var x = (x = v ^ v << 1 ^ v << 2 ^ v << 3 ^ v << 4) >>> 8 ^ 255 & x ^ 99;
    a[g] = x;
    var m = h[n[x] = g],
    y = h[m],
    b = h[y],
    k = 257 * h[x] ^ 16843008 * x;
    r[g] = k << 24 | k >>> 8,
    o[g] = k << 16 | k >>> 16,
    s[g] = k << 8 | k >>> 24,
    c[g] = k,
    k = 16843009 * b ^ 65537 * y ^ 257 * m ^ 16843008 * g,
    p[x] = k << 24 | k >>> 8,
    l[x] = k << 16 | k >>> 16,
    d[x] = k << 8 | k >>> 24,
    f[x] = k,
    g ? (g = m ^ h[h[h[b ^ m]]], v ^= h[h[v]]) : g = v = 1
}
var w = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
i = i.AES = e.extend({
    _doReset: function() {
        for (var t = (i = this._key).words, e = i.sigBytes / 4, i = 4 * ((this._nRounds = e + 6) + 1), n = this._keySchedule = [], r = 0; r < i; r++) if (r < e) n[r] = t[r];
        else {
            var o = n[r - 1];
            r % e ? 6 < e && 4 == r % e && (o = a[o >>> 24] << 24 | a[o >>> 16 & 255] << 16 | a[o >>> 8 & 255] << 8 | a[255 & o]) : (o = a[(o = o << 8 | o >>> 24) >>> 24] << 24 | a[o >>> 16 & 255] << 16 | a[o >>> 8 & 255] << 8 | a[255 & o], o ^= w[r / e | 0] << 24),
            n[r] = n[r - e] ^ o
        }
        for (t = this._invKeySchedule = [], e = 0; e < i; e++) r = i - e,
        o = e % 4 ? n[r] : n[r - 4],
        t[e] = e < 4 || r <= 4 ? o: p[a[o >>> 24]] ^ l[a[o >>> 16 & 255]] ^ d[a[o >>> 8 & 255]] ^ f[a[255 & o]]
    },
    encryptBlock: function(t, e) {
        this._doCryptBlock(t, e, this._keySchedule, r, o, s, c, a)
    },
    decryptBlock: function(t, e) {
        var i = t[e + 1];
        t[e + 1] = t[e + 3],
        t[e + 3] = i,
        this._doCryptBlock(t, e, this._invKeySchedule, p, l, d, f, n),
        i = t[e + 1],
        t[e + 1] = t[e + 3],
        t[e + 3] = i
    },
    _doCryptBlock: function(t, e, i, n, r, o, a, s) {
        for (var c = this._nRounds,
        p = t[e] ^ i[0], l = t[e + 1] ^ i[1], d = t[e + 2] ^ i[2], f = t[e + 3] ^ i[3], h = 4, u = 1; u < c; u++) {
            var g = n[p >>> 24] ^ r[l >>> 16 & 255] ^ o[d >>> 8 & 255] ^ a[255 & f] ^ i[h++],
            v = n[l >>> 24] ^ r[d >>> 16 & 255] ^ o[f >>> 8 & 255] ^ a[255 & p] ^ i[h++],
            x = n[d >>> 24] ^ r[f >>> 16 & 255] ^ o[p >>> 8 & 255] ^ a[255 & l] ^ i[h++];
            f = n[f >>> 24] ^ r[p >>> 16 & 255] ^ o[l >>> 8 & 255] ^ a[255 & d] ^ i[h++],
            p = g,
            l = v,
            d = x
        }
        g = (s[p >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[d >>> 8 & 255] << 8 | s[255 & f]) ^ i[h++],
        v = (s[l >>> 24] << 24 | s[d >>> 16 & 255] << 16 | s[f >>> 8 & 255] << 8 | s[255 & p]) ^ i[h++],
        x = (s[d >>> 24] << 24 | s[f >>> 16 & 255] << 16 | s[p >>> 8 & 255] << 8 | s[255 & l]) ^ i[h++],
        f = (s[f >>> 24] << 24 | s[p >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & d]) ^ i[h++],
        t[e] = g,
        t[e + 1] = v,
        t[e + 2] = x,
        t[e + 3] = f
    },
    keySize: 8
});
t.AES = e._createHelper(i)
} ();
