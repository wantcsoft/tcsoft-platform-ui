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
      <el-table-column prop="instrumentTypeName" label="instrumentType"></el-table-column>
      <el-table-column prop="graphSupport" :formatter="formatGraphSupport" label="isGraphSupport"></el-table-column>
      <el-table-column prop="enable" :formatter="formatEnable" label="isEnable"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleInstrumentTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="instrumentTypeDialogVisible" title="instrumentType" width="40%">
      <el-form :model="instrumentType" label-width="40%" label-position="left">
        <el-form-item label="instrumentType">
          <el-input v-model="instrumentType.instrumentTypeName" placeholder="instrumentTypeName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsGraphSupport">
          <el-switch
            v-model="instrumentType.graphSupport"
            active-text="支持"
            inactive-text="不支持">
          </el-switch>
        </el-form-item>
        <el-form-item label="isEnable">
          <el-switch
            v-model="instrumentType.enable"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="instrumentTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmInstrumentTypeEdit(instrumentType)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'instrumentType',
    data() {
      return {
        tableData: [],
        instrumentTypeDialogVisible: false,
        instrumentType: {},
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
              this.getInstrumentTypes(list[0].hospitalId);
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
      getInstrumentTypes(hospitalId) {
        this.req({
          url: "/setting/instrumentType",
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
      handleInstrumentTypeEdit(row) {
        this.instrumentTypeDialogVisible = true;
        this.instrumentType = row;
        this.type = 'edit';
      },
      confirmInstrumentTypeEdit(instrumentType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/instrumentType",
            params: {
              "type": "modify"
            },
            data: {
              "instrumentTypeId": instrumentType.instrumentTypeId,
              "instrumentTypeName": instrumentType.instrumentTypeName,
              "graphSupport": instrumentType.graphSupport,
              "enable": instrumentType.enable
            },
            method: "POST"
          }).then(
            res => {
              this.getInstrumentTypes(this.hospitalValue[0]);
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
            url: "/setting/instrumentType",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "instrumentTypeName": instrumentType.instrumentTypeName,
              "graphSupport": instrumentType.graphSupport,
              "enable": instrumentType.enable
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getInstrumentTypes(this.hospitalValue[0]);
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
        this.instrumentTypeDialogVisible = true;
        this.instrumentType = {};
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
            url: "/setting/instrumentType",
            params: {
              "type": "delete"
            },
            data: {
              "instrumentTypeId": row.instrumentTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getInstrumentTypes(this.hospitalValue[0]);
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
      formatGraphSupport(row) {
        let ret = ''
        if (row.graphSupport) {
          ret = "支持"
        } else {
          ret = "不支持"
        }
        return ret;
      },
      selectDown() {
        this.getInstrumentTypes(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
