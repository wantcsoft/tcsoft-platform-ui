<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="parentSampleState" label="parentSampleState"></el-table-column>
      <el-table-column prop="sampleStateName" label="sampleStateName"></el-table-column>
      <el-table-column prop="samplePosition" :formatter="formatSamplePosition" label="IsSamplePosition"></el-table-column>
      <el-table-column prop="instrumentRelated" :formatter="formatInstrumentRelated" label="instrumentRelated"></el-table-column>
      <el-table-column prop="displayOrder" label="displayOrder"></el-table-column>
      <el-table-column prop="stateDisplayName" label="stateDisplayName"></el-table-column>
      <el-table-column prop="defaultDisplayName" label="defaultDisplayName"></el-table-column>
      <el-table-column prop="bindInstrumentId" label="bindInstrumentId"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleSampleStateEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sampleStateDialogVisible" title="sampleState" width="40%">
      <el-form :model="sampleState" label-width="40%" label-position="left">
        <el-form-item label="parentSampleState">
          <el-input v-model="sampleState.parentSampleState" placeholder="parentSampleState" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="sampleStateName">
          <el-input v-model="sampleState.sampleStateName" placeholder="sampleStateName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="IsSamplePosition">
          <el-switch
            v-model="material.samplePosition"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="instrumentRelated">
          <el-switch
            v-model="material.instrumentRelated"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="displayOrder">
          <el-input v-model="sampleState.displayOrder" placeholder="displayOrder" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="stateDisplayName">
          <el-input v-model="sampleState.stateDisplayName" placeholder="stateDisplayName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="defaultDisplayName">
          <el-input v-model="sampleState.defaultDisplayName" placeholder="defaultDisplayName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="bindInstrumentId">
          <el-input v-model="sampleState.bindInstrumentId" placeholder="bindInstrumentId" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="sampleStateDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmSampleStateEdit(sampleState)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'sampleState',
    data() {
      return {
        tableData: [],
        sampleStateDialogVisible: false,
        sampleState: {},
        type: ''
      };
    },
    mounted () {
      this.getSampleStates();
    },
    methods: {
      getSampleStates() {
        this.req({
          url: "/setting/sampleState",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

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
      handleSampleStateEdit(row) {
        this.sampleStateDialogVisible = true;
        this.sampleState = row;
        this.type = 'edit';
      },
      confirmSampleStateEdit(sampleState) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/sampleState",
            params: {
              "type": "modify"
            },
            data: {
              "sampleStateId": sampleState.sampleStateId,
              "parentSampleState": sampleState.parentSampleState,
              "sampleStateName": sampleState.sampleStateName,
              "samplePosition": sampleState.samplePosition,
              "instrumentRelated": sampleState.instrumentRelated,
              "displayOrder": sampleState.displayOrder,
              "stateDisplayName": sampleState.stateDisplayName,
              "defaultDisplayName": sampleState.defaultDisplayName,
              "bindInstrumentId": sampleState.bindInstrumentId
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
            url: "/setting/sampleState",
            params: {
              "type": "create"
            },
            data: {
              "parentSampleState": sampleState.parentSampleState,
              "sampleStateName": sampleState.sampleStateName,
              "samplePosition": sampleState.samplePosition,
              "instrumentRelated": sampleState.instrumentRelated,
              "displayOrder": sampleState.displayOrder,
              "stateDisplayName": sampleState.stateDisplayName,
              "defaultDisplayName": sampleState.defaultDisplayName,
              "bindInstrumentId": sampleState.bindInstrumentId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleStates();
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
        this.sampleStateDialogVisible = true;
        this.sampleState = {};
        this.type = 'create';
      },
      handleDelete(sampleState) {
        this.$confirm('此操作将永久删除该sampleState, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/sampleState",
            params: {
              "type": "delete"
            },
            data: {
              "sampleStateId": sampleState.sampleStateId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleStates();
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
      formatSamplePosition(row) {
        let ret = ''
        if (row.active) {
          ret = "是"
        } else {
          ret = "否"
        }
        return ret;
      },
      formatInstrumentRelated(row) {
        let ret = ''
        if (row.active) {
          ret = "是"
        } else {
          ret = "否"
        }
        return ret;
      },
    },
  }
</script>

<style scoped>

</style>
