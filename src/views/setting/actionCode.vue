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
      <el-table-column prop="actionFlag" label="actionFlag"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="IsEnable"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleActionCodeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="actionCodeDialogVisible" title="actionCode" width="30%">
      <el-form :model="actionCode" label-width="40%" label-position="left">
        <el-form-item label="actionFlag">
          <el-input v-model="actionCode.actionFlag" placeholder="actionFlag" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsEnabled">
          <el-switch
            v-model="actionCode.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="actionCodeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmActionCodeEdit(actionCode)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'actionCode',
    data() {
      return {
        tableData: [],
        actionCodeDialogVisible: false,
        actionCode: {},
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
            if (res.data.code === 200){
              const list = res.data.data;
              for (let i=0; i<list.length; i++){
                this.hospitalOptions.push(
                  {
                    value: list[i].hospitalId,
                    label: list[i].hospitalName
                  }
                )
              }
              this.hospitalValue = [list[0].hospitalId];
              this.getActionCodes(list[0].hospitalId);
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
      getActionCodes(hospitalId) {
        this.req({
          url: "/setting/actionCode",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {
            "hospitalId": hospitalId
          },
        }).then(
          res => {
            if (res.data.code === 200){
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
      handleActionCodeEdit(row) {
        this.actionCodeDialogVisible = true;
        this.actionCode = row;
        this.type = 'edit';
      },
      confirmActionCodeEdit(actionCode) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/actionCode",
            params: {
              "type": "modify"
            },
            data: {
              "actionId": actionCode.actionId,
              "actionFlag": actionCode.actionFlag,
              "enabled": actionCode.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getActionCodes(this.hospitalValue[0]);
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
            url: "/setting/actionCode",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "actionFlag": actionCode.actionFlag,
              "enabled": actionCode.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getActionCodes(this.hospitalValue[0]);
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
        this.actionCodeDialogVisible = true;
        this.actionCode = {};
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
            url: "/setting/actionCode",
            params: {
              "type": "delete"
            },
            data: {
              "actionId": row.actionId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getActionCodes(this.hospitalValue[0]);
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
        this.getActionCodes(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
