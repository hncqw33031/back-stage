<template>
  <div class="mod-menu">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增部门</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="id"
      border
      :max-height="maxHeight"
      :tree-props="{children: 'subDepts'}"
      style="width: 100%; ">
      <el-table-column prop="id" header-align="center" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" min-width="150" label="部门名称"></el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="120"
                       label="上级部门"></el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" label="排序号"></el-table-column>
      <el-table-column header-align="center" align="center" width="260" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './dept-add-or-update'

  export default {
    data() {
      return {
        maxHeight: document.documentElement.clientHeight - 300,
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dept/all'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = data.data
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.open(id)
        })
      },
      // 删除
      deleteHandle(id) {
        const requestData = {'id': id}
        this.$confirm1(`确定对[id=${id}]进行[删除]操作?`).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/delete'),
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
