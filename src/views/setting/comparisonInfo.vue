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

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="instrumentTypeName" label="instrumentType"></el-table-column>
      <el-table-column prop="comparisonTypeName" label="comparisonType" width="180%"></el-table-column>
      <el-table-column prop="comparedTypeId" label="comparedTypeId"></el-table-column>
      <el-table-column prop="instrumentInfo" label="instrumentInfo"></el-table-column>
      <el-table-column  label="Edit" width="90%">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleComparisonInfoEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete" width="90%">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="comparisonInfoDialogVisible" title="comparisonInfo" width="40%">
      <el-form :model="comparisonInfo" label-width="40%" label-position="left">
        <el-form-item label="instrumentType">
          <template>
            <el-select v-model="instrumentTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in instrumentTypeData"
                :key="item.instrumentTypeName"
                :label="item.instrumentTypeName"
                :value="item.instrumentTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="comparisonType">
          <template>
            <el-select v-model="comparisonTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in comparisonTypeData"
                :key="item.comparisonTypeName"
                :label="item.comparisonTypeName"
                :value="item.comparisonTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="comparedTypeId">
          <el-input v-model="comparisonInfo.comparedTypeId" placeholder="comparedTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentInfo">
          <el-input v-model="comparisonInfo.instrumentInfo" placeholder="instrumentInfo" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="comparisonInfoDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmComparisonInfoEdit(comparisonInfo,instrumentTypeValue,comparisonTypeValue)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'comparisonInfo',
    data() {
      return {
        tableData: [],
        instrumentTypeData: [],
        instrumentTypeValue: '',
        comparisonTypeData: [],
        comparisonTypeValue: '',
        comparisonInfoDialogVisible: false,
        comparisonInfo: {},
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
              this.getComparisonInfos(list[0].hospitalId);
              this.getInstrumentTypes(list[0].hospitalId);
              this.getComparisonTypes();
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
      getComparisonInfos(hospitalId) {
        this.req({
          url: "/setting/comparisonInfo",
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
              this.instrumentTypeData = res.data.data;
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
      getComparisonTypes() {
        this.req({
          url: "/setting/comparisonType",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.comparisonTypeData = res.data.data;
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

      handleComparisonInfoEdit(row) {
        this.comparisonInfoDialogVisible = true;
        this.comparisonInfo = row;
        this.type = 'edit';
        this.instrumentTypeValue = row.instrumentTypeId;
        this.comparisonTypeValue = row.comparisonTypeId;
      },
      confirmComparisonInfoEdit(comparisonInfo,instrumentTypeValue,comparisonTypeValue) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/comparisonInfo",
            params: {
              "type": "modify"
            },
            data: {
              "instrumentTypeId": instrumentTypeValue,
              "comparisonTypeId": comparisonTypeValue,
              "comparedTypeId": comparisonInfo.comparedTypeId,
              "instrumentInfo": comparisonInfo.instrumentInfo,
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
            url: "/setting/comparisonInfo",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "instrumentTypeId": instrumentTypeValue,
              "comparisonTypeId": comparisonTypeValue,
              "comparedTypeId": comparisonInfo.comparedTypeId,
              "instrumentInfo": comparisonInfo.instrumentInfo,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getComparisonInfos(this.hospitalValue[0]);
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
        this.comparisonInfoDialogVisible = true;
        this.comparisonInfo = {};
        this.type = 'create';
        this.instrumentTypeValue = '';
        this.comparisonTypeValue = '';
      },
      handleDelete(comparisonInfo) {
        this.$confirm('此操作将永久删除该comparisonInfo, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/comparisonInfo",
            params: {
              "type": "delete"
            },
            data: {
              "instrumentTypeId": comparisonInfo.instrumentTypeId,
              "comparisonTypeId": comparisonInfo.comparisonTypeId,
              "instrumentInfo": comparisonInfo.instrumentInfo
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getComparisonInfos();
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
      selectDown() {
        this.getComparisonInfos(this.hospitalValue[0]);
        this.getInstrumentTypes(this.hospitalValue[0]);
        this.getComparisonTypes();
      },
    },
  }
</script>

<style scoped>

</style>
