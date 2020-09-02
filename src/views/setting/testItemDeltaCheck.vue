<template>
  <div class="root">
    <div>
      <span style="margin-left: 50%;">医院选择：</span>
      <el-cascader
        placeholder="试试搜索：医院"
        v-model="hospitalValue"
        :options="hospitalOptions"
        @change="selectDown()"
        filterable></el-cascader>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 7%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 3%; width: 94%">
      <el-table-column prop="formula" label="formula"></el-table-column>
      <el-table-column prop="dayRange" label="dayRange"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleTestItemDeltaCheckEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="testItemDeltaCheckDialogVisible" title="TestItemDeltaCheck" width="30%">
      <el-form :model="testItemDeltaCheck" label-width="40%" label-position="left">
        <el-form-item label="formula">
          <el-input v-model="testItemDeltaCheck.formula" placeholder="formula" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="dayRange">
          <el-input-number v-model="testItemDeltaCheck.dayRange" :min="1" :max="999999999"></el-input-number>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="testItemDeltaCheckDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmTestItemDeltaCheckEdit(testItemDeltaCheck)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'testItemDeltaCheck',
    data() {
      return {
        tableData: [],
        testItemDeltaCheckDialogVisible: false,
        testItemDeltaCheck: {},
        hospitalValue: '',
        hospitalOptions: [],
        type: ''
      };
    },
    mounted () {
      this.getHospitals();
    },
    methods: {
      getHospitals() {
        this.req({
          url: "/setting/hospitalInfo",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {
          },
        }).then(
          res => {
            if (res.data.code === 200) {
              const list = res.data.data
              for (let i = 0; i < list.length; i++) {
                this.hospitalOptions.push(
                  {
                    value: list[i].hospitalId,
                    label: list[i].hospitalName
                  }
                )
              }
              this.hospitalValue = [list[0].hospitalId];
              this.getTestItemDeltaChecks(list[0].hospitalId);
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
      getTestItemDeltaChecks(hospitalId) {
        this.req({
          url: "/setting/testItemDeltaCheck",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {
            "hospitalId": hospitalId
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
      handleTestItemDeltaCheckEdit(row) {
        this.testItemDeltaCheckDialogVisible = true;
        this.testItemDeltaCheck = row;
        this.type = 'edit';
      },
      confirmTestItemDeltaCheckEdit(testItemDeltaCheck) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testItemDeltaCheck",
            params: {
              "type": "modify"
            },
            data: {
              "testItemId": testItemDeltaCheck.testItemId,
              "formula": testItemDeltaCheck.formula,
              "dayRange": testItemDeltaCheck.dayRange,
            },
            method: "POST"
          }).then(
            res => {
              this.getTestItemDeltaChecks(this.hospitalValue[0]);
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
            url: "/setting/testItemDeltaCheck",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "formula": testItemDeltaCheck.formula,
              "dayRange": testItemDeltaCheck.dayRange,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemDeltaChecks(this.hospitalValue[0]);
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
        this.testItemDeltaCheckDialogVisible = true;
        this.testItemDeltaCheck = {};
        this.type = 'create';
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该age, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/testItemDeltaCheck",
            params: {
              "type": "delete"
            },
            data: {
              "testItemDeltaCheckId": row.testItemDeltaCheckId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemDeltaChecks(this.hospitalValue[0]);
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
      formatEnable(row){
        let ret = ''
        if (row.permitted) {
          ret = "许可"
        } else {
          ret = "未许可"
        }
        return ret;
      },
      selectDown() {
        this.getTestItemDeltaChecks(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
