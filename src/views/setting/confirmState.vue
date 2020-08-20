<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="confirmStateName" label="ConfirmStateName"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleConfirmStateEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="confirmStateDialogVisible" title="confirmState" width="40%">
      <el-form :model="confirmState" label-width="40%" label-position="left">
        <el-form-item label="confirmStateName">
          <el-input v-model="confirmState.confirmStateName" placeholder="confirmStateName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="confirmStateDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmConfirmStateEdit(confirmState)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'confirmState',
    data() {
      return {
        tableData: [],
        confirmStateDialogVisible: false,
        confirmState: {},
        type: ''
      };
    },
    mounted () {
      this.getConfirmStates();
    },
    methods: {
      getConfirmStates() {
        this.req({
          url: "/setting/confirmState",
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
      handleConfirmStateEdit(row) {
        this.confirmStateDialogVisible = true;
        this.confirmState = row;
        this.type = 'edit';
      },
      confirmConfirmStateEdit(confirmState) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/confirmState",
            params: {
              "type": "modify"
            },
            data: {
              "confirmStateId": confirmState.confirmStateId,
              "confirmStateName": confirmState.confirmStateName
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
            url: "/setting/confirmState",
            params: {
              "type": "create"
            },
            data: {
              "confirmStateName": confirmState.confirmStateName
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getConfirmStates();
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
        this.confirmStateDialogVisible = true;
        this.confirmState = {};
        this.type = 'create';
      },
      handleDelete(confirmState) {
        this.$confirm('此操作将永久删除该confirmState, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/confirmState",
            params: {
              "type": "delete"
            },
            data: {
              "confirmStateId": confirmState.confirmStateId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getConfirmStates();
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
