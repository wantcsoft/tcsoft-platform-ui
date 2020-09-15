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
      <el-table-column prop="ruleName" label="ruleName" width="80%"></el-table-column>
      <el-table-column prop="ruleGroupName" label="ruleGroup" width="80%"></el-table-column>
      <el-table-column prop="ruleTypeName" label="ruleType" width="70%"></el-table-column>
      <el-table-column prop="instrumentGroupName" label="instrumentGroup" width="120%"></el-table-column>
      <el-table-column prop="condition" label="condition" width="80%"></el-table-column>
      <el-table-column prop="actionTrue" label="actionTrue" width="90%"></el-table-column>
      <el-table-column prop="actionFalse" label="actionFalse" width="90%"></el-table-column>
      <el-table-column prop="comment" label="comment" width="80%"></el-table-column>
      <el-table-column prop="ruleOrder" label="ruleOrder" width="80%"></el-table-column>
      <el-table-column prop="visible" :formatter="formatVisible" label="isVisible" width="80%"></el-table-column>
      <el-table-column prop="ruleOnly" :formatter="formatRuleOnly" label="isRuleOnly" width="90%"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleRuleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="ruleDialogVisible" title="Rule" width="40%">
      <el-form :model="rule" label-width="40%" label-position="left">
        <el-form-item label="ruleName">
          <el-input v-model="rule.ruleName" placeholder="ruleName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="ruleGroup">
          <template>
            <el-select v-model="ruleGroupValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in ruleGroupData"
                :key="item.ruleGroupName"
                :label="item.ruleGroupName"
                :value="item.ruleGroupId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="ruleType">
          <template>
            <el-select v-model="ruleTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in ruleTypeData"
                :key="item.ruleTypeName"
                :label="item.ruleTypeName"
                :value="item.ruleTypeId">
              </el-option>
            </el-select>
          </template>
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

        <el-form-item label="condition">
          <el-input v-model="rule.condition" placeholder="condition" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="actionTrue">
          <el-input v-model="rule.actionTrue" placeholder="actionTrue" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="actionFalse">
          <el-input v-model="rule.actionFalse" placeholder="actionFalse" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="comment">
          <el-input v-model="rule.comment" placeholder="comment" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="ruleOrder">
          <el-input-number v-model="rule.ruleOrder" :min="1" :max="999999999"></el-input-number>
        </el-form-item>
        <el-form-item label="isVisible">
          <el-switch
            v-model="rule.visible"
            active-text="可见"
            inactive-text="不可见">
          </el-switch>
        </el-form-item>
        <el-form-item label="isRuleOnly">
          <el-switch
            v-model="rule.ruleOnly"
            active-text="唯一规则"
            inactive-text="不唯一规则">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="ruleDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmRuleEdit(rule, instrumentGroupValue, ruleGroupValue, ruleTypeValue)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'rule',
    data() {
      return {
        tableData: [],
        ruleGroupData: [],
        ruleGroupValue: '',
        instrumentGroupData: [],
        instrumentGroupValue: '',
        ruleTypeData: [],
        ruleTypeValue: '',

        ruleDialogVisible: false,
        rule: {},
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
              this.getRules(list[0].hospitalId);
              this.getInstrumentGroups(list[0].hospitalId);
              this.getRuleGroups(list[0].hospitalId);
              this.getRuleTypes();
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
      getRules(hospitalId) {
        this.req({
          url: "/setting/rule",
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
              this.ruleGroupData = res.data.data;
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
      getRuleTypes() {
        this.req({
          url: "/setting/ruleType",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.ruleTypeData = res.data.data;
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

      handleRuleEdit(row) {
        this.ruleDialogVisible = true;
        this.rule = row;
        this.type = 'edit';
        this.instrumentGroupValue = row.instrumentGroupId;
        this.ruleTypeValue = row.ruleTypeId;
        this.ruleGroupValue = row.ruleGroupId;
      },
      confirmRuleEdit(rule, instrumentGroupValue, ruleGroupValue, ruleTypeValue) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/rule",
            params: {
              "type": "modify"
            },
            data: {
              "ruleId": rule.ruleId,
              "ruleGroupId": ruleGroupValue,
              "ruleName": rule.ruleName,
              "instrumentGroupId": instrumentGroupValue,
              "ruleTypeId": ruleTypeValue,
              "condition": rule.condition,
              "actionTrue": rule.actionTrue,
              "actionFalse": rule.actionFalse,
              "comment": rule.comment,
              "ruleOrder": rule.ruleOrder,
              "visible": rule.visible,
              "ruleOnly": rule.ruleOnly
            },
            method: "POST"
          }).then(
            res => {
              this.getRules(this.hospitalValue[0]);
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
            url: "/setting/rule",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "ruleGroupId": ruleGroupValue,
              "ruleName": rule.ruleName,
              "instrumentGroupId": instrumentGroupValue,
              "ruleTypeId": ruleTypeValue,
              "condition": rule.condition,
              "actionTrue": rule.actionTrue,
              "actionFalse": rule.actionFalse,
              "comment": rule.comment,
              "ruleOrder": rule.ruleOrder,
              "visible": rule.visible,
              "ruleOnly": rule.ruleOnly
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRules(this.hospitalValue[0]);
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
        this.ruleDialogVisible = true;
        this.rule = {};
        this.type = 'create';
        this.instrumentGroupValue = '';
        this.ruleTypeValue = '';
        this.ruleGroupValue = '';
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该age, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/rule",
            params: {
              "type": "delete"
            },
            data: {
              "ruleId": row.ruleId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getRules(this.hospitalValue[0]);
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
      formatVisible(row){
        let ret = ''
        if (row.visible) {
          ret = "可见"
        } else {
          ret = "不可见"
        }
        return ret;
      },
      formatRuleOnly(row) {
        let ret = ''
        if (row.ruleOnly) {
          ret = "唯一规则"
        } else {
          ret = "不唯一规则"
        }
        return ret;
      },
      selectDown() {
        this.getRules(this.hospitalValue[0]);
        this.getInstrumentGroups(this.hospitalValue[0]);
        this.getRuleGroups(this.hospitalValue[0]);
        this.getRuleTypes();
      },
    }
  }
</script>

<style scoped>

</style>
