<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="ruleTypeName" label="ruleTypeName"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleRuleTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="ruleTypeDialogVisible" title="ruleType" width="40%">
      <el-form :model="ruleType" label-width="40%" label-position="left">
        <el-form-item label="ruleTypeName">
          <el-input v-model="ruleType.ruleTypeName" placeholder="ruleTypeName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="ruleTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmRuleTypeEdit(ruleType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'ruleType',
    data() {
      return {
        tableData: [],
        ruleTypeDialogVisible: false,
        ruleType: {},
        type: ''
      };
    },
    mounted () {
      this.getRuleTypes();
    },
    methods: {
      getRuleTypes() {
        this.req({
          url: "/setting/ruleType",
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
      handleRuleTypeEdit(row) {
        this.ruleTypeDialogVisible = true;
        this.ruleType = row;
        this.type = 'edit';
      },
      confirmRuleTypeEdit(ruleType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/ruleType",
            params: {
              "type": "modify"
            },
            data: {
              "ruleTypeId": ruleType.ruleTypeId,
              "ruleTypeName": ruleType.ruleTypeName
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
            url: "/setting/ruleType",
            params: {
              "type": "create"
            },
            data: {
              "ruleTypeName": ruleType.ruleTypeName,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleTypes();
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
        this.ruleTypeDialogVisible = true;
        this.ruleType = {};
        this.type = 'create';
      },
      handleDelete(ruleType) {
        this.$confirm('此操作将永久删除该ruleType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/ruleType",
            params: {
              "type": "delete"
            },
            data: {
              "ruleTypeId": ruleType.ruleTypeId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleTypes();
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
