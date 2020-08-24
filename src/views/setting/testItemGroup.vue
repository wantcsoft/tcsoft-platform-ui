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
      <el-table-column prop="groupName" label="groupName"></el-table-column>
      <el-table-column prop="instrumentGroupName" label="instrumentGroup"></el-table-column>
      <el-table-column prop="comment" label="comment"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="IsEnabled"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleTestItemGroupEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="testItemGroupDialogVisible" title="TestItemGroup" width="40%">
      <el-form :model="testItemGroup" label-width="40%" label-position="left">
        <el-form-item label="groupName">
          <el-input v-model="testItemGroup.groupName" placeholder="groupName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentGroup">
          <template>
            <el-select v-model="instrumentGroupValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in instrumentGroupData"
                :key="item.instrumentGroupName"
                :label="item.instrumentGroupName"
                :value="item.instrumentGroupId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="comment">
          <el-input v-model="testItemGroup.comment" placeholder="comment" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsEnabled">
          <el-switch
            v-model="testItemGroup.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="testItemGroupDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmTestItemGroupEdit(testItemGroup,instrumentGroupValue)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'testItemGroup',
    data() {
      return {
        tableData: [],
        instrumentGroupData: [],
        instrumentGroupValue: '',
        testItemGroupDialogVisible: false,
        testItemGroup: {},
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
              this.getTestItemGroups(list[0].hospitalId);
              this.getInstrumentGroups(list[0].hospitalId);
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
      getInstrumentGroups(hospitalId) {
        this.req({
          url: "/setting/instrumentGroup",
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
              this.instrumentGroupData = res.data.data;
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
      handleTestItemGroupEdit(row) {
        this.testItemGroupDialogVisible = true;
        this.testItemGroup = row;
        this.type = 'edit';
        this.instrumentGroupValue = row.instrumentGroupId;
      },
      confirmTestItemGroupEdit(testItemGroup,instrumentGroupValue) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testItemGroup",
            params: {
              "type": "modify"
            },
            data: {
              "testItemGroupId": testItemGroup.testItemGroupId,
              "groupName": testItemGroup.groupName,
              "instrumentGroupId": instrumentGroupValue,
              "comment": testItemGroup.comment,
              "enabled": testItemGroup.enabled,
            },
            method: "POST"
          }).then(
            res => {
              this.getTestItemGroups(this.hospitalValue[0]);
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
            url: "/setting/testItemGroup",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "groupName": testItemGroup.groupName,
              "instrumentGroupId": instrumentGroupValue,
              "comment": testItemGroup.comment,
              "enabled": testItemGroup.enabled,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroups(this.hospitalValue[0]);
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
        this.testItemGroupDialogVisible = true;
        this.testItemGroup = {};
        this.type = 'create';
        this.instrumentGroupValue = '';
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该age, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/testItemGroup",
            params: {
              "type": "delete"
            },
            data: {
              "testItemGroupId": row.testItemGroupId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroups(this.hospitalValue[0]);
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
          ret = "许可"
        } else {
          ret = "未许可"
        }
        return ret;
      },
      selectDown() {
        this.getTestItemGroups(this.hospitalValue[0]);
        this.getInstrumentGroups(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
