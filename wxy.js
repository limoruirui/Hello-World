// 无忧行app端 请求体和响应体内容的加密和解密 
// 加密和解密都是aes aes加密的密钥不固定 请求时需要携带密钥发送过去 返回的内容需要解密的话 也会有密钥返回回来 带着密钥解密即可
// ke为对密钥的解密 i为生成加密后的密钥 取得密钥用使用aes加密 ECB pkcs7即可获取明文
var CryptoJS = require("crypto-js");
var he = "online_jego_h5" //aes解密中的ke(o)函数用到 o为sec
var ge = "93EFE107DDE6DE51" //aes加密中的Ae() 用到
var fe = "01" //aes加密中的Ae() 用到
function ke(o) {
    var n = "";
    if (!o)
        return n;
    var e = CryptoJS.enc.Base64.parse(o)

        , t = e.toString(CryptoJS.enc.Utf8)
        , a = t.split(";");
    if (a && 3 === a.length) {
        var c = ge + a[1];
        n = CryptoJS.MD5(c).toString().toLowerCase().slice(8, 24)
    }
    return n
}
// const o = "b25saW5lX2plZ29faDU7MTY1MzA1MzUwOTYxNzU2OTswMQ=="
// console.log(ke(o))

function i() {
    var e = (new Date).getTime().toString() + Math.floor(900 * Math.random() + 100).toString()
        , i = ge + e
        , a = CryptoJS.MD5(i).toString().toLowerCase().slice(8, 24)
        , c = CryptoJS.enc.Utf8.parse(he + ";" + e + ";" + fe);
    return {
        key: a,
        sec: CryptoJS.enc.Base64.stringify(c)
    }
}
// var body = i()
// console.log(body)
