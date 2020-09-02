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
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="groupName" label="testItemGroup"></el-table-column>
      <el-table-column prop="testItemName" label="testItem"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleTestItemGroupItemEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="testItemGroupItemDialogVisible" title="testItemGroupItem" width="40%">
      <el-form :model="testItemGroupItem" label-width="40%" label-position="left">
        <el-form-item label="groupName">
          <template>
            <el-select v-model="testItemGroupValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in testItemGroupData"
                :key="item.groupName"
                :label="item.groupName"
                :value="item.testItemGroupId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="testItem">
          <template>
            <el-select v-model="testItemInfoValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in testItemInfoData"
                :key="item.testItemName"
                :label="item.testItemName"
                :value="item.testItemId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="testItemGroupItemDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmTestItemGroupItemEdit(testItemGroupItem, testItemGroupValue, testItemInfoValue)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'testItemGroupItem',
    data() {
      return {
        tableData: [],
        testItemGroupData: [],
        testItemGroupValue: '',
        testItemInfoData: [],
        testItemInfoValue: '',

        testItemGroupItemDialogVisible: false,
        testItemGroupItem: {},
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
              this.getTestItemGroupItems(list[0].hospitalId);
              this.getTestItemGroups(list[0].hospitalId);
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
      getTestItemGroupItems(hospitalId) {
        this.req({
          url: "/setting/testItemGroupItem",
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
      getTestItemGroups(hospitalId) {
        this.req({
          url: "/setting/testItemGroup",
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
              this.testItemGroupData = res.data.data;
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
              this.testItemInfoData = res.data.data;
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

      handleTestItemGroupItemEdit(row) {
        this.testItemGroupItemDialogVisible = true;
        this.testItemGroupItem = row;
        this.type = 'edit';
        this.testItemGroupValue = row.testItemGroupId;
        this.testItemInfoValue = row.testItemId;
      },
      confirmTestItemGroupItemEdit(testItemGroupItem, testItemGroupValue, testItemInfoValue) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testItemGroupItem",
            params: {
              "type": "modify"
            },
            data: {
              "testItemGroupId": testItemGroupValue,
              "testItemId": testItemInfoValue
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroupItems(this.hospitalValue[0]);
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
            url: "/setting/testItemGroupItem",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "testItemGroupId": testItemGroupValue,
              "testItemId": testItemInfoValue
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroupItems(this.hospitalValue[0]);
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
        this.testItemGroupItemDialogVisible = true;
        this.testItemGroupItem = {};
        this.type = 'create';
        this.testItemGroupValue = '';
        this.testItemInfoValue = '';
      },
      handleDelete(testItemGroupItem) {
        this.$confirm('此操作将永久删除该testItemGroupItem, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/testItemGroupItem",
            params: {
              "type": "delete"
            },
            data: {
              "testItemGroupId": testItemGroupItem.testItemGroupId,
              "testItemId": testItemGroupItem.testItemId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroupItems(this.hospitalValue[0]);
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
        this.getTestItemGroupItems(this.hospitalValue[0]);
        this.getTestItemGroups(this.hospitalValue[0]);
        this.getTestItemInfos(this.hospitalValue[0]);
      },
    },
  }
</script>

<style scoped>

</style>
