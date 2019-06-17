<template>
  <div class="hello">
    <router-view></router-view>
    <div class="cover" v-show="isLoading">
      <mt-spinner :size="60" color="#888" type="double-bounce"></mt-spinner>
    </div>
    <mt-popup
      v-model="prompt.bol"
      position="top">
      {{prompt.info}}
    </mt-popup>
    <mt-search v-model="value" @input="search" cancel-text="重置" placeholder="请输入电影名称">
      <mt-cell
        v-for="item in result"
        :key='item.id'>
        <div class="info">
          <img :src='item.result.cover'>
          <div class="detail">
            <h2>片名：{{item.result.title}}</h2>
            <div v-for="v in item.result.list" :key="v.type">
              <span>{{v.type}}</span>
              <span>{{setString(v.info,200)}}</span>
            </div>
          </div>
          <div class="theHref">
            播放源：<a v-for="v in item.result.href" :key="v.info" :href="'http://111jx.xyz/?url='+v.srcHref">{{v.info=='免费试看'?'立即播放':v.info+' '}}</a>
             <!-- <router-link tag="a" v-for="v in item.result.href" :key="v.info" :to="{name:'play',query:{href:'http://111jx.xyz/?url='+v.srcHref}}">{{v.info=='免费试看'?'立即播放':v.info+' '}}</router-link> -->
          </div>
        </div>
      </mt-cell>
    </mt-search>
    
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
  name: 'HelloWorld',
  data () {
    return {
      value:'',
      result:[],
      t:'',
      isLoading:false,
      prompt:{
        bol:false,
        info:''
      }
    }
  },
  methods:{
    search(){
      this.isLoading = true
      this.result = []
      clearTimeout(this.t)
      if(this.value==='') return this.isLoading = false
      this.t = setTimeout(()=>{     //防止输入过程多次请求
        this.$http.get('http://119.3.235.132:4001/getMovie',{
          params:{
            movieName:this.value
          },
          timeout: 4000
        }).then(data=>{
          this.isLoading = false
          data.data.result.forEach(v => {
            this.result.push(v)
          })
          this.prompt.bol = true
            this.prompt.info = '查询成功！'
            this.isLoading = false
            var tt = setTimeout(()=>{
              this.prompt.bol = false
              this.prompt.info = ''
            },2000)
        }).catch(err=>{
            this.prompt.bol = true
            this.prompt.info = '未找到您输入的内容!'
            this.isLoading = false
            var tt = setTimeout(()=>{
              this.prompt.bol = false
              this.prompt.info = ''
            },2000)
          })
      },500)
    },
    setString(str, len) {  
        var strlen = 0;  
        var s = "";  
        for (var i = 0; i < str.length; i++) {  
            if (str.charCodeAt(i) > 128) {  
                strlen += 2;  
            } else {  
                strlen++;  
            }  
            s += str.charAt(i);  
            if (strlen >= len) {  
                return s+"...";  
            }  
        }  
        return s;  
    }  
  },
  mounted () {
    document.addEventListener('plusready', function(a) {
        var first = null;
        plus.key.addEventListener('backbutton', function() {
                //首次按键，提示‘再按一次退出应用’
                if (!first) {
                    first = new Date().getTime();
                    Toast({
                      message: '再按一次退出应用',
                      position: 'bottom',
                      duration: 1000
                    });
                    setTimeout(function() {
                        first = null;
                    }, 1000);
                } else {
                    if (new Date().getTime() - first < 1000) {
                        plus.runtime.quit();
                    }
                }
            }, false);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.info img{width: 40vw;float: left;margin-left: 1vw;}
.info .detail{width: 55vw;float: left;height: 56vw;overflow: hidden;padding-left: 2vw;}
.info .detail h2{font-size: 14px;}
.info .detail span{font-size: 12px;}
.mint-search-list{margin-top: 20px;}
.mint-cell-wrapper{padding: 0 !important;}
.mint-cell-value{width: 100%;padding: 1vw 0;}
.theHref{width: 100vw;padding: 2vw;clear: both;}
.cover{position: absolute;z-index: 999;background: rgba(0, 0, 0, .1);width: 100vw;height:100vh;}
.cover span{position: absolute;left: 50%;top: 50%;margin-left: -30px;margin-top: -30px;}
.mint-popup-top{width:100%;text-align: center;padding:5% 0; background: rgba(0, 0, 0, .6) !important;color: #fff !important;}
.v-modal{background: rgba(0, 0, 0, 0) !important;}
</style>
