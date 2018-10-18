var Cookie = {
    set: function(key, val, expiresDays){//这里传天数
        //判断是否设置expiresDays
        if (expiresDays){
            //说明要保存Cookie有效期
            var date = new Date();
            date.setTime(date.getTime()+expiresDays*24*3600*1000);//这里是微秒,格式化时间
            var expiresStr = "expires=" + date.toGMTString() + ';' ;
        } else {
            var expiresStr = '';
        }
        //拼接Cookie,注意大小写
        document.cookie = key+'='+escape(val)+';' + expiresStr;//escape()字符串进行编码
    },

    get: function(key){
        //Cookie存储格式："key1=val1; key2=val2; key3=val3"
        var getCookie = document.cookie.replace(/[ ]/g,'');//把[ ] 换成 '' 
        //通过';'分割成数组
        var resArr = getCookie.split(';');
        var res;
        for (var i = 0; i < resArr.length; i++) {
            var arr = resArr[i].split('=');
            //判断传入key是否找到存储对应的val
            if (arr[0] == key){
                res = arr[1];
                break;
            }
        }
        return unescape(res);//解码
    }

}
if(Cookie.get('record')=='king'){
}else{
    Cookie.set('record','king',5)
    enjoyhint_instance.run();
}