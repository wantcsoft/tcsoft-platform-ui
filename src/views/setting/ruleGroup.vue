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
      <el-table-column prop="ruleGroupName" label="RuleGroup"></el-table-column>
      <el-table-column prop="default" :formatter="formatDefault" label="IsDefault"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleRuleGroupEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="ruleGroupDialogVisible" title="RuleGroup" width="30%">
      <el-form :model="ruleGroup" label-width="40%" label-position="left">
        <el-form-item label="RuleGroup">
          <el-input v-model="ruleGroup.ruleGroupName" placeholder="RuleGroup" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsDefault">
          <el-switch
            v-model="ruleGroup.default"
            active-text="默认"
            inactive-text="非默认">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="ruleGroupDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmRuleGroupEdit(ruleGroup)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ruleGroup',
    data() {
      return {
        tableData: [],
        ruleGroupDialogVisible: false,
        ruleGroup: {},
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
              this.getRuleGroups(list[0].hospitalId);
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
      getRuleGroups(hospitalId) {
        this.req({
          url: "/setting/ruleGroup",
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
      handleRuleGroupEdit(row) {
        this.ruleGroupDialogVisible = true;
        this.ruleGroup = row;
        this.type = 'edit';
      },
      confirmRuleGroupEdit(ruleGroup) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/ruleGroup",
            params: {
              "type": "modify"
            },
            data: {
              "ruleGroupId": ruleGroup.ruleGroupId,
              "ruleGroupName": ruleGroup.ruleGroupName,
              "default": ruleGroup.default,
            },
            method: "POST"
          }).then(
            res => {
              this.getRuleGroups(this.hospitalValue[0]);
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
            url: "/setting/ruleGroup",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "ruleGroupName": ruleGroup.ruleGroupName,
              "default": ruleGroup.default,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleGroups(this.hospitalValue[0]);
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
        this.ruleGroupDialogVisible = true;
        this.ruleGroup = {};
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
            url: "/setting/ruleGroup",
            params: {
              "type": "delete"
            },
            data: {
              "ruleGroupId": row.ruleGroupId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRuleGroups(this.hospitalValue[0]);
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
      formatDefault(row){
        let ret = ''
        if (row.default) {
          ret = "默认"
        } else {
          ret = "非默认"
        }
        return ret;
      },
      selectDown() {
        this.getRuleGroups(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
