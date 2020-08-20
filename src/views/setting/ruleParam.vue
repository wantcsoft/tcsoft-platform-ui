<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="paramCode" label="paramCode"></el-table-column>
      <el-table-column prop="paramDesc" label="paramDesc"></el-table-column>
      <el-table-column prop="dataTypeId" label="dataTypeId"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleRuleParamEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="ruleParamDialogVisible" title="ruleParam" width="40%">
      <el-form :model="ruleParam" label-width="40%" label-position="left">
        <el-form-item label="paramCode">
          <el-input v-model="ruleParam.paramCode" placeholder="paramCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="paramDesc">
          <el-input v-model="ruleParam.paramDesc" placeholder="paramDesc" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="dataTypeId">
          <el-input v-model="ruleParam.dataTypeId" placeholder="dataTypeId" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="ruleParamDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmRuleParamEdit(ruleParam)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'ruleParam',
    data() {
      return {
        tableData: [],
        ruleParamDialogVisible: false,
        ruleParam: {},
        type: ''
      };
    },
    mounted () {
      this.getRuleParams();
    },
    methods: {
      getRuleParams() {
        this.req({
          url: "/setting/ruleParam",
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
      handleRuleParamEdit(row) {
        this.ruleParamDialogVisible = true;
        this.ruleParam = row;
        this.type = 'edit';
      },
      confirmRuleParamEdit(ruleParam) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/ruleParam",
            params: {
              "type": "modify"
            },
            data: {
              "ruleParamId": ruleParam.ruleParamId,
              "paramCode": ruleParam.paramCode,
              "paramDesc": ruleParam.paramDesc,
              "dataTypeId": ruleParam.dataTypeId,
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
            url: "/setting/ruleParam",
            params: {
              "type": "create"
            },
            data: {
              "paramCode": ruleParam.paramCode,
              "paramDesc": ruleParam.paramDesc,
              "dataTypeId": ruleParam.dataTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleParams();
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
        this.ruleParamDialogVisible = true;
        this.ruleParam = {};
        this.type = 'create';
      },
      handleDelete(ruleParam) {
        this.$confirm('此操作将永久删除该ruleParam, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/ruleParam",
            params: {
              "type": "delete"
            },
            data: {
              "ruleParamId": ruleParam.ruleParamId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleParams();
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
