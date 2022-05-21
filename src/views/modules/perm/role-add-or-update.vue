<template>
  <el-dialog
    :title="!id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
    @close="close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="角色代码" prop="roleCode">
        <el-input v-model="dataForm.roleCode" placeholder="角色代码" :disabled="disable"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="dataForm.roleDesc" placeholder="角色描述"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="dataForm.note" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="授权" prop="menuIds">
        <el-cascader v-model="dataForm.menuIds" :options="menuList" :props="{ multiple: true, expandTrigger: 'hover' }"
                     collapse-tags clearable></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {cascaderOptions} from '@/utils'

  export default {
    data() {
      return {
        visible: false,
        disable: false,
        id: 0,
        menuList: [],
        dataForm: {},
        dataRule: {
          roleCode: [
            {required: true, message: '角色代码不能为空', trigger: 'blur'}
          ],
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      close() {
        this.$refs['dataForm'].clearValidate()
        this.menuList = []
        this.dataForm = {}
        this.visible = false
        this.disable = false
      },
      open(id) {
        this.id = id
        this.$http({
          url: this.$http.adornUrl('/sys/menu/all'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = cascaderOptions(data.data, 'id', 'name', 'subMenus')
        }).then(() => {
          if (!id) {
            this.visible = true
            return
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/role/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.visible = true
              this.disable = true
              this.$set(this.dataForm, 'roleCode', data.data.role.roleCode)
              this.$set(this.dataForm, 'roleName', data.data.role.roleName)
              this.$set(this.dataForm, 'roleDesc', data.data.role.roleDesc)
              this.$set(this.dataForm, 'note', data.data.role.note)
              if (data.data.menus && data.data.menus.length > 0) {
                const menuIds = [];
                for (let i = 0; i < data.data.menus.length; i++) {
                  const menu = data.data.menus[i]
                  if (menu.subMenus && menu.subMenus.length > 0) {
                    for (let j = 0; j < menu.subMenus.length; j++) {
                      menuIds.push([menu.id, menu.subMenus[j].id])
                    }
                  } else {
                    menuIds.push([menu.id])
                  }
                }
                this.$set(this.dataForm, 'menuIds', menuIds)
              }
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
            'roleCode': this.dataForm.roleCode,
            'roleName': this.dataForm.roleName,
            'roleDesc': this.dataForm.roleDesc,
            'note': this.dataForm.note
          }
          if (this.dataForm.menuIds) {
            const menuIds = [];
            for (let i = 0; i < this.dataForm.menuIds.length; i++) {
              if (this.dataForm.menuIds[i]) {
                for (let j = 0; j < this.dataForm.menuIds[i].length; j++) {
                  if (!menuIds.includes(this.dataForm.menuIds[i][j])) {
                    menuIds.push(this.dataForm.menuIds[i][j])
                  }
                }
              }
            }
            requestData['menuIds'] = menuIds
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/role/${!this.id ? 'create' : 'update'}`),
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
