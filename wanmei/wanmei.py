import execjs
from requests import post
def login(password):
    with open('wanmei.js', 'r', encoding="utf-8") as f:
        js = f.read()
        ctx = execjs.compile(js)
        encryptPwd = ctx.call('get_pwd', password, "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjfeE0MIYsZes/HwV06/kvRw34Hmhn9WPt0feLPp1PVqdqZz1/xFvPPEAJ/lAvfqt5kyn+A06bvYXIhizTjlOzPgLE4897ihuSYXgfwcUshPZvydRLbftU6Exj5SLbv5tw4GInbgQv7RWLWOKyQA81q6lWae2Kcgd1XpDRsQNXVwIDAQAB")
        # print(encryptPwd)
        return encryptPwd
print(login("123456"))
