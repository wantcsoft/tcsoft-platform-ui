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
      <el-table-column prop="sampleTypeName" label="SampleType"></el-table-column>
      <el-table-column prop="permitted" :formatter="formatPermitted" label="IsPermitted"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleSampleTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sampleTypeDialogVisible" title="SampleType" width="30%">
      <el-form :model="sampleType" label-width="40%" label-position="left">
        <el-form-item label="SampleType">
          <el-input v-model="sampleType.sampleTypeName" placeholder="SampleType" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsPermitted">
          <el-switch
            v-model="sampleType.permitted"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="sampleTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmSampleTypeEdit(sampleType)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'sampleType',
    data() {
      return {
        tableData: [],
        sampleTypeDialogVisible: false,
        sampleType: {},
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
                    label:
                    list[i].hospitalName
                  }
                )
              }
              this.hospitalValue = [list[0].hospitalId];
              this.getSampleTypes(list[0].hospitalId);
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
      getSampleTypes(hospitalId) {
        this.req({
          url: "/setting/sampleType",
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
      handleSampleTypeEdit(row) {
        this.sampleTypeDialogVisible = true;
        this.sampleType = row;
        this.type = 'edit';
      },
      confirmSampleTypeEdit(sampleType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/sampleType",
            params: {
              "type": "modify"
            },
            data: {
              "sampleTypeId": sampleType.sampleTypeId,
              "sampleTypeName": sampleType.sampleTypeName,
              "permitted": sampleType.permitted,
            },
            method: "POST"
          }).then(
            res => {
              this.getSampleTypes(this.hospitalValue[0]);
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
            url: "/setting/sampleType",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "sampleTypeName": sampleType.sampleTypeName,
              "permitted": sampleType.permitted,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleTypes(this.hospitalValue[0]);
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
        this.sampleTypeDialogVisible = true;
        this.sampleType = {};
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
            url: "/setting/sampleType",
            params: {
              "type": "delete"
            },
            data: {
              "sampleTypeId": row.sampleTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleTypes(this.hospitalValue[0]);
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
        this.getSampleTypes(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
