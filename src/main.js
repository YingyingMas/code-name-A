import Vue from 'vue';
import VueRouter from 'vue-router';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css'
import $ from 'jquery';
import MCustomScrollbar from 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js';
import BaseRouter from './routers/base-router';
import PageRouter from './routers/page-router';
import ElementUI from 'element-ui';
import DateUtils from './utils/date-utils';
import MountUtils from './utils/ordinary-util';
import _ from 'lodash';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import '../plugins/jquery-ui-1.12.1/jquery-ui.min'
import store from './store';
import App from './App.vue';
import commonComponents from './components/common/index';
import './utils/directives'
import './utils/filters'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(DateUtils);
Vue.use(MountUtils);
Vue.use(MCustomScrollbar);
Vue.use(_);
Vue.use(commonComponents);
Vue.config.productionTip = false;
//Ajax全局设置
$.ajaxSetup({
  timeout: 90000,
  dataType: 'json',
  crossDomain: CROSS_DOMAIN,
  cache: false,
  ifModified: true,
  xhrFields: {
    withCredentials: CROSS_DOMAIN
  },
  beforeSend: (xhr, settings) => {
    settings.url = BASE_URL + settings.url;
  },
  error: (xhr) => {
    if (xhr.responseJSON) {
      var data = xhr.responseJSON.data;
      if (data.records && data.records[0] && data.records[0].needLogin) {
        vm.$router.push({path: '/login', query: {timeout: true}});
      } else {
        vm.$message.warning(xhr.responseJSON.message);
      }
    } else {
      if (xhr.statusText !== 'abort') vm.$message.warning(xhr.statusText);
    }
  },
  success: (data, textStatus, jqXHR) => {
    if (!data.success) {
      vm.$message.warning(data.message);
      var data = data.data ? data.data.records[0] : [];
      if (data.needLogin) {
        vm.$router.push('/login');
      }
    }
  }
});


//定义路由
var frameRouters = BaseRouter[1].children;
frameRouters = frameRouters.concat(PageRouter);
BaseRouter[1].children = frameRouters;
const router = new VueRouter({
  routes: BaseRouter
});


//登录拦截
router.beforeEach((to, from, next) => {
  next();
});


//定义应用
var vm = new Vue({
  router,
  store,
  el: '#code-name-a',
  render: h => h(App),
  mounted: function () {
    $('title').html(APP_NAME);
  }
});

