webpackJsonp([1],{NHnr:function(t,e,n){"use strict";function s(t){n("eEjw")}Object.defineProperty(e,"__esModule",{value:!0});var i=n("7+uW"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},a=[],r={render:o,staticRenderFns:a},c=r,l=n("VU/8"),u=s,p=l(null,c,!1,u,null,null),h=p.exports,g=n("/ocq"),d=n("mtWM"),m=n.n(d),f={beforeMount:function(){var t=this;t.listData().then(function(e){t.list=e.data,setTimeout(function(){t.isLoadingList=!1},4e3)})},mounted:function(){var t=this;setTimeout(function(){t.isLoading=!1},1500);var e=0,n=t.posters.length;setInterval(function(){var s=e%n,i=++e%n;t.posters[s].status=!1,t.posters[i].status=!0},8e3),ga("set","userId",Math.floor(1e8*Math.random()))},data:function(){return{page:1,isLoading:!0,isLoadingList:!0,isMore:!0,isLoadingMore:!1,per_page:10,list:[],defaultCovers:["http://sl-cdn.hingyin.com/o_1busqiknpfda5r42194bvo7ac.jpg","http://sl-cdn.hingyin.com/o_1busqkkjh1r7k1cli5nqeqh1sbfh.jpg","http://sl-cdn.hingyin.com/o_1busomv9q19m058jfe11b551fd57.jpg","http://sl-cdn.hingyin.com/o_1busqt6k91hugn4fp84u32ba0m.jpg","http://sl-cdn.hingyin.com/o_1busqtur7ctd156d1h7ah01cikr.jpg","http://sl-cdn.hingyin.com/o_1busr400r1b0qq93edomltm6210.jpeg","http://sl-cdn.hingyin.com/o_1busr5hou1p7n1ijd1hbk1sh7mu915.png"],posters:[{status:!0,src:"http://sl-cdn.hingyin.com/o_1but067rl5a7onvjfh1b2q1qqf7.jpeg"},{status:!1,src:"http://sl-cdn.hingyin.com/o_1butfcgaa10pg19q1f8hj711v1b7.png"},{status:!1,src:"http://sl-cdn.hingyin.com/o_1butfk3u23nf1pt33tib154odc.png"},{status:!1,src:"http://sl-cdn.hingyin.com/o_1butfnvtsos5vteu0vkpr1fpqm.jpeg"},{status:!1,src:"http://sl-cdn.hingyin.com/o_1butfugpt57i1m871jsn1ka59kp7.png"}],months:["January","February","March","April","May","June","July","August","September","October","November","December"]}},methods:{prev:function(){this.page=this.page>1?this.page-1:1},next:function(){this.page=this.page+1},listData:function(){var t=this;return m.a.get("https://api.github.com/repos/issaxite/issaxite.github.io/issues?page="+t.page+"&per_page="+t.per_page)},formatDate:function(t){var e=this,n=new Date(t);return e.months[n.getMonth()]+" "+n.getDate()+", "+n.getFullYear()},formatAbstract:function(t,e){var n=this,s=/\!\[.*\]\(.*\)/;t=t.slice(0,200);var i=e%n.defaultCovers.length,o=n.defaultCovers[i],a=t.match(s);return a=a?a[0].match(/\(.*(?=\))/)[0].slice(1):o,function(t){setTimeout(function(){document.querySelectorAll("#home .list li i")[t].style.backgroundImage="url("+a+")"},500)}(e),t},listenScroll:function(t){var e=this,n=t.target.scrollTop,s=n>0,i=document.querySelector("button[title='to-top']");s?i.classList.add("active"):i.classList.remove("active");var o=document.querySelector("#home .list");o.scrollHeight-o.clientHeight===n&&e.isMore&&(e.isLoadingMore=!0,e.page=e.page+1,e.listData().then(function(t){e.isMore=t.data.length,e.isMore?setTimeout(function(){e.list=e.list.concat(t.data)},1400):setTimeout(function(){e.isLoadingMore=!1},1400)}))},toTop:function(){var t=document.querySelector("#home .list"),e=t.scrollTop,n=setInterval(function(){e-=60,e=e<0?0:e,t.scrollTop=e,e||clearInterval(n)},1e3/60)},forward:function(t,e){console.log(t,e);var n=!1,s=function(t){n||(n=!0,location.href=t)};setTimeout(function(){s(t)},1e3),ga("send","event",{eventCategory:"Outbound Link",eventAction:"click",eventLabel:e,hitCallback:function(){s(t)}})}},watch:{page:function(){}}},v=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:!t.isLoading,expression:"!isLoading"}],staticClass:"route",attrs:{id:"home"}},[n("dl",{staticClass:"side"},[n("transition-group",{staticClass:"poster",attrs:{tag:"ul",name:"fade"}},t._l(t.posters,function(t,e){return n("li",{directives:[{name:"show",rawName:"v-show",value:t.status,expression:"item.status"}],key:e,style:{backgroundImage:"url("+t.src+")"}})})),t._v(" "),t._m(0)],1),t._v(" "),n("dl",{staticClass:"list",on:{scroll:t.listenScroll}},[t.isLoadingList?n("ul",{staticClass:"list-loading"},t._l(5,function(e){return n("li",{staticClass:"loading"},[n("span"),t._v(" "),t._l(5,function(t){return n("p")})],2)})):t._e(),t._v(" "),t.list.length?n("ul",[t._l(t.list,function(e,s){return n("li",[n("i"),t._v(" "),n("span",{staticClass:"date"},[t._v(t._s(t.formatDate(e.created_at)))]),t._v(" "),n("h2",[n("a",{attrs:{href:"javascript:;",title:e.title,"data-type":"title"},on:{click:function(n){t.forward(e.html_url,e.title)}}},[t._v(t._s(e.title))])]),t._v(" "),n("p",[t._v(t._s(t.formatAbstract(e.body,s)))])])}),t._v(" "),t.isLoadingMore?n("li",{staticClass:"loading"},[n("span"),t._v(" "),t._l(5,function(t){return n("p")})],2):t._e()],2):t._e()]),t._v(" "),n("button",{attrs:{title:"to-top"},on:{click:t.toTop}},[n("img",{attrs:{src:"http://sl-cdn.hingyin.com/o_1but94ecln0s1vi910fgq6s1ed77.png"}})])])},_=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"featured"},[n("span",[t._v("Bio")]),t._v(" "),n("h2",[t._v("I'm isaac_宝华 ")])])}],b={render:v,staticRenderFns:_},y=b,k=n("VU/8"),q=k(f,y,!1,null,null,null),j=q.exports;i.a.use(g.a);var L=new g.a({mode:"history",routes:[{path:"/",name:"home",component:j}]});i.a.config.productionTip=!1,new i.a({el:"#app",router:L,template:"<App/>",components:{App:h}})},eEjw:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.ce339d374a63bf96e49b.js.map