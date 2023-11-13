import execjs
from requests import get, post, Session
from ocr_cap import get_capcode
from time import time
from fake_useragent import UserAgent
from re import findall
def timestamp():
    return int(round(time()*1000))
def get_public_key():
    url = f"https://passport.58.com/58/rsa?source=58-homepage-pc&psdk-d=jsdk&psdk-v=1.1.2&xxzl_staticvalue=19a6d46d3085172a177c85fe8e637a0d_{timestamp()}_fe8775388ee9458e80fa23fd07c1ac62_1974924008&xxzl_dynamicvalue=bbd880abda9d1f191f058b824547a276_{timestamp()}_133&xxzl_namespace=zhaq_pc&callback=JsonpCallBack{timestamp()}486"
    headers = {
        "User-Agent": UserAgent().chrome,
        "referer": "https://passport.58.com/login/?path=https%3A%2F%2Fgl.58.com%2F&source=58-homepage-pc&PGTID=0d100000-0040-fa18-1b31-16a9c9421aaa&ClickID=2"
    }
    data = get(url, headers=headers).text
    public_key = findall(r'"rsaModulus":"(.*?)","action":"0","rsaExponent":"(.*?)"', data)[0]
    return public_key
def encnpt(pwd):
    public_key = get_public_key()
    with open('58tongcheng.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('get_pwd', pwd, public_key[1], public_key[0])
        return encryptPwd
print(encnpt("qq886644"))
