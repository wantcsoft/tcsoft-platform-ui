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
      <el-table-column prop="testTypeName" label="TestType"></el-table-column>
      <el-table-column prop="resultStatMinutes" label="resultStatMinutes"></el-table-column>
      <el-table-column prop="permitted" :formatter="formatEnable" label="IsPermitted"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleTestTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="testTypeDialogVisible" title="TestType" width="30%">
      <el-form :model="testType" label-width="40%" label-position="left">
        <el-form-item label="TestType">
          <el-input v-model="testType.testTypeName" placeholder="TestType" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="resultStatMinutes">
          <el-input v-model="testType.resultStatMinutes" placeholder="resultStatMinutes" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsPermitted">
          <el-switch
            v-model="testType.permitted"
            active-text="许可"
            inactive-text="未许可">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="testTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmTestTypeEdit(testType)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'testType',
    data() {
      return {
        tableData: [],
        testTypeDialogVisible: false,
        testType: {},
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
              this.getTestTypes(list[0].hospitalId);
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
      getTestTypes(hospitalId) {
        this.req({
          url: "/setting/testType",
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
      handleTestTypeEdit(row) {
        this.testTypeDialogVisible = true;
        this.testType = row;
        this.type = 'edit';
      },
      confirmTestTypeEdit(testType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testType",
            params: {
              "type": "modify"
            },
            data: {
              "testTypeId": testType.testTypeId,
              "testTypeName": testType.testTypeName,
              "resultStatMinutes": testType.resultStatMinutes,
              "permitted": testType.permitted
            },
            method: "POST"
          }).then(
            res => {
              this.getTestTypes(this.hospitalValue[0]);
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
            url: "/setting/testType",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "testTypeName": testType.testTypeName,
              "resultStatMinutes": testType.resultStatMinutes,
              "permitted": testType.permitted
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestTypes(this.hospitalValue[0]);
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
        this.testTypeDialogVisible = true;
        this.testType = {};
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
            url: "/setting/testType",
            params: {
              "type": "delete"
            },
            data: {
              "testTypeId": row.testTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestTypes(this.hospitalValue[0]);
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
        this.getTestTypes(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
