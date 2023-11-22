import execjs
from requests import get, post, Session
from time import time
from re import findall
def encnpt(password):
    url = f"http://eip.chanfine.com/resource/js/session.jsp?_={int(round(time()*1000))}&s_ajax=true"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    }
    data = get(url, headers=headers).text
    pub_key = findall(r'return "(.*?)";', data)[0]
    print(pub_key)
    ser = "\u4435\u5320\u4d35"
    with open('changfangwang.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('get_pwd', password, pub_key[:16], pub_key[16:])
        return ser+encryptPwd
print(encnpt("123456"))
# encnpt()
