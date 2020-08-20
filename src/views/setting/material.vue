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
      <el-table-column prop="materialName" label="materialName"></el-table-column>
      <el-table-column prop="sampleTypeId" label="sampleTypeId"></el-table-column>
      <el-table-column prop="periodStart" label="periodStart"></el-table-column>
      <el-table-column prop="periodEnd" label="periodEnd"></el-table-column>
      <el-table-column prop="active" :formatter="formatActive" label="isActive"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleMaterialEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="materialDialogVisible" title="Material" width="30%">
      <el-form :model="material" label-width="40%" label-position="left">
        <el-form-item label="MaterialName">
          <el-input v-model="material.materialName" placeholder="MaterialName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="sampleTypeId">
          <el-input v-model="material.sampleTypeId" placeholder="sampleTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="periodStart">
          <el-date-picker
            v-model="material.periodStart"
            type="datetime"
            placeholder="选择日期"
            style="width: 90%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="periodEnd">
          <el-date-picker
            v-model="material.periodEnd"
            type="datetime"
            placeholder="选择日期"
            style="width: 90%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="isActive">
          <el-switch
            v-model="material.active"
            active-text="激活"
            inactive-text="未激活">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="materialDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmMaterialEdit(material)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'material',
    data() {
      return {
        tableData: [],
        materialDialogVisible: false,
        material: {},
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
              this.getMaterials(list[0].hospitalId);
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
      getMaterials(hospitalId) {
        this.req({
          url: "/setting/material",
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
      handleMaterialEdit(row) {
        this.materialDialogVisible = true;
        this.material = row;
        this.type = 'edit';
      },
      confirmMaterialEdit(material) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/material",
            params: {
              "type": "modify"
            },
            data: {
              "materialId": material.materialId,
              "materialName": material.materialName,
              "sampleTypeId": material.sampleTypeId,
              "periodStart": material.periodStart,
              "periodEnd": material.periodEnd,
              "active": material.active
            },
            method: "POST"
          }).then(
            res => {
              this.getMaterials(this.hospitalValue[0]);
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
            url: "/setting/material",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "materialId": material.materialId,
              "materialName": material.materialName,
              "sampleTypeId": material.sampleTypeId,
              "periodStart": material.periodStart,
              "periodEnd": material.periodEnd,
              "active": material.active
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getMaterials(this.hospitalValue[0]);
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
        this.materialDialogVisible = true;
        this.material = {};
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
            url: "/setting/material",
            params: {
              "type": "delete"
            },
            data: {
              "materialId": row.materialId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getMaterials(this.hospitalValue[0]);
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
      formatActive(row){
        let ret = ''
        if (row.active) {
          ret = "许可"
        } else {
          ret = "未许可"
        }
        return ret;
      },
      selectDown() {
        this.getMaterials(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
