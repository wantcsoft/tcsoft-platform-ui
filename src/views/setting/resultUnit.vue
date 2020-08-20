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
      <el-table-column prop="resultUnit" label="resultUnit"></el-table-column>
      <el-table-column prop="permitted" :formatter="formatPermitted" label="IsPermitted"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleResultUnitEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="resultUnitDialogVisible" title="ResultUnit" width="30%">
      <el-form :model="resultUnit" label-width="40%" label-position="left">
        <el-form-item label="resultUnit">
          <el-input v-model="resultUnit.resultUnit" placeholder="resultUnit" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsPermitted">
          <el-switch
            v-model="resultUnit.permitted"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resultUnitDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmResultUnitEdit(resultUnit)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'resultUnit',
    data() {
      return {
        tableData: [],
        resultUnitDialogVisible: false,
        resultUnit: {},
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
              this.getResultUnits(list[0].hospitalId);
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
      getResultUnits(hospitalId) {
        this.req({
          url: "/setting/resultUnit",
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
      handleResultUnitEdit(row) {
        this.resultUnitDialogVisible = true;
        this.resultUnit = row;
        this.type = 'edit';
      },
      confirmResultUnitEdit(resultUnit) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/resultUnit",
            params: {
              "type": "modify"
            },
            data: {
              "resultUnitId": resultUnit.resultUnitId,
              "resultUnit": resultUnit.resultUnit,
              "permitted": resultUnit.permitted,
            },
            method: "POST"
          }).then(
            res => {
              this.getResultUnits(this.hospitalValue[0]);
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
            url: "/setting/resultUnit",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "resultUnit": resultUnit.resultUnit,
              "permitted": resultUnit.permitted,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getResultUnits(this.hospitalValue[0]);
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
        this.resultUnitDialogVisible = true;
        this.resultUnit = {};
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
            url: "/setting/resultUnit",
            params: {
              "type": "delete"
            },
            data: {
              "resultUnitId": row.resultUnitId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getResultUnits(this.hospitalValue[0]);
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
      formatPermitted(row){
        let ret = ''
        if (row.permitted) {
          ret = "许可"
        } else {
          ret = "未许可"
        }
        return ret;
      },
      selectDown() {
        this.getResultUnits(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
