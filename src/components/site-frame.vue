<template>
  <div style="height: 100%">
    <div class="app-content">
      <div class="app-topbar">
        <div class="app-logo">{{appName}}</div>
        <div class="app-config" v-on:click.stop="stopDivPropagation">
          <el-menu theme="light" class="app-user" mode="horizontal" menu-trigger="click" ref="appUserMenu">
            <el-submenu index="1">
              <template slot="title">
                <div class="app-username app-username-boy">
                  <span class="user-icon"></span>{{user.userName +'800828802'}}
                </div>
              </template>
              <div class="app-loginout-pwd">
                <div>
                  <div class="avatar avatar-boy"></div>
                  <div class="info">
                    <div class="user-name">{{user.userName}}</div>
                    <div class="org-name" v-if="user.userInfo"><i></i>{{user.userInfo.name}}</div>
                  </div>
                </div>
                <div><span v-on:click.stop="logout">退出系统</span></div>
              </div>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <template v-if="displaySubMenus.length > 0">
        <div :class="isCollapse ? 'app-leftbar collapse':'app-leftbar'">
          <div class="menu-toggle" @click="collapse">
            <i class="menu-toggle-icon"></i>
          </div>
          <div class="menu-list">
            <el-menu
                theme="dark"
                ref="elMenuList"
                @open="openMenu"
                @close="closeMenu"
                @select="selectMenu"
                class="app-submenu el-menu-vertical-demo"
                :collapse="isCollapse"
                menu-trigger="click"
                :unique-opened="false"
                :default-active="subMenuDefaultIndex"
                :default-openeds="defaultOpenedsIndex">
              <el-submenu
                  v-for="(subMenu,index) in displaySubMenus"
                  :key="index"
                  :index="subMenu.menuId"
                  v-if="subMenu.children" class="el-submenu-one">
                <template slot="title">
                  <i :class="subMenu.menuIcon||'fa fa-bars'"></i>
                  <span slot="title">{{subMenu.menuName}}</span>
                </template>
                <el-submenu
                    v-for="(subSubMenu,index) in subMenu.children"
                    :key="index"
                    :index="subSubMenu.menuId"
                    v-if="subSubMenu.children"
                    class="el-submenu-two">
                  <span slot="title">{{subSubMenu.menuName}}</span>
                  <el-menu-item
                      v-for="(subSubSubMenu,i) in subSubMenu.children"
                      :key="i"
                      :index="subSubSubMenu.menuId"
                      @click="routerChange(subSubSubMenu.menuUrl)">
                    {{subSubSubMenu.menuName}}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                    :key="index"
                    :index="subSubMenu.menuId"
                    v-else
                    @click="routerChange(subSubMenu.menuUrl)">
                  <span slot="title">{{subSubMenu.menuName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>

        </div>
      </template>
      <div class="app-router-view">
        <div :class="displaySubMenus.length?(isCollapse ? 'right-content right-content-left-small':'right-content right-content-left-big'):'right-content right-content-left-none'">
          <div v-loading="rightContentLoading" class="loading-box">
            <div class="bread-crumb-nav">
              <span v-for="(item,index) in breadCrumbList" :key="index" :index="index" v-html="item.name"></span>
            </div>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import md5 from 'js-md5';

  export default {
    data() {
      return {
        selectedNavName: [],
        selectedNavId: [],
        appName: APP_NAME,
        user: this.$store.getters.user,
        navMenus: this.$store.getters.user.menus.menus,
        isCollapse: false,
        displaySubMenus: [],
        subMenuDefaultIndex: '',
        subMenuDefaultUrl: '',
        defaultOpenedsIndex: [],
        defaultOpenedsArray: [],
        routerPath: '/',
        rightContentLoading: false,
        breadCrumbList: [],
      };
    },
    mounted() {
      this.navMenuSelect('0');
      history.pushState(null, null, document.URL);
      $(window).on('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    },
    watch: {
      '$route'(to, from) {
        if (to.query.flag) {
          let jumpSubMenuFunUrl = to.path;
          this.getNavIdByUrl(this.navMenus, jumpSubMenuFunUrl);
          this.getAllPidByUrl();
          this.breadCrumbListChangeToStr();
          sessionStorage.setItem('menuSelectedId', this.subMenuDefaultIndex);
        }
        if (to.path == '/') {
          this.$router.push(this.routerPath);
        } else {
          Vue.nextTick(() => {
            this.rightContentLoading = false;
          })
        }
      }
    },
    methods: {
      /*根据url获取id-----设置菜单选中*/
      getNavIdByUrl(arr, selectedKey) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].menuUrl == selectedKey) {
            this.subMenuDefaultIndex = arr[i].menuId;
          } else {
            if (arr[i].children) {
              this.getNavIdByUrl(arr[i].children, selectedKey);
            }
          }
        }
      },
      /*路由改变*/
      routerChange(path) {
        if (this.$route.path == path.split('?')[0]) {
          this.rightContentLoading = true;
          this.routerPath = path;
          this.$router.push('/');
          return;
        }
        this.$router.push(path);
      },
      /*展开菜单*/
      openMenu(key, keyPath) {
        this.defaultOpenedsArray = this.defaultOpenedsArray || [];
        this.defaultOpenedsArray = _.uniq(this.defaultOpenedsArray.concat(keyPath))
        this.defaultOpenedsIndex = this.defaultOpenedsArray;
      },
      /*关闭菜单*/
      closeMenu(key, keyPath) {
        this.defaultOpenedsArray = _.remove(this.defaultOpenedsArray, function (i) {
          return i != keyPath;
        });
        this.defaultOpenedsIndex = this.defaultOpenedsArray;
      },
      /*菜单选中*/
      selectMenu(key, keyPath) {
        sessionStorage.setItem('menuSelectedId', key);
        this.selectedNavName = [];
        keyPath.forEach((ele, idx) => {
          this.getNavNameById(this.navMenus, ele);
        });
        this.breadCrumbListChangeToStr();
        this.subMenuDefaultIndex = key;
        if (this.isCollapse) {
          this.defaultOpenedsArray = _.uniq(this.defaultOpenedsArray.concat(keyPath));
          this.defaultOpenedsIndex = this.defaultOpenedsArray;
        }
        this.addLeftScroll();
      },
      /*面包屑拼接*/
      breadCrumbListChangeToStr() {
        this.breadCrumbList = [];
        this.selectedNavName.forEach((ele, idx) => {
          let o = {};
          if (idx == this.selectedNavName.length - 1) {
            o.name = ele;
          } else {
            o.name = ele + '&nbsp;&nbsp;' + '＞';
          }
          this.breadCrumbList.push(o);
        });
      },
      /*根据id获取name-----设置面包屑*/
      getNavNameById(arr, selectedKey) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].menuId == selectedKey) {
            this.selectedNavName.push(arr[i].menuName)
            this.selectedNavId.push(arr[i].supmenuId)
          } else {
            if (arr[i].children) {
              this.getNavNameById(arr[i].children, selectedKey);
            }
          }
        }
      },
      /*根据id获取所有父级id----设置菜单自动展开*/
      getAllPidByUrl(arr, selectedKey) {
        this.selectedNavId = [];
        this.selectedNavName = [];
        this.getNavNameById(this.navMenus, this.subMenuDefaultIndex);
        if (this.selectedNavId[0]) {
          this.getNavNameById(this.navMenus, this.selectedNavId[0]);
        }
        if (this.selectedNavId[1]) {
          this.getNavNameById(this.navMenus, this.selectedNavId[1]);
        }
        _.reverse(this.selectedNavName)
      },
      //折叠导航栏
      collapse() {
        this.isCollapse = !this.isCollapse;
        if (this.isCollapse) {
          $('body').addClass('small-left-meau-style')
          $('.app-content .left-nav').addClass('small-nav');
          $('.attr-container-comment-style').addClass('small-left');
        } else {
          $('body').removeClass('small-left-meau-style')
          $('.app-content .left-nav').removeClass('small-nav');
          $('.attr-container-comment-style').removeClass('small-left');
          this.defaultOpenedsIndex = [];
          Vue.nextTick(() => {
            this.defaultOpenedsIndex = this.defaultOpenedsArray;
          })

        }
      },
      stopDivPropagation() {
      },
      logout() {
        var that = this;
        this.$confirm('确认要退出吗?', '注销', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$router.push('/login');
          that.$store.commit('user', []);
          sessionStorage.clear();
        });
      },
      /*左侧菜单添加滚动条*/
      addLeftScroll() {
        $('.app-leftbar .menu-list').mCustomScrollbar({
          theme: "light-thin",
          axis: "y",
          scrollInertia: 0.05,
        });
      },
      /*根据id获取url*/
      getNavUrlById(arr, id) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].menuId == id) {
            this.routerPath = arr[i].menuUrl;
          } else {
            if (arr[i].children) {
              this.getNavUrlById(arr[i].children, id);
            }
          }
        }
      },
      /*初始化菜单*/
      navMenuSelect(index) {
        let menuSelectedId = sessionStorage.getItem('menuSelectedId');
        this.displaySubMenus = this.navMenus;
        if (menuSelectedId) {
          this.subMenuDefaultIndex = menuSelectedId;
          this.getAllPidByUrl();
          this.defaultOpenedsArray = this.defaultOpenedsIndex.concat(this.selectedNavId)
          this.breadCrumbListChangeToStr();
          if (this.routerPath == '/') {
            this.getNavUrlById(this.navMenus, menuSelectedId);
            this.$router.push(this.routerPath);
          }
        } else {
          Vue.nextTick(() => {
            this.$router.push(this.subMenuDefaultUrl);//默认选中的路由
            if (this.navMenus[index].children && this.navMenus[index].children.length > 0) {
              let firstSubMenu = this.navMenus[index].children[0];
              if (firstSubMenu.children && firstSubMenu.children.length > 0) {
                this.subMenuDefaultUrl = firstSubMenu.children[0].menuUrl;
                this.subMenuDefaultIndex = firstSubMenu.children[0].menuId;
                this.defaultOpenedsIndex = this.defaultOpenedsArray = [firstSubMenu.menuId, this.navMenus[index].menuId]
                this.breadCrumbList = [{"name": "" + this.navMenus[index].menuName + " > "}, {"name": "" + firstSubMenu.menuName + " > "}, {"name": "" + firstSubMenu.children[0].menuName + ""}]
              } else {
                this.subMenuDefaultUrl = firstSubMenu.menuUrl;
                this.subMenuDefaultIndex = firstSubMenu.menuId;
                this.defaultOpenedsIndex = this.defaultOpenedsArray = [this.navMenus[index].menuId];
                this.breadCrumbList = [{"name": "" + this.navMenus[index].menuName + " > "}, {"name": "" + firstSubMenu.menuName}]
              }
              this.$router.push(this.subMenuDefaultUrl);
            } else {
              this.subMenuDefaultUrl = this.navMenus[index].menuUrl;
              this.subMenuDefaultIndex = this.navMenus[index].menuId;
              this.breadCrumbList = [{"name": "" + this.navMenus[index].menuName}]
              this.$router.push(this.subMenuDefaultUrl);
            }
          })
        }
        Vue.nextTick(() => {
          this.addLeftScroll();
          $("body").bind("click", () => {
            if (this.$refs['appUserMenu']) {
              this.$refs['appUserMenu'].close('1');
            }
          });
        })
      }
    }
  }
</script>
<style>
  .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
    width: 4px;
  }

  .mCustomScrollbar > .mCustomScrollBox > .mCSB_scrollTools.mCSB_scrollTools_onDrag,
  .mCustomScrollbar > .mCustomScrollBox ~ .mCSB_scrollTools.mCSB_scrollTools_onDrag,
  .mCustomScrollBox:hover > .mCSB_scrollTools,
  .mCustomScrollBox:hover ~ .mCSB_scrollTools,
  .mCS-autoHide:hover > .mCustomScrollBox > .mCSB_scrollTools,
  .mCS-autoHide:hover > .mCustomScrollBox ~ .mCSB_scrollTools {
    opacity: 0.3 !important;
    filter: "alpha(opacity=100)";
    -ms-filter: "alpha(opacity=100)";
  }

  .small-left-meau-style .app-leftbar .mCustomScrollBox,
  .small-left-meau-style .app-leftbar .mCSB_container {
    overflow: inherit;
  }

  .app-content .app-leftbar * {
    transition: unset !important;
    animation: unset !important;
  }

  .app-nav .top-notice {
    height: 42px;
    font-size: 12px;
    color: #fff;
  }

  .app-nav .top-notice ul li {
    padding-left: 30px;
    line-height: 42px;
    display: block;
    width: 800px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .app-topbar .app-username {
    background: #393e42 url('../assets/image/login-boy.jpg') no-repeat left center;
    background-size: 32px 32px;
    padding-left: 36px;
  }

  .app-topbar .app-username-boy {
    background: #3c4043 url('../assets/image/login-boy.jpg') no-repeat left center;
    background-size: 32px 32px;
  }

  .app-topbar .app-username-girl {
    background: #3c4043 url('../assets/image/login-girl.jpg') no-repeat left center;
    background-size: 32px 32px;
  }

  /*面包屑------------------------*/
  .app-content .right-content .loading-box {
    height: 100%;
    position: relative;
    padding-top: 30px;
    box-sizing: border-box;
  }

  .app-content .bread-crumb-nav {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 260;
    font-size: 12px;
    padding-left: 20px;
    width: 100%;
    height: 30px;
    background: #f3f2f2 url('../assets/image/positioning-icon.png') no-repeat 8px 8px;
  }

  .app-content .bread-crumb-nav span {
    display: inline-block;
    color: #999;
    height: 30px;
    line-height: 30px;
    transform: scale(0.9, 0.9);
  }

  /*面包屑------------------------*/

  .app-content .attr-container-comment-style.small-left {
    padding-left: 50px !important;
  }

  .modify-keyword .el-dialog--tiny {
    width: 500px;
  }

  .modify-keyword .el-dialog {
    width: 510px;
  }

  .modify-keyword .el-dialog--tiny .el-input__inner {
    width: 310px;
    height: 38px;
    font-size: 13px;
    color: #333;
    background-color: #f4f5f7;
    border: 1px solid #e1edff;
    padding-left: 8px;
  }

  input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: #f4f5f7 !important;
  }

  .modify-keyword .el-input {
    width: 310px;
    margin-left: -7px;
  }

  .modify-keyword .el-form-item__label {
    width: 111px !important;
  }

  .modify-keyword .el-form-item {
    margin-bottom: 32px;
  }

  .modify-keyword .el-dialog__body {
    padding-bottom: 0;
    margin-left: 16px;
  }

  .modify-keyword .el-dialog__footer {
    padding-bottom: 34px;
    margin-top: -10px;
  }

  .app-leftbar .mCSB_container_wrapper {
    width: 100%;
    overflow: inherit;
  }

  .app-leftbar .el-icon-arrow-right:before {
    content: "";
  }

  .app-leftbar .mCSB_scrollTools {
    width: 6px;
  }

  .app-leftbar .mCSB_scrollTools .mCSB_buttonUp,
  .app-leftbar .mCSB_scrollTools .mCSB_draggerRail {
    display: none !important;
  }

  .app-leftbar .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
    width: 4px;
  }

  .el-submenu__title {
    background-color: #424c5c;
  }

  .el-submenu-two .el-submenu__title {
    background-color: #333a45;
  }

  .app-content .el-menu {
    background-color: #333a45;

  }

  .el-submenu-one .el-submenu__title .el-submenu__icon-arrow,
  .el-submenu-one .el-submenu__title .el-icon-arrow-down {
    width: 5px;
    height: 7px;
    left: 165px;
    background: url("../assets/image/left-menu-arrow.png") no-repeat;
  }

  .el-submenu-two .el-submenu__title .el-submenu__icon-arrow,
  .el-submenu-two .el-submenu__title .el-icon-arrow-down {
    background: url("../assets/image/left-menu-arrow.png") no-repeat;
  }

  .el-icon-arrow-down:before {
    content: '';
  }

  .app-leftbar .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(90deg);
  }

  .el-menu-item > i,
  .el-submenu__title > i,
  .el-submenu__title > span,
  .el-menu-item > span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 14px;
  }

  .collapse .el-menu-item > i,
  .collapse .el-submenu__title > i,
  .collapse .el-submenu__title > span,
  .collapse .el-menu-item > span {
    position: static;
  }

  .el-submenu__icon-arrow {
    right: 10px;
    margin-top: 2px;
  }

  .app-content .el-submenu-two .el-submenu__title {
    color: #fff;
  }

  .app-content .el-submenu-one .el-menu-item,
  .app-content .el-submenu-two .el-menu-item {
    color: #b6bbce;
  }

  .el-menu-item > i {
    left: 20px;
  }

  .collapse .el-submenu__title > i {
    left: 20px;
  }

  .el-submenu__title > span,
  .el-menu-item > span {
    left: 40px;
  }

  .app-content .menu-toggle-icon {
    width: 10px;
    height: 10px;
    display: inline-block;
    background: url("../assets/image/menu-toggle-icon.png") no-repeat center;
  }

  .app-content .menu-toggle-icon:hover {
    background: url("../assets/image/menu-toggle-icon-hover.png") no-repeat center;
  }

  .app-content .el-menu--collapse .menu-toggle-icon {
    background: url("../assets/image/menu-toggle-icon-simple.png") no-repeat center;
  }

  .app-content .el-menu--collapse .menu-toggle-icon:hover {
    background: url("../assets/image/menu-toggle-icon-simple-hover.png") no-repeat center;
  }

  .app-content {
    height: 100%;
    position: relative;
  }

  .app-content .left-nav {
    width: 184px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .app-content .left-nav.small-nav {
    width: 50px;
  }

  .app-content .el-menu .menu-toggle i {
    color: #aeb8bf;
    font-size: 9px;
    font-style: normal;
    cursor: pointer;
  }

  .app-content .el-menu-item i {
    display: inline-block;
    width: 8px;
    height: 12px;
  }

  .app-content .el-menu-item .el-tooltip {
    text-align: center;
  }

  .app-content .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 184px;
  }

  .app-content .el-menu-vertical-demo:not(.el-menu--collapse), .el-menu--collapse {
    height: 100%;
    border: 0;
    box-sizing: border-box;
    border-bottom: 15px solid #424c5c;
  }

  .app-content .menu-toggle {
    height: 30px;
    position: absolute;
    background-color: #4b5462;
    top: 42px;
    width: 100%;
    z-index: 999;
    cursor: pointer;
  }

  .el-menu--collapse li .el-submenu__title .fa,
  .app-content .menu-toggle i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .app-content .right-content {
    width: 100%;
    height: 100%;
  }

  .app-content .right-content-left-big {
    padding-left: 184px;
    box-sizing: border-box;
    padding-top: 42px;
    background: #fff;
  }

  .app-content .right-content-left-small {
    padding-left: 50px;
    box-sizing: border-box;
    padding-top: 42px;
  }

  .app-content .right-content-left-none {
    padding-left: 0;
  }

  .app-content .el-menu-item,
  .app-content .el-submenu__title {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #e7e9f1;
  }

  .app-content .el-menu-item {
    padding-left: 52px !important;
  }

  .el-menu-item:focus,
  .app-content .el-menu--horizontal.el-menu--dark
  .el-submenu .el-menu-item.is-active,
  .el-menu-item.is-active {
    color: #fff !important;
    background-color: #AD5A5A;
  }

  .app-content .menu-icon-collapse {
    display: inline-block;
    height: 100%;
    width: 20px;
    background: url("../assets/image/character-icon.png") no-repeat center;
  }

  .app-topbar .app-loginout-pwd {
    width: 248px;
    box-sizing: border-box;
  }

  .app-topbar .app-loginout-pwd > div:first-child {
    background-color: #333;
    font-size: 12px;
    color: #F75000;
    overflow: hidden;
  }

  .app-topbar .app-loginout-pwd > div:first-child .avatar {
    height: 63px;
    width: 63px;
    float: left;
    background: url("../assets/image/login-boy.jpg") no-repeat center;
    background-size: 100% 100%;
    margin: 12px 16px 26px 12px;
  }

  .app-topbar .app-loginout-pwd > div:first-child .avatar-boy {
    background-image: url("../assets/image/login-boy.jpg");
  }

  .app-topbar .app-loginout-pwd > div:first-child .avatar-girl {
    background: url("../assets/image/login-girl.jpg") no-repeat center;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info {
    float: left;
    width: 150px;
    height: 100%;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info div {
    line-height: normal;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info div {
    margin-bottom: 10px;
    padding-left: 25px;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info div {
    background: url("../assets/image/character-icon.png") no-repeat 0px 2px;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info div:nth-child(2) {
    background: url("../assets/image/department-icon.png") no-repeat 0px 2px;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info div.user-name {
    background: none;
    padding-left: 0;
  }

  .app-topbar .app-loginout-pwd > div:first-child .info .user-name {
    font-size: 14px;
    color: #fff;
    margin: 10px auto 13px;
  }

  .app-topbar .app-loginout-pwd > div:nth-child(2) {
    padding-left: 18px;
    height: 46px;
    line-height: 46px;
    border-bottom: 1px solid #333;
    font-size: 12px;
    color: #bababa;
    text-align: left;
  }

  .app-topbar .app-loginout-pwd > div:last-child {
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 12px;
    color: #616161;
    background: #252525;
  }

  .app-topbar .app-loginout-pwd > div:nth-child(2) span {
    margin-left: 13px;
    cursor: pointer;
  }

  .app-topbar .app-loginout-pwd > div:last-child span {
    cursor: pointer;
  }

  .app-topbar .app-loginout-pwd > div:last-child:hover {
    color: #d1d1d1;
  }

  .user-icon {
    height: 14px;
    width: 1px;
    display: inline-block;
    margin-right: 10px;
  }

  .app-topbar {
    width: 100%;
    height: 42px;
    background-color: #3c4043;
    position: absolute;
    top: 0;
    z-index: 1999;
    min-width: 1280px;
  }

  .el-menu {
    background-color: #333;
  }

  .app-topbar .app-logo {
    width: 169px;
    float: left;
    margin-left: 8px;
    background: url("../assets/image/login-logo.png") no-repeat left center;
    padding-left: 38px;
    font-size: 17px;
    height: 100%;
    line-height: 42px;
    color: #ffffff;
    background-size: 28px 28px;
    /*cursor: pointer;*/
  }

  .app-topbar .app-nav {
    float: left;
    height: 42px;
    overflow: hidden;
  }

  .app-topbar .app-menu .el-menu-item {
    height: 42px;
    line-height: 42px;
    overflow: hidden;
  }

  .el-menu-item,
  .el-submenu__title {
    color: #e7e7e7;
    padding: 0 14px;
  }

  .el-submenu__title {
    padding: 0 !important;
  }

  .el-menu--horizontal .el-submenu.is-opened .el-submenu__icon-arrow {
    margin-top: 0;
  }

  .el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
    color: #e7e7e7;
    margin-top: 10px;
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url("../assets/image/select-arrow.png") no-repeat;
  }

  .el-menu--horizontal > .el-menu-item:hover, .el-menu--horizontal > .el-submenu.is-active .el-submenu__title, .el-menu--horizontal > .el-submenu:hover .el-submenu__title, .el-menu--horizontal .el-menu-item {
    border: none;
  }

  .el-menu--horizontal .el-submenu .el-submenu__title:hover,
  .el-submenu .el-submenu__title:hover,
  .el-submenu .el-menu-item:hover {
    background-color: #495a75;
  }

  .app-topbar .app-menu .el-menu-item.is-active, .app-topbar .app-menu .el-menu-item.is-active:hover {
    background: #292929;
    color: #ffffff;
    font-weight: normal;
    border-bottom: 3px solid #f29500;
  }

  .app-topbar .app-menu .el-menu-item {
    font-size: 14px;
    border-left: 1px solid #2a2a2a;
    border-bottom-width: 2px;
  }

  .app-topbar .app-menu .el-menu-item:hover {
    border-bottom-width: 2px;
    color: #fff;
  }

  .app-topbar .app-config {
    float: right;
  }

  .app-topbar .app-user, .app-topbar .el-submenu__title {
    height: 42px !important;
    line-height: 42px !important;
    box-sizing: border-box;
  }

  .app-topbar .app-user.el-menu--horizontal .el-submenu > .el-menu {
    top: 42px !important;
    left: auto !important;
    right: 0;
    box-shadow: none;
    background: #eef1f6;
    padding: 0;
    border: none;
    border-top: 1px solid #333;
    z-index: 99999;
  }

  .app-topbar .app-user .el-submenu__title {
    border: none !important;
  }

  .app-topbar .app-user .el-submenu__title:hover, .app-user .el-submenu:hover .el-submenu__title {
    border: none !important;
    background-color: #3c4043;
  }

  .app-topbar .app-user .el-submenu > .el-menu .el-menu-item {
    background: none;
    color: #5f5f5f;
    height: 42px;
    line-height: 42px;
    margin: 0px 2px 0px 2px;
  }

  .app-topbar .app-user .el-submenu > .el-menu .el-menu-item:hover, .app-user .el-submenu > .el-menu .el-menu-item.is-active:hover {
    color: #AD5A5A;
    background: none;
  }

  .app-topbar .app-user .el-submenu > .el-menu .el-menu-item.is-active {
    color: #AD5A5A;
  }

  .app-topbar .app-username {
    font-size: 14px;
    float: left;
  }

  .app-submenu {
    height: 100%;
    border-radius: 0px !important;
  }

  .is-opened > .el-submenu__title > .el-icon-arrow-down {
    margin-top: -4px;
  }

  .app-content {
    float: right;
    width: 100%;
    height: 100%;
  }

  .app-router-view {
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    overflow: hidden;
  }

  .el-menu--collapse .el-menu .el-submenu {
    min-width: inherit;
  }

  .app-content .collapse .el-menu-item {
    padding: 0 15px !important;
  }

  .collapse .el-submenu-two .el-submenu__title {
    padding: 0 15px !important;
  }

  .collapse .el-submenu-two .el-submenu__title .el-submenu__icon-arrow,
  .collapse .el-submenu-two .el-submenu__title .el-icon-arrow-down {
    left: auto;
    right: 4px;
    position: absolute;
    transform: translateY(-50%) !important;
  }

  .app-leftbar {
    height: 100%;
    padding-top: 72px;
    width: 184px;
    position: absolute;
    z-index: 998;
    box-sizing: border-box;
  }

  .app-leftbar .menu-list {
    height: 100%;
    width: 100%;
    background-color: #424c5c;
    /*box-sizing: border-box;*/
  }

  .app-leftbar .mCSB_scrollTools {
    opacity: 0.3;
  }

  .app-leftbar.collapse {
    width: 50px;
  }

  .el-menu--collapse {
    width: 50px;
  }

  .el-form-item__content .el-form-item__error {
    padding-left: 0%;
  }

  .el-pagination {
    margin-top: 10px;
    float: right;
  }

  .app-topbar .app-user .el-submenu__title {
    background: #3c4043;
    color: #f0f0f0;
  }

  .app-topbar .el-icon-caret-bottom:before {
    content: '';
    display: inline-block;
    width: 13px;
    height: 12px;
    background: url("../assets/image/login-arrow-icon.png") no-repeat center;
  }

  .el-menu--horizontal .el-submenu:focus > .el-submenu__title {
    color: #f0f0f0;
  }

  .el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
    margin-left: 20px;
    margin-right: 12px;
  }

  .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    color: #bfcbd9;
  }
</style>
