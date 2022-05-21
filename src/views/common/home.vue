<template>
  <div class="mod-home">
     <el-checkbox-group v-model="checkList">
         <el-checkbox label="复选框 A"></el-checkbox>
         <el-checkbox label="复选框 B"></el-checkbox>
         <el-checkbox label="复选框 C"></el-checkbox>
         <el-checkbox label="禁用" disabled></el-checkbox>
         <el-checkbox label="选中且禁用" disabled></el-checkbox>
       </el-checkbox-group>备选项</el-checkbox>
    <el-button style="margin-bottom: 10px;" @click="getDataList()">刷新</el-button>
    <el-table
      :data="dataList"
      row-key="id"
      border
      v-loading="dataListLoading"
      :max-height="maxHeight"
      style="width: 100%; ">
      <el-table-column prop="fileName" header-align="center" label="文件名"></el-table-column>
      <el-table-column prop="uploadTime" header-align="center" min-width="150" label="上传时间"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" width="120"
                       label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">新上传</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small" type="success">已停好</el-tag>
          <el-tag v-else size="small" type="danger">未停好</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" header-align="center" align="center" label="操作时间"></el-table-column>
      <el-table-column prop="card" header-align="center" align="center" label="车牌号"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="preview(scope.row.fileName)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="预览"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <el-image style="width: 600px; height: 400px" :src="previewUrl"></el-image>
      <el-input name="card" v-model="card" placeholder="请输入内容" style="margin-top: 10px; margin-bottom: 10px;"></el-input>
      <el-button type="success" size="mini" @click="status(1)">
        停好
      </el-button>
      <el-button type="danger" size="mini" @click="status(2)">
        未停好
      </el-button>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkList:[],
        maxHeight: document.documentElement.clientHeight - 300,
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        previewUrl: '',
        visible: false,
        currentFileName: '',
        card: ''
      }
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/getUploadList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = data.data
          this.dataListLoading = false
        })
      },
      preview(fileName) {
        console.log(window.SITE_CONFIG['baseUrl']);
        this.currentFileName = fileName;
        this.previewUrl = window.SITE_CONFIG['baseUrl'] + '/upload/' + this.currentFileName;
        this.visible = true;
      },
      status(status) {
        this.$http({
          url: this.$http.adornUrl(`/status/${this.currentFileName}/${status}/${this.card}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$success()
            this.getDataList()
          } else {
            this.$error(data.msg)
          }
        })
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>
