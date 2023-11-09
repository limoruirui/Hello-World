import execjs
from requests import get, post, Session
from ocr_cap import get_capcode
def encnpt(password):
    with open('weixinwp.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('jiami', password)
        return encryptPwd
def get_cap_photos(username):
    url = f"https://mp.weixin.qq.com/cgi-bin/verifycode?username={username}&r=1646970906138"
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0;Win64;x64) AppleWebKit/537.36(KHTML, likeGecko) Chrome/99.0.4844.51 Safari/537.36",
        "referer": "https://mp.weixin.qq.com/"
    }
    res = get(url, headers=headers)
    img_data = res.content
    sig = res.headers.get("Set-Cookie")
    return img_data, sig
def login(username, password):
    session = Session()
    url = "https://mp.weixin.qq.com/cgi-bin/bizlogin?action=startlogin"
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0;Win64;x64) AppleWebKit/537.36(KHTML, likeGecko) Chrome/99.0.4844.51 Safari/537.36",
        "referer": "https://mp.weixin.qq.com/"
    }
    data = {
        "username": username,
        "pwd": encnpt(str(password)[:16]),
        "imgcode":"",
            "f": "json",
    "userlang": "zh_CN",
    "redirect_url":"",
    "token":"",
    "lang": "zh_CN",
    "ajax": 1
    }
    # print(encnpt("BC*FNgvBA/GZ9cj"))
    res = post(url, headers=headers, data=data).json()
    if res["base_resp"]["ret"] == 200008:
        cap_msg = get_cap_photos(username)
        # with open("test.jpg", "wb") as f:
        #     f.write(cap_msg[0])
        data["imgcode"] = get_capcode(cap_msg[0])
        headers["Cookie"] = cap_msg[1]
        res = post(url, headers=headers, data=data)
        print(res.cookies)
        print(res.json())
login("1776862618@qq.com", "BC*FNgvBA/GZ9cj")
# print(get_cap_photos("1776862618@qq.com"))
# 194254da1be051079eef1431ae939cf8
# 194254da1be051079eef1431ae939cf8
