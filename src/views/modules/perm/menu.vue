<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateCatalogHandle()">新增目录</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="id"
      border
      :max-height="maxHeight"
      :tree-props="{children: 'subMenus'}"
      style="width: 100%; ">
      <el-table-column prop="name" header-align="center" min-width="100" label="菜单名称"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="菜单代码"></el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="120"
                       label="上级菜单"></el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else size="small" type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" header-align="center" align="center" width="150" :show-overflow-tooltip="true"
                       label="菜单URL"></el-table-column>
      <el-table-column prop="perm" header-align="center" align="center" width="150" label="权限标识"></el-table-column>
      <el-table-column prop="isHidden" header-align="center" align="center" label="是否隐藏">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isHidden === 0" size="small">展示</el-tag>
          <el-tag v-else size="small" type="success">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" label="排序号"></el-table-column>
      <el-table-column header-align="center" align="center" width="260" label="操作">
        <template slot-scope="scope">
          <template>
            <el-button v-if="scope.row.type === 0" size="mini" @click="addOrUpdateCatalogHandle(scope.row.id)">修改
            </el-button>
            <el-button v-else size="mini"
                       @click="addOrUpdateMenuHandle(scope.row.id, scope.row.parentId, scope.row.parentName)">修改
            </el-button>
          </template>
          <template>
            <el-button v-if="scope.row.type === 0" type="warning" size="mini"
                       @click="addOrUpdateMenuHandle(0, scope.row.id, scope.row.name)">新增菜单
            </el-button>
          </template>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <catalog-add-or-update v-if="addOrUpdateCatalogVisible" ref="addOrUpdateCatalog"
                           @refreshDataList="getDataList"></catalog-add-or-update>
    <menu-add-or-update v-if="addOrUpdateMenuVisible" ref="addOrUpdateMenu"
                        @refreshDataList="getDataList"></menu-add-or-update>
  </div>
</template>

<script>
  import MenuAddOrUpdate from './menu-add-or-update'
  import CatalogAddOrUpdate from './catalog-add-or-update'

  export default {
    data() {
      return {
        maxHeight: document.documentElement.clientHeight - 300,
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateCatalogVisible: false,
        addOrUpdateMenuVisible: false
      }
    },
    components: {
      MenuAddOrUpdate,
      CatalogAddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/menu/all'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = data.data
          this.dataListLoading = false
        })
      },
      // 新增目录 / 修改目录
      addOrUpdateCatalogHandle(id) {
        this.addOrUpdateCatalogVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateCatalog.open(id)
        })
      },
      // 新增菜单 / 修改菜单
      addOrUpdateMenuHandle(id, parentId, parentName) {
        this.addOrUpdateMenuVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateMenu.open(id, parentId, parentName)
        })
      },
      // 删除
      deleteHandle(id) {
        const requestData = {'id': id}
        this.$confirm1(`确定对[id=${id}]进行[删除]操作?`).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/menu/delete'),
            method: 'post',
            data: this.$http.adornData(requestData)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$success()
              this.getDataList()
            } else {
              this.$error(data.msg)
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
