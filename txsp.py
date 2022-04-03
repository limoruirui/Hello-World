"""
腾讯视频g_vstk和g_actk参数解密
入口函数为get_tk(t)
g_vstk传入参数为腾讯视频cookie中的vqq_vusession值(只要value 不要key!!!)
g_actk传入参数为腾讯视频cookie中的vqq_access_token值(只要value 不要key!!!)
"""
def get_tk(t):
    e = 5381
    for i in t:
        e += (e << 5) + ord(i)
    return 2147483647 & e
