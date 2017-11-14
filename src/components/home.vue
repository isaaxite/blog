<template>
  <div id="home" class="route" v-show="!isLoading">
    <dl class="side">
      <div class="featured">
				<span>Bio</span>
				<h2>I'm Isaac_宝华 </h2>
			</div>
    </dl>
    <dl class="list" @scroll="listenScroll">
      <ul>
        <li v-if="list.length" v-for="(item, index) in list">
          <i></i>
          <span class="date">{{ formatDate(item.created_at) }}</span>
          <h2><a :href="item.html_url">{{ item.title }}</a></h2>
          <p>{{ formatAbstract(item.body, index) }}</p>
        </li>
      </ul>
    </dl>

    <button title="to-top" @click="toTop">
      <img src="http://sl-cdn.hingyin.com/o_1but94ecln0s1vi910fgq6s1ed77.png">
    </button>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  beforeMount () {
    const self = this;
    self.listData();
  },
  mounted () {
    const self = this;
    setTimeout(function() {
      self.isLoading = false;
    }, 1500);
  },
  data() {
    return {
      page: 1,
      isLoading: true,
      per_page: 10,
      list: [],
      defaultCovers: [
        'http://sl-cdn.hingyin.com/o_1busqiknpfda5r42194bvo7ac.jpg',
        'http://sl-cdn.hingyin.com/o_1busqkkjh1r7k1cli5nqeqh1sbfh.jpg',
        'http://sl-cdn.hingyin.com/o_1busomv9q19m058jfe11b551fd57.jpg',
        'http://sl-cdn.hingyin.com/o_1busqt6k91hugn4fp84u32ba0m.jpg',
        'http://sl-cdn.hingyin.com/o_1busqtur7ctd156d1h7ah01cikr.jpg',
        'http://sl-cdn.hingyin.com/o_1busr400r1b0qq93edomltm6210.jpeg',
        'http://sl-cdn.hingyin.com/o_1busr5hou1p7n1ijd1hbk1sh7mu915.png'
      ],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  methods: {
    prev() {
      this.page = this.page > 1 ? this.page - 1 : 1;
    },
    next() {
      this.page = this.page + 1;
    },
    listData() {
      const self = this;
      axios.get(`https://api.github.com/repos/issaxite/issaxite.github.io/issues?page=${self.page}&per_page=${self.per_page}`)
      .then(resp => {
        self.list = resp.data;
      });
    },
    formatDate(time) {
      const self = this;
      const date = new Date(time);
      return `${self.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    formatAbstract(text, index) {
      const self = this;
      const pattern = /\!\[.*\]\(.*\)/;
      text = text.slice(0, 200);
      const defaultCoverIndex = Math.floor(Math.random() * self.defaultCovers.length);
      const defaultCover = self.defaultCovers[defaultCoverIndex];
      let cover = text.match(pattern);
      cover = cover ? cover[0].match(/\(.*(?=\))/)[0].slice(1) : defaultCover;
      setTimeout(() => {
        let covers = document.querySelectorAll("#home .list li i");
        covers[index].style.backgroundImage = `url(${cover})`;
      }, 500);

      return text;
    },
    listenScroll(e) {
      const self = this;
      let distance = e.target.scrollTop;
      const isNTop = distance > 0;
      const toTopBtn = document.querySelector("button[title='to-top']");
      isNTop ? toTopBtn.classList.add('active') : toTopBtn.classList.remove('active');
    },
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
  },
  watch: {
    page() {
      // this.listData();
    }
  }
}
</script>

