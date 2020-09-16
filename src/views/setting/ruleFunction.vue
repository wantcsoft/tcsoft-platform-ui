<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="ruleFunctionName" label="ruleFunction" width="120%"></el-table-column>
      <el-table-column prop="paramCount" label="paramCount" width="120%"></el-table-column>
      <el-table-column prop="firstParam" label="firstParamDataType" width="180%"></el-table-column>
      <el-table-column prop="secondParam" label="secondParamDataType" width="180%"></el-table-column>
      <el-table-column prop="comment" label="comment" width="110%"></el-table-column>
      <el-table-column  label="Edit" width="90%">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleRuleFunctionEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete" width="90%">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="ruleFunctionDialogVisible" title="ruleFunction" width="40%">
      <el-form :model="ruleFunction" label-width="40%" label-position="left">
        <el-form-item label="RuleFunction">
          <el-input v-model="ruleFunction.ruleFunctionName" placeholder="RuleFunctionName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="paramCount">
          <el-input v-model="ruleFunction.paramCount" placeholder="paramCount" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="firstParamDataType">
          <template>
            <el-select v-model="firstDataTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in dataTypeData"
                :key="item.dataTypeName"
                :label="item.dataTypeName"
                :value="item.dataTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="secondParamDataType">
          <template>
            <el-select v-model="secondDataTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in dataTypeData"
                :key="item.dataTypeName"
                :label="item.dataTypeName"
                :value="item.dataTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="comment">
          <el-input v-model="ruleFunction.comment" placeholder="comment" style="width: 90%"/>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="ruleFunctionDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmRuleFunctionEdit(ruleFunction, firstDataTypeValue, secondDataTypeValue)">save</el-button>
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
        dataTypeData: [],
        firstDataTypeValue: '',
        secondDataTypeValue: '',

        ruleFunctionDialogVisible: false,
        ruleFunction: {},
        type: ''
      };
    },
    mounted () {
      this.getRuleFunctions();
      this.getDataTypes();
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
      getDataTypes() {
        this.req({
          url: "/setting/dataType",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.dataTypeData = res.data.data;
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
      handleRuleFunctionEdit(row) {
        this.ruleFunctionDialogVisible = true;
        this.ruleFunction = row;
        this.type = 'edit';
        this.firstDataTypeValue = row.firstParamDataType;
        this.secondDataTypeValue = row.secondParamDataType;
      },
      confirmRuleFunctionEdit(ruleFunction, firstDataTypeValue, secondDataTypeValue) {
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
              "firstParamDataType": firstDataTypeValue,
              "secondParamDataType": secondDataTypeValue,
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
              "firstParamDataType": firstDataTypeValue,
              "secondParamDataType": secondDataTypeValue,
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
        this.firstDataTypeValue = '';
        this.secondDataTypeValue = '';
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
