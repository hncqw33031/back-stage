<template>
  <el-dialog
    :title="!id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="字典名称" prop="dictKey">
        <el-input v-model="dataForm.dictKey" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="dictValue">
        <el-input v-model="dataForm.dictValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="字典描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="dataForm.note" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        id: 0,
        dataForm: {},
        dataRule: {
          dictKey: [
            {required: true, message: '字典名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      close() {
        this.$refs['dataForm'].clearValidate()
        this.dataForm = {}
        this.visible = false
      },
      open(id) {
        this.id = id
        if (!id) {
          this.visible = true
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/sys/dict/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.visible = true
            this.$set(this.dataForm, 'dictKey', data.data.dictKey)
            this.$set(this.dataForm, 'dictValue', data.data.dictValue)
            this.$set(this.dataForm, 'description', data.data.description)
            this.$set(this.dataForm, 'note', data.data.note)
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/dict/${!this.id ? 'create' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.id || null,
              'dictKey': this.dataForm.dictKey,
              'dictValue': this.dataForm.dictValue,
              'description': this.dataForm.description,
              'note': this.dataForm.note
            })
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
