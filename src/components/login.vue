<template>
  <div class="login-container">
    <div class="login-dialog">
      <div class="login-logo"></div>
      <div class="login-title">万里悲秋常作客，百年多病独登台；无边落木萧萧下，不尽长江滚滚来；艰难苦恨繁霜鬓，潦倒新停浊酒杯。</div>
      <div class="login-wrapper">
        <div class="login-content">
          <div class="login-box">
            <el-form
                ref="loginForm"
                :model="lf"
                labelWidth="0">
              <el-row>
                <el-form-item
                    label=""
                    prop="loginCode"
                    :rules="[{ required: true, type:'string',message: '请输入工号',trigger: 'change'}]">
                  <el-input
                      v-model.trim="lf.loginCode"
                      placeholder="工号"
                      :maxlength="20"
                      :autofocus="true"
                      @keyup.enter.native="doLogin">
                    <template slot="append">
                      <i class="login-name" aria-hidden="true"></i>
                    </template>
                  </el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item
                    label=""
                    prop="loginPasswd"
                    :rules="[{ required: true, type:'string',message: '请输入登录密码',trigger: 'change' }]">
                  <el-input
                      v-model.trim="lf.loginPasswd"
                      placeholder="密码"
                      type="password"
                      :maxlength="20"
                      @keyup.enter.native="doLogin">
                    <template slot="append">
                      <i class="login-key" aria-hidden="true"></i>
                    </template>
                  </el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item
                    label=""
                    prop="verifyCode"
                    :rules="[{ required: verifyCodeNeeded, type:'string',message: '请输入验证码',trigger: 'change' }]">
                  <el-input
                      v-model.trim="lf.verifyCode"
                      placeholder="验证码"
                      :maxlength="4"
                      @keyup.enter.native="doLogin">
                    <template slot="append"></template>
                    <template slot="append">
                      <img id="verifyCodeImg" :src="verifyCodeBaseURL" @click="refreshVerifyCode"/>
                    </template>
                  </el-input>
                </el-form-item>
              </el-row>
            </el-form>
            <div class="login-btn">
              <el-button
                  type="primary"
                  @click="doLogin"
                  :disabled="loging"
                  class="login-button">
                <template v-if="loging">
                  <i class="el-icon-loading"></i>
                </template>
                <template v-else>登 录</template>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        appName: APP_NAME,
        lf: {
          loginCode: '',
          loginPasswd: '',
          verifyCode: '',
          rememberMe: false
        },
        verifyCodeBaseURL: '',
        verifyCodeNeeded: true,
        loging: false,
      };
    },
    mounted() {
      this.refreshVerifyCode();
    },
    methods: {
      doLogin() {
        var that = this;
        this.$refs['loginForm'].validate(valid => {
          if (valid) {
            that.loging = true;
            let r = {
              "userInfo": {
                "name": "风暴中心",
              },
              "userName": "碧波淼淼",
              "menus": {
                "menus": [
                  {
                    "menuName": "父",
                    "children": [
                      {
                        "menuName": "子一",
                        "children": [
                          {
                            "menuName": "孙一",
                            "menuUrl": "/a",
                            "menuIcon": "fa fa-id-badge",
                            "id": "1",
                            "menuId": "1",
                          },
                          {
                            "menuName": "孙二",
                            "menuUrl": "/b",
                            "menuIcon": "fa fa-id-badge",
                            "id": "2",
                            "menuId": "2",
                          },
                          {
                            "menuName": "孙三",
                            "menuUrl": "/c",
                            "menuIcon": "fa fa-twitch",
                            "id": "3",
                            "menuId": "3",
                          }
                        ],
                        "id": "4",
                        "menuId": "4",
                      },
                      {
                        "menuName": "子二",
                        "menuUrl": "/d",
                        "id": "5",
                        "menuId": "5",
                      }
                    ],
                    "menuIcon": "fa fa-slideshare",
                    "id": "6",
                    "menuId": "6",
                  },
                  {
                    "menuName": "父",
                    "children": [
                      {
                        "menuName": "子一",
                        "children": [
                          {
                            "menuName": "孙一",
                            "menuUrl": "/a",
                            "menuIcon": "fa fa-id-badge",
                            "id": "11",
                            "menuId": "11",
                          },
                          {
                            "menuName": "孙二",
                            "menuUrl": "/b",
                            "menuIcon": "fa fa-id-badge",
                            "id": "22",
                            "menuId": "22",
                          },
                          {
                            "menuName": "孙三",
                            "menuUrl": "/c",
                            "menuIcon": "fa fa-twitch",
                            "id": "33",
                            "menuId": "33",
                          }
                        ],
                        "id": "44",
                        "menuId": "44",
                      },
                      {
                        "menuName": "子二",
                        "menuUrl": "/d",
                        "id": "55",
                        "menuId": "55",
                      }
                    ],
                    "menuIcon": "fa fa-slideshare",
                    "id": "66",
                    "menuId": "66",
                  }
                ]
              },
            };
            that.$store.commit('user', r);
            that.$router.push('/');
          }
        });
      },
      refreshVerifyCode() {
        $('#verifyCodeImg').attr('src', this.verifyCodeBaseURL + '?t=' + new Date().getTime());
      }
    }
  };
</script>
<style>
  .login-content .login-btn {
    text-align: center;
  }

  .login-content .login-box {
    width: 100%;
  }

  .login-container {
    width: 100%;
    height: 100%;
    background: #fafafa;
    position: relative;
  }

  .login-dialog {
    height: 623px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    background: url('../assets/image/login-bg.jpeg');
    background-size: contain;
  }

  .login-logo {
    width: 47px;
    height: 47px;
    border-radius: 100%;
    background: url('../assets/image/login-logo.png') center no-repeat;
    position: absolute;
    top: -54px;
  }

  .login-title {
    position: absolute;
    color: #585858;
    font-family: '方正准圆简体', 'Microsoft YaHei';
    top: -45px;
    left: 57px;
    font-size: 23px;
    font-weight: 600;
  }

  .login-wrapper {
    width: 1280px;
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .login-content {
    width: 340px;
    height: 310px;
    background: #fafafa;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    opacity: .6;
  }

  .login-content i {
    display: inline-block;
    width: 18px;
    height: 18px;
  }

  .login-content .login-name {
    background: url('../assets/image/login-name.png') no-repeat center;
  }

  .login-content .login-key {
    background: url('../assets/image/login-key.png') no-repeat center;
  }

  .login-content img {
    margin-top: 2px;
  }

  .login-content .login-button {
    width: 276px;
    height: 40px;
    font-size: 16px;
    color: #fff;
    background: #005AB5;
    border: none;
    border-radius: 2px;
  }

  .el-button--primary.is-active,
  .el-button--primary:active {
    background: #005AB5;
  }

  .login-content .el-input__inner {
    height: 34px;
    border: 1px solid #c9c9c9;
    color: #c2c2c2;
    border-right: none;
    padding-left: 8px;
  }

  .login-content > .el-row > .el-col {
    text-align: center;
  }

  .login-content .el-input-group {
    width: 276px;
    margin-left: 31px;
  }

  .login-content .el-form {
    padding-top: 46px;
    box-sizing: border-box;
    padding-bottom: 10px;
  }

  .el-form-item__content {
    line-height: normal;
  }

  .login-content .el-form-item {
    margin-bottom: 20px;
  }

  .login-content .el-input-group__append {
    background: #ffffff;
  }

  .login-content .el-form-item__error {
    left: 40px;
  }

  .el-input-group__append,
  .el-input-group__prepend {
    border: 1px solid #c9c9c9;
    border-left: none;
    border-radius: 2px;
  }

  .el-button--primary:focus,
  .el-button--primary:hover {
    border: none;
    background-color: #003D79;
  }

  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #c9c9c9;
  }

  .el-form-item.is-error .el-input__inner + div,
  .el-form-item.is-error .el-textarea__inner + div {
    border-color: #ff4949;
  }

  .el-input-group--append .el-input__inner,
  .el-input-group__prepend {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
</style>
