<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.dictKey" placeholder="字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(true)">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      :max-height="maxHeight"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="dictKey" header-align="center" align="center" label="字典名称"></el-table-column>
      <el-table-column prop="dictValue" header-align="center" align="center" label="字典值"></el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="字典描述"></el-table-column>
      <el-table-column prop="note" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './dict-add-or-update'

  export default {
    data() {
      return {
        maxHeight: document.documentElement.clientHeight - 300,
        dataForm: {
          dictKey: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
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
      getDataList(isConditionQuery) {
        if (isConditionQuery) {
          this.pageIndex = 1
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dict/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'dictKey': this.dataForm.dictKey
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
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
        this.$confirm1(`确定对[id=${id}]进行删除操作?`).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/dict/delete'),
            method: 'post',
            data: this.$http.adornData(requestData)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$success()
              this.getDataList(true)
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
