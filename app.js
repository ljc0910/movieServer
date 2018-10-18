const express = require('express');
const router = express.Router()
const app = express();
const bodyParser = require('body-parser') //请求信息由字符串转换成对象

const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');

app.get('/',(req,res)=>{
    res.send('server run 4001')
  })
  
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); 
    }
    else {
        next();
    }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 错误处理
app.use((err, req, res, next) => { 
    res.status(442).send({ error: err.message })
})
app.get('/getMovie',(req,res,next)=>{
    const movieName = req.query.movieName
    let html = '';
    let searchArr = [];
    https.get('https://v.qq.com/x/search/?q='+encodeURI('龙珠'),function(resc){
        var fubiao = 0;
        resc.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        resc.on('data', function (chunk) {   
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        resc.on('end', function () {
            var $ = cheerio.load(html); //采用cheerio模块解析html
            var promise1 = new Promise(function(resolve1,reject1){
                $('.result_item_v').each(function(parIdx,parEl){
                    searchArr.push({
                        id:parIdx,
                        result:{
                            href:[],
                            cover:'',
                            title:'',
                            rating:'',
                            list:[]
                        }
                    })
                    var promise2 = new Promise(function(resolve2,reje2){
                        $(parEl).children('._infos').each(function(idx,el){
                            $(el).find('.result_figure').children('img').each(function(chiIdx,chiEl){
                                searchArr[parIdx].result.cover ='http:' + $(chiEl).attr('src');//图片路径
                            })
                            $(el).find('.result_score').each((i,v)=>{
                                searchArr[parIdx].result.rating = $(v).text().trim();//评分
                            })
                            $(el).find('.result_title').each((i,v)=>{
                                searchArr[parIdx].result.title = $(v).text().trim();//影名
                            })
                            $(el).find('.result_info').each((i,v)=>{
                                $(v).children('.info_item').each((k,cv)=>{
                                    searchArr[parIdx].result.list.push({
                                            type:'',
                                            info:''
                                    })
                                    $(cv).children('span').each((j,ccv)=>{
                                        if(j===0){
                                            searchArr[parIdx].result.list[k].type = $(ccv).text().trim()    //类型
                                        }else{
                                            searchArr[parIdx].result.list[k].info = $(ccv).text().trim().replace('　详细','')    //内容
                                        }
                                    })
                                })
                            })
                        })
                        if($(parEl).children('.result_video_fragment').length>0){       //如果是预告片
                            console.log('预告')
                            $(parEl).children('.result_video_fragment').each(function(idx,el){
                                $(el).find('a.figure').each((i,v)=>{
                                    searchArr[parIdx].result.href.push({
                                        srcHref:$(v).attr('href'),  //链接
                                        info:'时长'+$(v).text().trim()+'__内容：'+$(v).attr('title')
                                    })
                                })
                                if(idx+1===$(parEl).children('.result_video_fragment').length){
                                    resolve2()
                                }
                            })
                        }else{                                                          //如果是正片
                            $(parEl).children('._playlist').each(function(idx,el){     
                                if($(el).find('.btn_primary').length<1){            //电视剧
                                    var videoId = $(parEl).children('._infos').find('a.result_figure').attr('href').split('/').pop().replace('.html','')
                                    console.log('电视剧'+videoId)
                                    var childHtml = '';
                                    var promise3 = new Promise(function(resolve3, reject3){
                                        try{
                                            https.get('https://s.video.qq.com/get_playsource?id='+videoId+'&type=4&range=1-1000',function(resp){
                                                resp.on('data', function (childChunk) {   
                                                    childHtml =childHtml + childChunk;
                                                });
                                                //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
                                                resp.on('end', function () {
                                                    var $c = cheerio.load(childHtml); //采用cheerio模块解析html
                                                    resolve3($c)
                                                })
                                            })
                                        }catch(err){
                                            reject3(err)
                                        }
                                    })
                                    promise3.then($c=>{
                                        console.log($c('PlaylistItem').text())
                                        $c('videoPlayList').each((vi,vv)=>{   
                                            searchArr[parIdx].result.href.push({
                                                srcHref: $c(vv).find('playUrl').text(), 
                                                info:$c(vv).children('episode_number').text()
                                            })           
                                        })
                                        resolve2()  //当前电视剧采集完毕
                                    }).catch((err)=>{
                                        console.log(err)
                                    })
                                }else{                                                 //电影
                                    $(el).find('.btn_primary').each((chiIdx,chiEl)=>{
                                        $(chiEl).children('.icon_text').each((i,v)=>{
                                            searchArr[parIdx].result.href.push({
                                                srcHref:$(chiEl).attr('href'), 
                                                info:$(v).text().trim()
                                            })
                                        })
                                    })
                                    if($(parEl).children('._playlist').length==idx+1){
                                        resolve2()  //当前电影采集完毕
                                    }
                                }
                            })
                        }
                    })
                    promise2.then(()=>{
                    fubiao ++;
                        if($('.result_item_v').length==fubiao+1){  //数据采集完毕
                            fubiao = 0;
                            resolve1()
                        }
                   })
                })
            })
            promise1.then(()=>{
                console.log('发送数据')
                res.json({
                    success:true,
                    result:searchArr
                }) 
            })  
        });
    })
}) 
const server = app.listen(4001,(req)=>{
    console.log('服务开启')
  })