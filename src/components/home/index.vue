<template>
  <div id="home" class="route" v-show="!isLoading">
    <ul v-if="list.length">
      <li :key="index" v-for="(item, index) in list">
        <i></i>
        <span class="date">{{ formatDate(item.created_at) }}</span>
        <h2><a href="javascript:;" :title="item.title" data-type="title" @click="forward(item.html_url, item.title)">{{ item.title }}</a></h2>
        <p>{{ formatAbstract(item.body, index) }}</p>
      </li>
      <li class="loading" v-if="isLoadingMore">
        <span></span>
        <p :key="p" v-for="p in 5"></p>
      </li>
    </ul>
  </div>
</template>
<script>
// import marky from 'marky-markdown';
import axios from 'axios';
export default {
  beforeMount () {
    const self = this;
    self.listData()
    .then(resp => {
      self.list = resp.data;
      setTimeout(function() {
        self.isLoadingList = false;
      }, 4000);
    });
  },
  mounted () {
    const self = this;
    setTimeout(function() {
      self.isLoading = false;
    }, 1500);
    // ga('set', 'userId', Math.floor(Math.random() * 100000000));
  },
  data() {
    return {
      page: 1,
      isLoading: true,
      isLoadingList: true,
      isMore: true,
      isLoadingMore: false,
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
      return axios.get(`/repos/issaxite/issaxite.github.io/issues?page=${self.page}&per_page=${self.per_page}`);
    },
    formatDate(time) {
      const self = this;
      const date = new Date(time);
      return `${self.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    formatAbstract(text, index) {
      const self = this;
      const pattern = /!\[.*\]\(.*\)/;
      text = text.slice(0, 200);
      const defaultCoverIndex = index % self.defaultCovers.length;
      const defaultCover = self.defaultCovers[defaultCoverIndex];
      let cover = text.match(pattern);
      cover = cover ? cover[0].match(/\(.*(?=\))/)[0].slice(1) : defaultCover;
      (index => {
        setTimeout(() => {
          let covers = document.querySelectorAll("#home .list li i");
          covers[index].style.backgroundImage = `url(${cover})`;
        }, 500);
      })(index);
      // console.log(marky(text));
      return text;
    },
    listenScroll(e) {
      const self = this;
      let distance = e.target.scrollTop;
      const isNTop = distance > 0;
      const toTopBtn = document.querySelector("button[title='to-top']");
      isNTop ? toTopBtn.classList.add('active') : toTopBtn.classList.remove('active');
      const list = document.querySelector('#home .list');
      const isBottom = list.scrollHeight - list.clientHeight === distance;
      if(isBottom && self.isMore) {
        const delay = 1400;
        self.isLoadingMore = true;
        self.page = self.page + 1;
        self.listData()
        .then(resp => {
          self.isMore = resp.data.length;
          if(self.isMore) {
            setTimeout(function() {
              self.list = self.list.concat(resp.data);
            }, delay);
          } else {
            setTimeout(function() {
              self.isLoadingMore = false;
            }, delay);
          }
        });
      }
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
    },
    forward(link) {
      const overtime = 1000;
      let isFrowarded = false;
      let _forward = function(link) {
        if(!isFrowarded) {
          isFrowarded = true;
          location.href = link;
        }
      };
      setTimeout(function(){
        _forward(link);
      }, overtime);
      // ga('send', 'event', {
      //   eventCategory: 'Outbound Link',
      //   eventAction: 'click',
      //   eventLabel: label,
      //   hitCallback: function() {
      //     _forward(link);
      //   }
      // });
    }
  },
  watch: {
    page() {
      // this.listData();
    }
  }
}
</script>
