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
    <el-table-column prop="ageTypeName" label="AgeTypeName"></el-table-column>
    <el-table-column prop="permitted" :formatter="formatEnable" label="IsPermitted"></el-table-column>
    <el-table-column  label="Edit">
      <template slot-scope="scope" >
        <el-button size="mini" type="primary" @click="handleAgeTypeEdit(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
    <el-table-column  label="Delete">
      <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog :visible.sync="ageTypeDialogVisible" title="AgeType" width="30%">
    <el-form :model="ageType" label-width="40%" label-position="left">
      <el-form-item label="AgeTypeName">
        <el-input v-model="ageType.ageTypeName" placeholder="AgeTypeName" style="width: 90%"/>
      </el-form-item>
      <el-form-item label="IsPermitted">
<!--          <el-input v-model="ageType.permitted" placeholder="IsPermitted" style="width: 90%"/>-->
        <el-switch
          v-model="ageType.permitted"
          active-text="许可"
          inactive-text="未许可">
        </el-switch>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="danger" @click="ageTypeDialogVisible=false">cancel</el-button>
      <el-button type="primary" @click="confirmAgeTypeEdit(ageType)">save</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
  export default {
    name: "ageType",
    data() {
      return {
        tableData: [],
        ageTypeDialogVisible: false,
        ageType: {},
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
              this.getAgeTypes(list[0].hospitalId);
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
      getAgeTypes(hospitalId) {
        this.req({
          url: "/setting/ageType",
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
      handleAgeTypeEdit(row) {
        this.ageTypeDialogVisible = true;
        this.ageType = row;
        this.type = 'edit';
      },
      confirmAgeTypeEdit(ageType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/ageType",
            params: {
              "type": "modify"
            },
            data: {
              "ageTypeId": ageType.ageTypeId,
              "ageTypeName": ageType.ageTypeName,
              "permitted": ageType.permitted,
            },
            method: "POST"
          }).then(
            res => {
              this.getAgeTypes(this.hospitalValue[0]);
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
            url: "/setting/ageType",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "ageTypeName": ageType.ageTypeName,
              "permitted": ageType.permitted,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getAgeTypes(this.hospitalValue[0]);
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
        this.ageTypeDialogVisible = true;
        this.ageType = {};
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
            url: "/setting/ageType",
            params: {
              "type": "delete"
            },
            data: {
              "ageTypeId": row.ageTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getAgeTypes(this.hospitalValue[0]);
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
        this.getAgeTypes(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
