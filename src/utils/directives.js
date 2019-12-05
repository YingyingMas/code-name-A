import Vue from 'vue'
import store from '../store'

//按钮权限验证指令
Vue.directive('permission', {
  inserted: function (el, binding) {
    var perms = store.getters.perms;
    if (!perms['"' + binding.value + '"']) {
      el.parentNode.removeChild(el);
    }
  }
});
/*设置页面最小高度*/
Vue.directive('minHeight', {
  inserted: function (el, binding) {
    el.style.minHeight = $(window).height() - el.offsetTop - 76 + Number(binding.value) + 'px';
    window.onresize = () => {
      el.style.minHeight = $(window).height() - el.offsetTop - 76 + Number(binding.value) + 'px';
    }
  }
});
/*添加自定义滚动条*/
Vue.directive('scroll', {
  inserted: function (el, binding) {
    $(el).mCustomScrollbar({
      theme: "minimal-dark",
      axis: binding.value || "yx",
      scrollButtons: {
        enable: true,
      },
      mouseWheel: {
        preventDefault: true
      },
      alwaysTriggerOffsets: false
    });
  }
});
