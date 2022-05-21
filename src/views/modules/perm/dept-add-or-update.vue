<template>
  <el-dialog
    :title="!id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId">
        <el-cascader v-model="dataForm.parentId" :options="deptList"
                     :props="{ checkStrictly: true, expandTrigger: 'hover' }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序号"></el-input-number>
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
        id: 0,
        deptList: [],
        dataForm: {},
        dataRule: {
          name: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      close() {
        this.$refs['dataForm'].clearValidate()
        this.deptList = []
        this.dataForm = {}
        this.visible = false
      },
      open(id) {
        this.id = id
        this.$http({
          url: this.$http.adornUrl('/sys/dept/all'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.deptList = cascaderOptions(data.data, 'id', 'name', 'subDepts')
          }
        }).then(() => {
          if (!id) {
            this.visible = true
            return
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/dept/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.visible = true
              this.$set(this.dataForm, 'name', data.data.name)
              this.$set(this.dataForm, 'parentId', data.data.parentId)
              this.$set(this.dataForm, 'sort', data.data.sort)
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
            'name': this.dataForm.name,
            'sort': this.dataForm.sort
          }
          if (this.dataForm.parentId) {
            if (Array.isArray(this.dataForm.parentId)) {
              requestData['parentId'] = this.dataForm.parentId[this.dataForm.parentId.length - 1]
            } else {
              requestData['parentId'] = this.dataForm.parentId
            }
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/dept/${!this.id ? 'create' : 'update'}`),
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
