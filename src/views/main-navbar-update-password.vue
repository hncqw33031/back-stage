<template>
  <el-dialog
    width="400px"
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {clearLoginInfo} from '@/utils'

  export default {
    data() {
      const validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
        ssoEnable: window.SITE_CONFIG['ssoEnable'],
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            {required: true, message: '原密码不能为空', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '新密码不能为空', trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {validator: validateConfirmPassword, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      userName: {
        get() {
          return this.$store.state.user.name
        }
      },
      mainTabs: {
        get() {
          return this.$store.state.common.mainTabs
        },
        set(val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      }
    },
    methods: {
      // 初始化
      init() {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit() {
        let url = '/sys/user/password'
        const requestData = {
          'password': this.$md5(this.dataForm.password),
          'newPassword': this.$md5(this.dataForm.newPassword)
        }
        if (this.ssoEnable) {
          url = '/ssoPassword'
          requestData['ssoMenuUrl'] = window.SITE_CONFIG['ssoMenuUrl']
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(url),
              method: 'post',
              data: this.$http.adornData(requestData)
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.visible = false
                this.$success()
                this.$nextTick(() => {
                  this.mainTabs = []
                  clearLoginInfo()
                  if (this.ssoEnable) {
                    window.location.href = window.SITE_CONFIG['ssoCasUrl'] + '/logout?service=' + window.SITE_CONFIG['ssoAppUrl']
                  } else {
                    this.$router.replace({name: 'login'})
                  }
                })
              } else {
                this.$error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-input {
    width: 260px;
  }
</style>
