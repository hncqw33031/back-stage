<template>
  <div v-if="!ssoEnable" class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">格凡安信管理平台</h2>
          <p class="brand-info__intro">Copyright 2021 格凡安信科技有限公司 版权所有</p>
        </div>
        <div class="login-main">
          <h3 class="login-title">登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                   status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getUUID, getTicketFromLocation} from '@/utils'

  export default {
    data() {
      return {
        ssoEnable: window.SITE_CONFIG['ssoEnable'],
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: ''
      }
    },
    created() {
      if (this.ssoEnable) {
        const ticket = getTicketFromLocation()
        this.$http({
          url: this.$http.adornUrl('/ssoLogin'),
          method: 'post',
          data: this.$http.adornData({
            'ssoCasUrl': window.SITE_CONFIG['ssoCasUrl'],
            'ssoMenuUrl': window.SITE_CONFIG['ssoMenuUrl'],
            'ticket': ticket,
            'ssoAppUrl': window.SITE_CONFIG['ssoAppUrl'],
            'ssoAppName': window.SITE_CONFIG['ssoAppName']
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            sessionStorage.setItem('gaff-token', data.data.token)
            sessionStorage.setItem('gaff-user-info', JSON.stringify(data.data.userInfo))
            this.$router.replace({name: 'home'})
          } else if (data && data.code === 401) {
            window.location.href = window.SITE_CONFIG['ssoCasUrl'] + '/login?service=' + window.SITE_CONFIG['ssoAppUrl']
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.getCaptcha()
      }
    },
    methods: {
      // 提交表单
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/login'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.$md5(this.dataForm.password),
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha.trim()
              })
            }).then(({data}) => {
              if (data && data.code === 200) {
                sessionStorage.setItem('gaff-token', data.data.token)
                sessionStorage.setItem('gaff-user-info', JSON.stringify(data.data.userInfo))
                this.$router.replace({name: 'home'})
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha() {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;

    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }

    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }

    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }

    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }

    .brand-info__text {
      margin: 0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform: uppercase;
    }

    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }

    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }

    .login-title {
      font-size: 16px;
    }

    .login-captcha {
      overflow: hidden;

      > img {
        width: 100%;
        cursor: pointer;
      }
    }

    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
