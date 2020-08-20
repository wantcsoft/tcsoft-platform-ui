<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="ruleFunctionName" label="ruleFunctionName"></el-table-column>
      <el-table-column prop="paramCount" label="paramCount"></el-table-column>
      <el-table-column prop="firstParamDataType" label="firstParamDataType" width="200%"></el-table-column>
      <el-table-column prop="secondParamDataType" label="secondParamDataType" width="200%"></el-table-column>
      <el-table-column prop="comment" label="comment"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleRuleFunctionEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="ruleFunctionDialogVisible" title="ruleFunction" width="40%">
      <el-form :model="ruleFunction" label-width="40%" label-position="left">
        <el-form-item label="RuleFunctionName">
          <el-input v-model="ruleFunction.ruleFunctionName" placeholder="RuleFunctionName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="paramCount">
          <el-input v-model="ruleFunction.paramCount" placeholder="paramCount" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="firstParamDataType">
          <el-input v-model="ruleFunction.firstParamDataType" placeholder="firstParamDataType" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="secondParamDataType">
          <el-input v-model="ruleFunction.secondParamDataType" placeholder="secondParamDataType" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="comment">
          <el-input v-model="ruleFunction.comment" placeholder="comment" style="width: 90%"/>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="ruleFunctionDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmRuleFunctionEdit(ruleFunction)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'ruleFunction',
    data() {
      return {
        tableData: [],
        ruleFunctionDialogVisible: false,
        ruleFunction: {},
        type: ''
      };
    },
    mounted () {
      this.getRuleFunctions();
    },
    methods: {
      getRuleFunctions() {
        this.req({
          url: "/setting/ruleFunction",
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
      handleRuleFunctionEdit(row) {
        this.ruleFunctionDialogVisible = true;
        this.ruleFunction = row;
        this.type = 'edit';
      },
      confirmRuleFunctionEdit(ruleFunction) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/ruleFunction",
            params: {
              "type": "modify"
            },
            data: {
              "ruleFunctionId": ruleFunction.ruleFunctionId,
              "ruleFunctionName": ruleFunction.ruleFunctionName,
              "paramCount": ruleFunction.paramCount,
              "firstParamDataType": ruleFunction.firstParamDataType,
              "secondParamDataType": ruleFunction.secondParamDataType,
              "comment": ruleFunction.comment,
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
            url: "/setting/ruleFunction",
            params: {
              "type": "create"
            },
            data: {
              "ruleFunctionName": ruleFunction.ruleFunctionName,
              "paramCount": ruleFunction.paramCount,
              "firstParamDataType": ruleFunction.firstParamDataType,
              "secondParamDataType": ruleFunction.secondParamDataType,
              "comment": ruleFunction.comment,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleFunctions();
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
        this.ruleFunctionDialogVisible = true;
        this.ruleFunction = {};
        this.type = 'create';
      },
      handleDelete(ruleFunction) {
        this.$confirm('此操作将永久删除该ruleFunction, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/ruleFunction",
            params: {
              "type": "delete"
            },
            data: {
              "ruleFunctionId": ruleFunction.ruleFunctionId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleFunctions();
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
