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
      <el-table-column prop="testItemCode" label="testItemCode" width="120%"></el-table-column>
      <el-table-column prop="testItemName" label="testItemName" width="120%"></el-table-column>
      <el-table-column prop="printOrder" label="printOrder" width="120%"></el-table-column>
      <el-table-column prop="qCItem" label="isQCItem" width="120%"></el-table-column>
      <el-table-column prop="accuracy" label="accuracy" width="120%"></el-table-column>
      <el-table-column prop="ageRelated" :formatter="formatAgeRelated" label="isAgeRelated" width="120%"></el-table-column>
      <el-table-column prop="sexRelated" :formatter="formatSexRelated" label="isSexRelated" width="120%"></el-table-column>
      <el-table-column prop="sampleTypeRelated" :formatter="formatSampleTypeRelater" label="isSampleTypeRelated" width="180%"></el-table-column>
      <el-table-column prop="unitId" label="unitId"></el-table-column>
      <el-table-column prop="order" :formatter="formatOrder" label="isOrder"></el-table-column>
      <el-table-column prop="testItemTypeId" label="testItemTypeId" width="120%"></el-table-column>
      <el-table-column prop="resultTypeId" label="resultTypeId" width="120%"></el-table-column>
      <el-table-column prop="programmed" :formatter="formatProgrammed" label="isProgrammed" width="120%"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="isEnabled" width="120%"></el-table-column>
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
        <el-form-item label="printOrder">
          <el-input v-model="testItemInfo.printOrder" placeholder="printOrder" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="isQCItem">
          <el-input v-model="testItemInfo.qCItem" placeholder="isQCItem" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="accuracy">
          <el-input v-model="testItemInfo.accuracy" placeholder="accuracy" style="width: 90%"/>
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
        <el-form-item label="unitId">
          <el-input v-model="testItemInfo.unitId" placeholder="unitId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="isOrder">
          <el-switch
            v-model="testItemInfo.order"
            active-text="订阅"
            inactive-text="未订阅">
          </el-switch>
        </el-form-item>
        <el-form-item label="testItemTypeId">
          <el-input v-model="testItemInfo.testItemTypeId" placeholder="testItemTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="resultTypeId">
          <el-input v-model="testItemInfo.resultTypeId" placeholder="resultTypeId" style="width: 90%"/>
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
        <el-button type="primary" @click="confirmTestItemInfoEdit(testItemInfo)">save</el-button>
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
              this.getTestItemInfos(list[0].hospitalId);
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
      },
      confirmTestItemInfoEdit(testItemInfo) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testItemInfo",
            params: {
              "type": "modify"
            },
            data: {
              "testItemID": testItemInfo.testItemID,
              "testItemCode": testItemInfo.testItemCode,
              "testItemName": testItemInfo.testItemName,
              "printOrder": testItemInfo.printOrder,
              "qCItem": testItemInfo.qCItem,
              "accuracy": testItemInfo.accuracy,
              "ageRelated": testItemInfo.ageRelated,
              "sexRelated": testItemInfo.sexRelated,
              "sampleTypeRelated": testItemInfo.sampleTypeRelated,
              "unitId": testItemInfo.unitId,
              "order": testItemInfo.order,
              "testItemTypeId": testItemInfo.testItemTypeId,
              "resultTypeId": testItemInfo.resultTypeId,
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
              "printOrder": testItemInfo.printOrder,
              "qCItem": testItemInfo.qCItem,
              "accuracy": testItemInfo.accuracy,
              "ageRelated": testItemInfo.ageRelated,
              "sexRelated": testItemInfo.sexRelated,
              "sampleTypeRelated": testItemInfo.sampleTypeRelated,
              "unitId": testItemInfo.unitId,
              "order": testItemInfo.order,
              "testItemTypeId": testItemInfo.testItemTypeId,
              "resultTypeId": testItemInfo.resultTypeId,
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
      formatOrder(row) {
        let ret = ''
        if (row.order) {
          ret = "订阅"
        } else {
          ret = "未订阅"
        }
        return ret;
      },
      formatProgrammed(row) {
        let ret = ''
        if (row.order) {
          ret = "是"
        } else {
          ret = "否"
        }
        return ret;
      },
      selectDown() {
        this.getTestItemInfos(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
