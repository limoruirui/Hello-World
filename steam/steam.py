import execjs
from requests import Session
from time import time
session = Session()
def get_pubkey(username):
    url = "https://store.steampowered.com/login/getrsakey/"
    data = {
        "donotcache": int(round(time()*1000)),
        "username": username
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Referer": "https://store.steampowered.com/login/?redir=&redir_ssl=1&snr=1_4_4__global-header",
    }
    res = session.post(url, headers=headers, data=data).json()
    return res["publickey_mod"], res["publickey_exp"], res["timestamp"]
def encnpt(username, password):
    pubkey, exp,  rsatimestamp = get_pubkey(username)
    with open('steam1.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('get_pwd', password, pubkey, exp)
        return encryptPwd, rsatimestamp
def login(username, password):
    url = "https://store.steampowered.com/login/dologin/"
    pwd, restimestamp = encnpt(username, password)
    data = {
        "donotcache": int(round(time()*1000)),
        "password": pwd,
        "username": username,
        "twofactorcode": "",
        "emailauth": "",
        "loginfriendlyname":"",
        "captchagid": "-1",
        "captcha_text":"",
        "emailsteamid":"",
        "rsatimestamp": restimestamp,
        "remember_login": "false"
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
        "Referer": "https://store.steampowered.com/login/?redir=&redir_ssl=1&snr=1_4_4__global-header",
    }
    res = session.post(url, headers=headers, data=data)
    print(res.json())
print(login("123456789@qq.com", "123456"))
