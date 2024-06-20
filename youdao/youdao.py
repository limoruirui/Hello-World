from requests import post
from random import randint
from time import time
from hashlib import md5
def get_timestamp():
    return int(round(time()*1000))
def get_sign(word, salt):
    str = f"fanyideskweb{word}{salt}Ygy_4c=r#e#4EX^NUGUc5"
    sign = md5(str.encode(encoding="utf-8")).hexdigest()
    return sign
def main(word):
    url = "https://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule"
    timestamp = get_timestamp()
    salt = f"{timestamp}{randint(0,10)}"
    data = {
    "i": word,
    "from": "AUTO",
    "to": "AUTO",
    "smartresult": "dict",
    "client": "fanyideskweb",
    "salt":  salt,
    "sign": get_sign(word, salt),
    "lts": timestamp,
    "bv": "c2777327e4e29b7c4728f13e47bde9a5",
    "doctype": "json",
    "version": "2.1",
    "keyfrom": "fanyi.web",
    "action": "FY_BY_CLICKBUTTION"
    }
    headers= {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
        "Referer": "https://fanyi.youdao.com/",
        "Cookie": "P_INFO=null; OUTFOX_SEARCH_USER_ID=1072725841@10.108.162.139; JSESSIONID=aaaJhRp9XXtQYgaP4r_9x; OUTFOX_SEARCH_USER_ID_NCOO=1471092909.569028; ___rl__test__cookies=1647091096411"
    }
    return post(url, data=data, headers=headers).json()["translateResult"][0][0]["tgt"]
if __name__ == '__main__':
    print(main("word"))
