<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名/用户操作" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(true)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      :max-height="maxHeight"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form v-if="props.row.type === 2" label-position="left" inline class="demo-table-expand">
            <el-form-item label="异常描述">
              <span>{{ props.row.exDesc }}</span>
            </el-form-item>
            <el-form-item label="异常详情">
              <span>{{ props.row.exDetail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" width="160" label="用户名"></el-table-column>
      <el-table-column prop="operation" header-align="center" align="center" width="200" label="用户操作"></el-table-column>
      <el-table-column prop="method" header-align="center" align="center" width="300" :show-overflow-tooltip="true" label="请求方法"></el-table-column>
      <el-table-column prop="params" header-align="center" align="center" width="300" :show-overflow-tooltip="true" label="请求参数"></el-table-column>
      <el-table-column prop="consumingTime" header-align="center" align="center" width="120" label="执行时长(毫秒)"></el-table-column>
      <el-table-column prop="ip" header-align="center" align="center" width="160" label="IP地址"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="160" label="创建时间"></el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" size="mini" type="success">成功</el-tag>
          <el-tag v-else size="mini" type="danger">失败</el-tag>
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
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    /*width: 50%;*/
  }
</style>

<script>
  export default {
    data () {
      return {
        maxHeight: document.documentElement.clientHeight - 300,
        dataForm: {
          key: null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (isConditionQuery) {
        if (isConditionQuery) {
          this.pageIndex = 1
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
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
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>
