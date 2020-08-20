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
      <el-table-column prop="lowerAge" label="lowerAge" width="100%"></el-table-column>
      <el-table-column prop="upperAge" label="upperAge" width="100%"></el-table-column>
      <el-table-column prop="ageTypeId" label="ageTypeId" width="100%"></el-table-column>
      <el-table-column prop="refLowerValue" label="refLowerValue" width="120%"></el-table-column>
      <el-table-column prop="refUpperValue" label="refUpperValue" width="120%"></el-table-column>
      <el-table-column prop="sampleTypeId" label="sampleTypeId" width="120%"></el-table-column>
      <el-table-column prop="affirmLowerValue" label="affirmLowerValue" width="150%"></el-table-column>
      <el-table-column prop="affirmUpperValue" label="affirmUpperValue" width="150%"></el-table-column>
      <el-table-column prop="reportLowerValue" label="reportLowerValue" width="150%"></el-table-column>
      <el-table-column prop="reportUpperValue" label="reportUpperValue" width="150%"></el-table-column>
      <el-table-column prop="default" :formatter="formatDefault" label="IsDefault" width="100%"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="IsEnabled" width="100%"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleResultRangeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="resultRangeDialogVisible" title="ResultRange" width="30%">
      <el-form :model="resultRange" label-width="40%" label-position="left">
        <el-form-item label="lowerAge">
          <el-input v-model="resultRange.lowerAge" placeholder="lowerAge" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="upperAge">
          <el-input v-model="resultRange.upperAge" placeholder="upperAge" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="ageTypeId">
          <el-input v-model="resultRange.ageTypeId" placeholder="ageTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="refLowerValue">
          <el-input v-model="resultRange.refLowerValue" placeholder="refLowerValue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="refUpperValue">
          <el-input v-model="resultRange.refUpperValue" placeholder="refUpperValue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="sampleTypeId">
          <el-input v-model="resultRange.sampleTypeId" placeholder="sampleTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="affirmLowerValue">
          <el-input v-model="resultRange.affirmLowerValue" placeholder="affirmLowerValue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="affirmUpperValue">
          <el-input v-model="resultRange.affirmUpperValue" placeholder="affirmUpperValue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="reportLowerValue">
          <el-input v-model="resultRange.reportLowerValue" placeholder="reportLowerValue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="reportUpperValue">
          <el-input v-model="resultRange.reportUpperValue" placeholder="reportUpperValue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsDefault">
          <el-switch
            v-model="resultRange.default"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
        <el-form-item label="IsEnabled">
          <el-switch
            v-model="resultRange.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resultRangeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmResultRangeEdit(resultRange)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'resultRange',
    data() {
      return {
        tableData: [],
        resultRangeDialogVisible: false,
        resultRange: {},
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
              this.getResultRanges(list[0].hospitalId);
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
      getResultRanges(hospitalId) {
        this.req({
          url: "/setting/resultRange",
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
      handleResultRangeEdit(row) {
        this.resultRangeDialogVisible = true;
        this.resultRange = row;
        this.type = 'edit';
      },
      confirmResultRangeEdit(resultRange) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/resultRange",
            params: {
              "type": "modify"
            },
            data: {
              "resultRangeId": resultRange.resultRangeId,
              "lowerAge": resultRange.lowerAge,
              "upperAge": resultRange.upperAge,
              "ageTypeId": resultRange.ageTypeId,
              "refLowerValue": resultRange.refLowerValue,
              "refUpperValue": resultRange.refUpperValue,
              "sampleTypeId": resultRange.sampleTypeId,
              "affirmLowerValue": resultRange.affirmLowerValue,
              "affirmUpperValue": resultRange.affirmUpperValue,
              "reportLowerValue": resultRange.reportLowerValue,
              "reportUpperValue": resultRange.reportUpperValue,
              "default": resultRange.default,
              "enabled": resultRange.enabled,
            },
            method: "POST"
          }).then(
            res => {
              this.getResultRanges(this.hospitalValue[0]);
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
            url: "/setting/resultRange",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "lowerAge": resultRange.lowerAge,
              "upperAge": resultRange.upperAge,
              "ageTypeId": resultRange.ageTypeId,
              "refLowerValue": resultRange.refLowerValue,
              "refUpperValue": resultRange.refUpperValue,
              "sampleTypeId": resultRange.sampleTypeId,
              "affirmLowerValue": resultRange.affirmLowerValue,
              "affirmUpperValue": resultRange.affirmUpperValue,
              "reportLowerValue": resultRange.reportLowerValue,
              "reportUpperValue": resultRange.reportUpperValue,
              "default": resultRange.default,
              "enabled": resultRange.enabled,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getResultRanges(this.hospitalValue[0]);
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
        this.resultRangeDialogVisible = true;
        this.resultRange = {};
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
            url: "/setting/resultRange",
            params: {
              "type": "delete"
            },
            data: {
              "resultRangeId": row.resultRangeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getResultRanges(this.hospitalValue[0]);
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
      formatDefault(row) {
        let ret = ''
        if (row.default) {
          ret = "默认"
        } else {
          ret = "非默认"
        }
        return ret;
      },
      selectDown() {
        this.getResultRanges(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
