import execjs
from requests import get


def encnpt():
    with open('kuwo.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('get_pwd', "", "", "")
        return encryptPwd


def req():
    url = f"http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=%E5%AD%A4%E5%8B%87%E8%80%85&pn=1&rn=30&httpsStatus=1&reqId=9r948c92-a6ha-19ec-88s3-19c1a764ea40"
    headers = {
        "Cookie": "kw_token=aa",
        "csrf": "aa",
        "Referer": "http://www.kuwo.cn/search/list?key=%E5%AD%A4%E5%8B%87%E8%80%85",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
    }
    print(get(url, headers=headers).json())
req()
# print(encnpt())
