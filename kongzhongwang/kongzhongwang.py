import execjs
from requests import get, post, Session
from ocr_cap import get_capcode
from time import time
from re import findall
def encnpt(password):
    url = "https://sso.kongzhong.com/ajaxLogin?j=j&jsonp=j&service=https://passport.kongzhong.com/&_=1647018453954"
    headers = {
        "Referer": "https://passport.kongzhong.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    }
    data = get(url, headers=headers).text
    dc = findall(r'"dc":"(.*?)"', data)[0]
    with open('kongzhongwang.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('get_pwd', password, dc)
        return encryptPwd
print(encnpt(""))
