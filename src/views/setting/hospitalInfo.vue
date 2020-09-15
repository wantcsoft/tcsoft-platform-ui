<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="hospitalName" label="HospitalName"></el-table-column>
      <el-table-column prop="hospitalCode" label="HospitalCode"></el-table-column>
      <el-table-column prop="location" label="location"></el-table-column>
      <el-table-column prop="isEnabled" :formatter="formatEnable" label="isEnabled"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleHospitalEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="HospitalDialogVisible" title="hospital" width="40%">
      <el-form :model="hospital" label-width="40%" label-position="left">
        <el-form-item label="hospitalName">
          <el-input v-model="hospital.hospitalName" placeholder="hospitalName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="hospitalCode">
          <el-input v-model="hospital.hospitalCode" placeholder="hospitalCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="location">
          <el-input v-model="hospital.location" placeholder="location" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="isEnabled">
          <el-switch
            v-model="hospital.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="HospitalDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmHospitalEdit(hospital)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
      name: "hospitalInfo",
      data() {
        return {
          tableData: [],
          HospitalDialogVisible: false,
          hospital: {},
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
        handleHospitalEdit(row) {
          this.HospitalDialogVisible = true;
          this.hospital = row;
          this.type = 'edit';
        },
        confirmHospitalEdit(hospital) {
          if (this.type === 'edit'){
            this.req({
              url: "/setting/hospitalInfo",
              params: {
                "type": "modify"
              },
              data: {
                "hospitalId": hospital.hospitalId,
                "hospitalName": hospital.hospitalName,
                "hospitalCode": hospital.hospitalCode,
                "location": hospital.location,
                "enabled": hospital.enabled,
                // "isDeleted": hospital.isDeleted
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
              url: "/setting/hospitalInfo",
              params: {
                "type": "create"
              },
              data: {
                "hospitalName": hospital.hospitalName,
                "hospitalCode": hospital.hospitalCode,
                "location": hospital.location,
                "isEnabled": hospital.isEnabled,
                // "isDeleted": hospital.isDeleted
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getHospitals();
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
          this.HospitalDialogVisible = true;
          this.hospital = {};
          this.type = 'create';
        },
        handleDelete(hospital) {
          this.$confirm('此操作将永久删除该hospital, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.req({
              url: "/setting/hospitalInfo",
              params: {
                "type": "delete"
              },
              data: {
                "hospitalId": hospital.hospitalId
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getHospitals();
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
          if (row.enabled) {
            ret = "启用"
          } else {
            ret = "未启用"
          }
          return ret;
        },
      }
    }
</script>

<style scoped>

</style>
