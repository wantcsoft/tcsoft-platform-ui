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

    <el-table :data="tableData" size="mini" stripe style="width: 100%">
      <el-table-column prop="testItemCode" label="testItemCode" width="100%"></el-table-column>
      <el-table-column prop="testItemName" label="testItemName" width="100%"></el-table-column>
      <el-table-column prop="testItemTypeName" label="testItemType" width="110%"></el-table-column>
      <el-table-column prop="dataTypeId" label="dataTypeId" width="100%"></el-table-column>
      <el-table-column prop="unitId" label="unitId" width="70%"></el-table-column>
      <el-table-column prop="printOrder" label="printOrder" width="80%"></el-table-column>
      <el-table-column prop="accuracy" label="accuracy" width="80%"></el-table-column>
      <el-table-column prop="qcItem" :formatter="formatQCItem" label="isQCItem" width="80%"></el-table-column>
      <el-table-column prop="ageRelated" :formatter="formatAgeRelated" label="isAgeRelated" width="100%"></el-table-column>
      <el-table-column prop="sexRelated" :formatter="formatSexRelated" label="isSexRelated" width="100%"></el-table-column>
      <el-table-column prop="sampleTypeRelated" :formatter="formatSampleTypeRelater" label="isSampleTypeRelated" width="150%"></el-table-column>
      <el-table-column prop="ordac" :formatter="formatOrdac" label="isOrdac" width="70%"></el-table-column>
      <el-table-column prop="programmed" :formatter="formatProgrammed" label="isProgrammed" width="110%"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="isEnabled" width="100%"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleTestItemInfoEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="testItemInfoDialogVisible" title="TestItemInfo" width="40%">
      <el-form :model="testItemInfo" label-width="40%" label-position="left">
        <el-form-item label="testItemCode">
          <el-input v-model="testItemInfo.testItemCode" placeholder="testItemCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="testItemName">
          <el-input v-model="testItemInfo.testItemName" placeholder="testItemName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="testItemType">
          <template>
            <el-select v-model="testItemTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in testItemTypeData"
                :key="item.testItemTypeName"
                :label="item.testItemTypeName"
                :value="item.testItemTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="dataType">
          <template>
            <el-select v-model="dataTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in dataTypeData"
                :key="item.dataTypeName"
                :label="item.dataTypeName"
                :value="item.dataTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="unitId">
          <template>
            <el-select v-model="resultUnitValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in resultUnitData"
                :key="item.resultUnit"
                :label="item.resultUnit"
                :value="item.resultUnitId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="printOrder">
          <el-input v-model="testItemInfo.printOrder" placeholder="printOrder" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="accuracy">
          <el-input v-model="testItemInfo.accuracy" placeholder="accuracy" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="isQCItem">
          <el-switch
            v-model="testItemInfo.qcItem"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="isAgeRelated">
          <el-switch
            v-model="testItemInfo.ageRelated"
            active-text="相关"
            inactive-text="不相关">
          </el-switch>
        </el-form-item>
        <el-form-item label="isSexRelated">
          <el-switch
            v-model="testItemInfo.sexRelated"
            active-text="相关"
            inactive-text="不相关">
          </el-switch>
        </el-form-item>
        <el-form-item label="isSampleTypeRelated">
          <el-switch
            v-model="testItemInfo.sampleTypeRelated"
            active-text="相关"
            inactive-text="不相关">
          </el-switch>
        </el-form-item>
        <el-form-item label="isOrdac">
          <el-switch
            v-model="testItemInfo.ordac"
            active-text="订阅"
            inactive-text="未订阅">
          </el-switch>
        </el-form-item>
        <el-form-item label="isProgrammed">
          <el-switch
            v-model="testItemInfo.programmed"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="isEnabled">
          <el-switch
            v-model="testItemInfo.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="testItemInfoDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmTestItemInfoEdit(testItemInfo, testItemTypeValue, dataTypeValue, resultUnitValue)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'testItemInfo',
    data() {
      return {
        tableData: [],
        testItemInfoDialogVisible: false,
        testItemInfo: {},
        testItemTypeData: [],
        testItemTypeValue: '',
        dataTypeData: [],
        dataTypeValue: '',
        resultUnitData: [],
        resultUnitValue: '',

        hospitalValue: '',
        hospitalOptions: [],
        type: ''
      };
    },
    mounted () {
      this.getHospitals();
      this.getDataTypes();
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
              this.getTestItemInfos(list[0].hospitalId);
              this.getTestItemTypes(list[0].hospitalId);
              this.getResultUnits(list[0].hospitalId);
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
      getTestItemInfos(hospitalId) {
        this.req({
          url: "/setting/testItemInfo",
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
      getTestItemTypes(hospitalId) {
        this.req({
          url: "/setting/testItemType",
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
              this.testItemTypeData = res.data.data;
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
      getDataTypes() {
        this.req({
          url: "/setting/dataType",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.dataTypeData = res.data.data;
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
              this.resultUnitData = res.data.data;
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

      handleTestItemInfoEdit(row) {
        this.testItemInfoDialogVisible = true;
        this.testItemInfo = row;
        this.type = 'edit';
        this.testItemTypeValue = row.testItemTypeId;
        this.dataTypeValue = row.dataTypeId;
        this.resultUnitValue = row.unitId;
      },
      confirmTestItemInfoEdit(testItemInfo, testItemTypeValue, dataTypeValue, resultUnitValue) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testItemInfo",
            params: {
              "type": "modify"
            },
            data: {
              "testItemId": testItemInfo.testItemId,
              "testItemCode": testItemInfo.testItemCode,
              "testItemName": testItemInfo.testItemName,
              "testItemTypeId": testItemTypeValue,
              "dataTypeId": dataTypeValue,
              "unitId": resultUnitValue,
              "printOrder": testItemInfo.printOrder,
              "qcItem": testItemInfo.qcItem,
              "accuracy": testItemInfo.accuracy,
              "ageRelated": testItemInfo.ageRelated,
              "sexRelated": testItemInfo.sexRelated,
              "sampleTypeRelated": testItemInfo.sampleTypeRelated,
              "ordac": testItemInfo.ordac,
              "programmed": testItemInfo.programmed,
              "enabled": testItemInfo.enabled,
            },
            method: "POST"
          }).then(
            res => {
              this.getTestItemInfos(this.hospitalValue[0]);
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
            url: "/setting/testItemInfo",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "testItemCode": testItemInfo.testItemCode,
              "testItemName": testItemInfo.testItemName,
              "testItemTypeId": testItemTypeValue,
              "dataTypeId": dataTypeValue,
              "unitId": resultUnitValue,
              "printOrder": testItemInfo.printOrder,
              "qcItem": testItemInfo.qcItem,
              "accuracy": testItemInfo.accuracy,
              "ageRelated": testItemInfo.ageRelated,
              "sexRelated": testItemInfo.sexRelated,
              "sampleTypeRelated": testItemInfo.sampleTypeRelated,
              "ordac": testItemInfo.ordac,
              "programmed": testItemInfo.programmed,
              "enabled": testItemInfo.enabled,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemInfos(this.hospitalValue[0]);
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
        this.testItemInfoDialogVisible = true;
        this.testItemInfo = {};
        this.type = 'create';
        this.testItemTypeValue = '';
        this.dataTypeValue = '';
        this.resultUnitValue = '';
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该age, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/testItemInfo",
            params: {
              "type": "delete"
            },
            data: {
              "testItemId": row.testItemId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemInfos(this.hospitalValue[0]);
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
      formatQCItem(row) {
        let ret = ''
        if (row.qcItem) {
          ret = "是";
        } else {
          ret = "否";
        }
        return ret;
      },
      formatAgeRelated(row) {
        let ret = ''
        if (row.ageRelated) {
          ret = "相关"
        } else {
          ret = "不相关"
        }
        return ret;
      },
      formatSexRelated(row) {
        let ret = ''
        if (row.sexRelated) {
          ret = "相关"
        } else {
          ret = "不相关"
        }
        return ret;
      },
      formatSampleTypeRelater(row) {
        let ret = ''
        if (row.sampleTypeRelated) {
          ret = "相关"
        } else {
          ret = "不相关"
        }
        return ret;
      },
      formatOrdac(row) {
        let ret = ''
        if (row.ordac) {
          ret = "订阅"
        } else {
          ret = "未订阅"
        }
        return ret;
      },
      formatProgrammed(row) {
        let ret = ''
        if (row.programmed) {
          ret = "是"
        } else {
          ret = "否"
        }
        return ret;
      },
      selectDown() {
        this.getTestItemInfos(this.hospitalValue[0]);
        this.getTestItemTypes(this.hospitalValue[0]);
        this.getResultUnits(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
