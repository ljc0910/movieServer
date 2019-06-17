<template>
    <div class="play">
        <mt-header title="播放">
            <router-link to="/" slot="left">
                <mt-button icon="back">back</mt-button>
            </router-link>
        </mt-header>
        <iframe :src="href"></iframe>
    </div>
</template>
<script>
export default {
    data () {
        return {
            href:this.$route.query.href,
        }
    },
    mounted () {
        document.addEventListener('plusready', function() {
            var webview = plus.webview.currentWebview();
            plus.key.addEventListener('backbutton', function() {
                webview.canBack(function(e) {
                    if(e.canBack) {
                        webview.back();
                    } else {
                        webview.close(); //hide,quit
                        //plus.runtime.quit();
                    }
                })
            });
        });
    }
}
</script>

<style>
.play{position: absolute;width: 100vw;height: 100vh;z-index: 999;background: #fff;overflow: hidden;}
iframe{width: 100vw;}
.mint-header{background: #d9d9d9 !important;}
.mint-header-title{color: #26a2ff !important;}
.mint-button-text{color: #26a2ff !important;}
.mint-button-icon{color: #26a2ff !important;}
</style>

