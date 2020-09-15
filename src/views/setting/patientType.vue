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
      <el-table-column prop="patientTypeName" label="patientTypeName"></el-table-column>
      <el-table-column prop="comment" label="comment"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="isEnabled"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handlePatientTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="patientTypeDialogVisible" title="patientType" width="30%">
      <el-form :model="patientType" label-width="40%" label-position="left">
        <el-form-item label="patientTypeName">
          <el-input v-model="patientType.patientTypeName" placeholder="patientTypeName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="comment">
          <el-input v-model="patientType.comment" placeholder="comment" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsEnabled">
          <el-switch
            v-model="patientType.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="patientTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmPatientTypeEdit(patientType)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'patientType',
    data() {
      return {
        tableData: [],
        patientTypeDialogVisible: false,
        patientType: {},
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
              this.getPatientTypes(list[0].hospitalId);
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
      getPatientTypes(hospitalId) {
        this.req({
          url: "/setting/patientType",
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
      handlePatientTypeEdit(row) {
        this.patientTypeDialogVisible = true;
        this.patientType = row;
        this.type = 'edit';
      },
      confirmPatientTypeEdit(patientType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/patientType",
            params: {
              "type": "modify"
            },
            data: {
              "patientTypeId": patientType.patientTypeId,
              "patientTypeName": patientType.patientTypeName,
              "comment": patientType.comment,
              "enabled": patientType.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.getPatientTypes(this.hospitalValue[0]);
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
            url: "/setting/patientType",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "patientTypeName": patientType.patientTypeName,
              "comment": patientType.comment,
              "enabled": patientType.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getPatientTypes(this.hospitalValue[0]);
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
        this.patientTypeDialogVisible = true;
        this.patientType = {};
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
            url: "/setting/patientType",
            params: {
              "type": "delete"
            },
            data: {
              "patientTypeId": row.patientTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getPatientTypes(this.hospitalValue[0]);
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
      selectDown() {
        this.getPatientTypes(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
