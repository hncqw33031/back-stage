<template>
  <el-dialog
    :title="!id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%"
    @close="close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" :disabled="disable"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-radio-group v-model="dataForm.roleId">
          <el-radio border v-for="role in roleList" :key="role.roleId" :label="role.id">{{ role.roleName }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-cascader v-model="dataForm.deptId" :options="deptList"
                     :props="{ checkStrictly: true, expandTrigger: 'hover' }" clearable></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {isEmail, isMobile} from '@/utils/validate'
  import {cascaderOptions} from '@/utils'

  export default {
    data() {
      const validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        disable: false,
        id: 0,
        roleList: [],
        deptList: [],
        dataForm: {},
        dataRule: {
          userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '角色不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      close() {
        this.$refs['dataForm'].clearValidate()
        this.roleList = []
        this.deptList = []
        this.dataForm = {}
        this.visible = false
        this.disable = false
      },
      open(id) {
        this.id = id
        this.$http({
          url: this.$http.adornUrl('/sys/role/all'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 200 ? data.data : []
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/all'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.deptList = cascaderOptions(data.data, 'id', 'name', 'subDepts')
            }
          })
        }).then(() => {
          if (!id) {
            this.visible = true
            return
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.visible = true
              this.disable = true
              this.$set(this.dataForm, 'userName', data.data.username)
              this.$set(this.dataForm, 'email', data.data.email)
              this.$set(this.dataForm, 'mobile', data.data.mobile)
              this.$set(this.dataForm, 'realName', data.data.realName)
              this.$set(this.dataForm, 'roleId', data.data.roleId)
              this.$set(this.dataForm, 'deptId', data.data.deptId)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return
          }
          const requestData = {
            'id': this.id || null,
            'username': this.dataForm.userName,
            'email': this.dataForm.email,
            'mobile': this.dataForm.mobile,
            'realName': this.dataForm.realName,
            'roleId': this.dataForm.roleId
          }
          if (this.dataForm.deptId) {
            requestData['deptId'] = this.dataForm.deptId[this.dataForm.deptId.length - 1]
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/user/${!this.id ? 'create' : 'update'}`),
            method: 'post',
            data: this.$http.adornData(requestData)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.close()
              this.$emit('refreshDataList')
              this.$success()
            } else {
              this.$error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
