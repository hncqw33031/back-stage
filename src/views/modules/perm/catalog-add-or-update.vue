<template>
  <el-dialog
    :title="!id ? '新增目录' : '修改目录'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="80px">
      <el-form-item label="菜单代码" prop="code">
        <el-input v-model="dataForm.code" placeholder="菜单代码" :disabled="disable"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-popover
          ref="iconListPopover"
          placement="bottom-start"
          trigger="click"
          popper-class="mod-menu__icon-popover">
          <div class="mod-menu__icon-inner">
            <div class="mod-menu__icon-list">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                @click="iconActiveHandle(item)"
                :class="{ 'is-active': item === dataForm.icon }">
                <icon-svg :name="item"></icon-svg>
              </el-button>
            </div>
          </div>
        </el-popover>
        <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标"
                  class="icon-list__input"></el-input>
      </el-form-item>
      <el-form-item label="菜单URL" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单URL"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="perm">
        <el-input v-model="dataForm.perm" placeholder="权限标识"></el-input>
      </el-form-item>
      <el-form-item label="是否隐藏" prop="isHidden">
        <el-switch v-model="dataForm.isHidden"></el-switch>
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
  import Icon from '@/icons'

  export default {
    data() {
      return {
        visible: false,
        disable: false,
        iconList: [],
        id: 0,
        dataForm: {},
        dataRule: {
          code: [
            {required: true, message: '菜单代码不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '菜单名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.iconList = Icon.getNameList()
    },
    methods: {
      close() {
        this.$refs['dataForm'].clearValidate()
        this.dataForm = {}
        this.visible = false
        this.disable = false
      },
      open(id) {
        this.id = id
        if (!id) {
          this.visible = true
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/sys/menu/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.visible = true
            this.disable = true
            this.$set(this.dataForm, 'name', data.data.name)
            this.$set(this.dataForm, 'code', data.data.code)
            this.$set(this.dataForm, 'icon', data.data.icon)
            this.$set(this.dataForm, 'url', data.data.url)
            this.$set(this.dataForm, 'perm', data.data.perm)
            this.$set(this.dataForm, 'sort', data.data.sort)
            if (data.data.isHidden === 0) {
              this.$set(this.dataForm, 'isHidden', false)
            } else {
              this.$set(this.dataForm, 'isHidden', true)
            }
          }
        })
      },
      // 图标选中
      iconActiveHandle(iconName) {
        this.$set(this.dataForm, 'icon', iconName)
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
            'code': this.dataForm.code,
            'url': this.dataForm.url,
            'perm': this.dataForm.perm,
            'sort': this.dataForm.sort,
            'icon': this.dataForm.icon
          }
          if (this.dataForm.isHidden) {
            requestData['isHidden'] = 1;
          } else {
            requestData['isHidden'] = 0;
          }
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/${!this.id ? 'createCatalog' : 'updateMenu'}`),
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

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }

    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }

    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;

      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;

        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }

    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
