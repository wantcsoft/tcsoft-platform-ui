<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="auditStateName" label="AuditStateName"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleAuditStateEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="auditStateDialogVisible" title="auditState" width="40%">
      <el-form :model="auditState" label-width="40%" label-position="left">
        <el-form-item label="auditStateName">
          <el-input v-model="auditState.auditStateName" placeholder="auditStateName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="auditStateDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmAuditStateEdit(auditState)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'auditState',
    data() {
      return {
        tableData: [],
        auditStateDialogVisible: false,
        auditState: {},
        type: ''
      };
    },
    mounted () {
      this.getAuditStates();
    },
    methods: {
      getAuditStates() {
        this.req({
          url: "/setting/auditState",
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
            }else {
              this.$message({
                type: 'success',
                message: res.data.message,
              });
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
      handleAuditStateEdit(row) {
        this.auditStateDialogVisible = true;
        this.auditState = row;
        this.type = 'edit';
      },
      confirmAuditStateEdit(auditState) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/auditState",
            params: {
              "type": "modify"
            },
            data: {
              "auditStateId": auditState.auditStateId,
              "auditStateName": auditState.auditStateName
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
            url: "/setting/auditState",
            params: {
              "type": "create"
            },
            data: {
              "auditStateName": auditState.auditStateName
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getAuditStates();
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
        this.auditStateDialogVisible = true;
        this.auditState = {};
        this.type = 'create';
      },
      handleDelete(auditState) {
        this.$confirm('此操作将永久删除该auditState, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/auditState",
            params: {
              "type": "delete"
            },
            data: {
              "auditStateId": auditState.auditStateId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getAuditStates();
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
