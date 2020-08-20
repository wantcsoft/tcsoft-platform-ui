<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="sampleStatusName" label="sampleStatusName"></el-table-column>
      <el-table-column prop="statusFlag" label="statusFlag"></el-table-column>
      <el-table-column prop="parentStatusId" label="parentStatusId"></el-table-column>
      <el-table-column prop="instrumentRelated" :formatter="formatInstrumentRelated" label="instrumentRelated"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleSampleStatusEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sampleStatusDialogVisible" title="sampleStatus" width="40%">
      <el-form :model="sampleStatus" label-width="40%" label-position="left">
        <el-form-item label="sampleStatusName">
          <el-input v-model="sampleStatus.sampleStatusName" placeholder="sampleStatusName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="statusFlag">
          <el-input v-model="sampleStatus.statusFlag" placeholder="statusFlag" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="parentStatusId">
          <el-input v-model="sampleStatus.parentStatusId" placeholder="parentStatusId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentRelated">
          <el-switch
            v-model="sampleStatus.instrumentRelated"
            active-text="相关"
            inactive-text="不相关">
          </el-switch>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="sampleStatusDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmSampleStatusEdit(sampleStatus)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'sampleStatus',
    data() {
      return {
        tableData: [],
        sampleStatusDialogVisible: false,
        sampleStatus: {},
        type: ''
      };
    },
    mounted () {
      this.getSampleStatus();
    },
    methods: {
      getSampleStatus() {
        this.req({
          url: "/setting/sampleStatus",
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
      handleSampleStatusEdit(row) {
        this.sampleStatusDialogVisible = true;
        this.sampleStatus = row;
        this.type = 'edit';
      },
      confirmSampleStatusEdit(sampleStatus) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/sampleStatus",
            params: {
              "type": "modify"
            },
            data: {
              "sampleStatusId": sampleStatus.sampleStatusId,
              "sampleStatusName": sampleStatus.sampleStatusName,
              "statusFlag": sampleStatus.statusFlag,
              "parentStatusId": sampleStatus.parentStatusId,
              "instrumentRelated": sampleStatus.instrumentRelated
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
            url: "/setting/sampleStatus",
            params: {
              "type": "create"
            },
            data: {
              "sampleStatusName": sampleStatus.sampleStatusName,
              "statusFlag": sampleStatus.statusFlag,
              "parentStatusId": sampleStatus.parentStatusId,
              "instrumentRelated": sampleStatus.instrumentRelated
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleStatus();
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
        this.sampleStatusDialogVisible = true;
        this.sampleStatus = {};
        this.type = 'create';
      },
      handleDelete(sampleStatus) {
        this.$confirm('此操作将永久删除该sampleStatus, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/sampleStatus",
            params: {
              "type": "delete"
            },
            data: {
              "sampleStatusId": sampleStatus.sampleStatusId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleStatus();
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
      formatInstrumentRelated(row) {
        let ret = ''
        if (row.instrumentRelated) {
          ret = "相关"
        } else {
          ret = "不相关"
        }
        return ret;
      },
    },
  }
</script>

<style scoped>

</style>
