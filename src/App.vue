<template>
  <div id="app">
    <dl class="side" :style="{
      'width': sizeWidth  
    }">
      <transition-group tag="ul" class="poster" name="fade">
        <li v-show="item.status"
          :key="index"
          v-for="(item, index) in posters"
          :style="{backgroundImage: `url(${item.src})`}"
        ></li>
      </transition-group>
      <div class="featured">
				<span>Bio</span>
				<h2>I'm isaac_宝华 </h2>
			</div>
    </dl>
    <dl class="main" :style="{
      'padding-left': sizeWidth
    }">
      <ul class="list-loading" v-if="false">
        <li :key="i" v-for="i in 5" class="loading">
          <span></span>
          <p :key="p" v-for="p in 5"></p>
        </li>
      </ul>
      <router-view></router-view>
    </dl>
    <button title="to-top" @click="toTop">
      <img src="http://sl-cdn.hingyin.com/o_1but94ecln0s1vi910fgq6s1ed77.png">
    </button>
  </div>
</template>

<style lang="scss">
  @import './assets/scss/style.scss';
</style>

<script>
export default {
  name: 'app',

  mounted () {
    const self = this;
    let index = 0;
    const len = self.posters.length;
    setInterval(() => {
      let oldOne = index % len;
      let newOne = ++index % len;
      self.posters[oldOne].status = false;
      self.posters[newOne].status = true;
    }, 8000);
    // ga('set', 'userId', Math.floor(Math.random() * 100000000));
  },

  data() {
    return {
      sizeWidth: '38%',
      posters: [
        { 
          status: true, 
          src: 'http://sl-cdn.hingyin.com/o_1but067rl5a7onvjfh1b2q1qqf7.jpeg' 
        },
        { 
          status: false, 
          src: 'http://sl-cdn.hingyin.com/o_1butfcgaa10pg19q1f8hj711v1b7.png'
        },
        { 
          status: false, 
          src: 'http://sl-cdn.hingyin.com/o_1butfk3u23nf1pt33tib154odc.png'
        },
        { 
          status: false, 
          src: 'http://sl-cdn.hingyin.com/o_1butfnvtsos5vteu0vkpr1fpqm.jpeg'
        },
        {
          status: false,
          src: 'http://sl-cdn.hingyin.com/o_1butfugpt57i1m871jsn1ka59kp7.png'
        }
      ],
    };
  },

  methods: {
    toTop() {
      const list = document.querySelector('#home .list');
      const space = 60;
      const delay = 1000 / 60;
      let scroll = list.scrollTop;
      const timer = setInterval(function() {
        scroll -= space;
        scroll = scroll < 0 ? 0 : scroll;
        list.scrollTop = scroll;
        if(!scroll) { clearInterval(timer); }
      }, delay);
    }
  }
}
</script>
