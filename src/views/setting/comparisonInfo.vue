<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="instrumentTypeName" label="instrumentTypeName"></el-table-column>
      <el-table-column prop="comparisonTypeName" label="comparisonTypeName" width="180%"></el-table-column>
      <el-table-column prop="instrumentInfo" label="instrumentInfo"></el-table-column>
      <el-table-column prop="comparedTypeId" label="comparedTypeId"></el-table-column>
      <el-table-column  label="Edit" width="90%">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleComparisonInfoEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete" width="90%">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="comparisonInfoDialogVisible" title="comparisonInfo" width="40%">
      <el-form :model="comparisonInfo" label-width="40%" label-position="left">
        <el-form-item label="instrumentTypeId">
          <el-input v-model="comparisonInfo.instrumentTypeId" placeholder="instrumentTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="comparisonTypeId">
          <el-input v-model="comparisonInfo.comparisonTypeId" placeholder="comparisonTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentInfo">
          <el-input v-model="comparisonInfo.instrumentInfo" placeholder="instrumentInfo" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="comparedTypeId">
          <el-input v-model="comparisonInfo.comparedTypeId" placeholder="comparedTypeId" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="comparisonInfoDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmComparisonInfoEdit(comparisonInfo)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'comparisonInfo',
    data() {
      return {
        tableData: [],
        instrumentTypeData: [],
        instrumentTypeValue: '',
        comparisonTypeData: [],
        comparisonTypeValue: '',
        comparisonInfoDialogVisible: false,
        comparisonInfo: {},
        type: ''
      };
    },
    mounted () {
      this.getComparisonInfos();
      this.getInstrumentTypes();
      this.getComparisonTypes();
    },
    methods: {
      getComparisonInfos() {
        this.req({
          url: "/setting/comparisonInfo",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.tableData = res.data.data;
            }
          },
          err => {
            console.log(err)
            this.$message({
              type: 'success',
              message: "配置获取失败"
            });
          }
        );
      },
      getInstrumentTypes() {

      },
      getComparisonTypes() {
        this.req({
          url: "/setting/comparisonType",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.comparisonTypeData = res.data.data;
            }
          },
          err => {
            console.log(err)
            this.$message({
              type: 'success',
              message: "配置获取失败"
            });
          }
        );
      },

      handleComparisonInfoEdit(row) {
        this.comparisonInfoDialogVisible = true;
        this.comparisonInfo = row;
        this.type = 'edit';
        this.instrumentTypeValue = row.instrumentTypeId;
        this.comparisonTypeValue = row.comparisonTypeId;
      },
      confirmComparisonInfoEdit(comparisonInfo) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/comparisonInfo",
            params: {
              "type": "modify"
            },
            data: {
              "instrumentTypeId": comparisonInfo.instrumentTypeId,
              "comparisonTypeId": comparisonInfo.comparisonTypeId,
              "instrumentInfo": comparisonInfo.instrumentInfo,
              "comparedTypeId": comparisonInfo.comparedTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'info',
                message: '修改失败'
              });
            }
          );
        }else {
          this.req({
            url: "/setting/comparisonInfo",
            params: {
              "type": "create"
            },
            data: {
              "instrumentTypeId": comparisonInfo.instrumentTypeId,
              "comparisonTypeId": comparisonInfo.comparisonTypeId,
              "instrumentInfo": comparisonInfo.instrumentInfo,
              "comparedTypeId": comparisonInfo.comparedTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getComparisonInfos();
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'info',
                message: '创建失败'
              });
            }
          );
        }
      },
      handleCreate() {
        this.comparisonInfoDialogVisible = true;
        this.comparisonInfo = {};
        this.type = 'create';
        this.instrumentTypeValue = '';
        this.comparisonTypeValue = '';
      },
      handleDelete(comparisonInfo) {
        this.$confirm('此操作将永久删除该comparisonInfo, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/comparisonInfo",
            params: {
              "type": "delete"
            },
            data: {
              "instrumentTypeId": comparisonInfo.instrumentTypeId,
              "comparisonTypeId": comparisonInfo.comparisonTypeId,
              "instrumentInfo": comparisonInfo.instrumentInfo
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getComparisonInfos();
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'success',
                message: "删除失败"
              });
            }
          );
        })
      },
    },
  }
</script>

<style scoped>

</style>
