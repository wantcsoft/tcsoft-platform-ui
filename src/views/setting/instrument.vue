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

    <el-table :data="tableData" stripe >
      <el-table-column prop="hospitalId" label="hospitalId" width="90%"></el-table-column>
      <el-table-column prop="instrumentTypeId" label="instrumentTypeId" width="150%"></el-table-column>
      <el-table-column prop="instrumentGroupId" label="instrumentGroupId" width="150%"></el-table-column>
      <el-table-column prop="instrumentName" label="instrumentName" width="140%"></el-table-column>
      <el-table-column prop="online" :formatter="formatOnline" label="isOnline"></el-table-column>
      <el-table-column prop="location" label="location"></el-table-column>
      <el-table-column prop="communicateType" label="communicateType" width="150%"></el-table-column>
      <el-table-column prop="baudRate" label="baudRate" width="100%"></el-table-column>
      <el-table-column prop="bitSize" label="bitSize"></el-table-column>
      <el-table-column prop="parity" label="parity"></el-table-column>
      <el-table-column prop="stopBits" label="stopBits"></el-table-column>
      <el-table-column prop="flowControl" label="flowControl" width="100%"></el-table-column>
      <el-table-column prop="bufferSize" label="bufferSize" width="100%"></el-table-column>
      <el-table-column prop="readTimeOut" label="readTimeOut" width="110%"></el-table-column>
      <el-table-column prop="writeTimeOut" label="writeTimeOut" width="110%"></el-table-column>
      <el-table-column prop="lineType" label="lineType"></el-table-column>
      <el-table-column prop="permissionCode" label="permissionCode" width="130%"></el-table-column>
      <el-table-column prop="lastActiveDate" label="lastActiveDate" width="130%"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="isEnabled" width="100%"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleInstrumentEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="instrumentDialogVisible" title="instrument" width="40%">
      <el-form :model="instrument" label-width="40%" label-position="left">
        <el-form-item label="instrumentTypeId">
          <el-input v-model="instrument.instrumentTypeId" placeholder="instrumentTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentGroupId">
          <el-input v-model="instrument.instrumentGroupId" placeholder="instrumentGroupId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentName">
          <el-input v-model="instrument.instrumentName" placeholder="instrumentName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="isOnline">
          <el-switch
            v-model="instrument.online"
            active-text="在线"
            inactive-text="不在线">
          </el-switch>
        </el-form-item>
        <el-form-item label="location">
          <el-input v-model="instrument.location" placeholder="location" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="communicateType">
          <el-input v-model="instrument.communicateType" placeholder="communicateType" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="baudRate">
          <el-input v-model="instrument.baudRate" placeholder="baudRate" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="bitSize">
          <el-input v-model="instrument.bitSize" placeholder="bitSize" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="parity">
          <el-input v-model="instrument.parity" placeholder="parity" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="stopBits">
          <el-input v-model="instrument.stopBits" placeholder="stopBits" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="flowControl">
          <el-input v-model="instrument.flowControl" placeholder="flowControl" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="bufferSize">
          <el-input v-model="instrument.bufferSize" placeholder="bufferSize" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="readTimeOut">
          <el-input v-model="instrument.readTimeOut" placeholder="readTimeOut" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="writeTimeOut">
          <el-input v-model="instrument.writeTimeOut" placeholder="writeTimeOut" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="lineType">
          <el-input v-model="instrument.lineType" placeholder="lineType" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="permissionCode">
          <el-input v-model="instrument.permissionCode" placeholder="permissionCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="lastActiveDate">
<!--          <el-input v-model="instrument.lastActiveDate" placeholder="lastActiveDate" style="width: 90%"/>-->
          <el-date-picker
            v-model="instrument.lastActiveDate"
            type="datetime"
            placeholder="选择日期"
            style="width: 90%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="IsEnabled">
          <el-switch
            v-model="instrument.enabled"
            active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="instrumentDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmInstrumentEdit(instrument)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'instrument',
    data() {
      return {
        tableData: [],
        instrumentDialogVisible: false,
        instrument: {},
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
              this.getInstruments(list[0].hospitalId);
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
      getInstruments(hospitalId) {
        this.req({
          url: "/setting/instrument",
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
      handleInstrumentEdit(row) {
        this.instrumentDialogVisible = true;
        this.instrument = row;
        this.type = 'edit';
      },
      confirmInstrumentEdit(instrument) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/instrument",
            params: {
              "type": "modify"
            },
            data: {
              "instrumentId": instrument.instrumentId,
              "hospitalId": instrument.hospitalId,
              "instrumentTypeId": instrument.instrumentTypeId,
              "instrumentGroupId": instrument.instrumentGroupId,
              "instrumentName": instrument.instrumentName,
              "online": instrument.online,
              "location": instrument.location,
              "communicateType": instrument.communicateType,
              "baudRate": instrument.baudRate,
              "bitSize": instrument.bitSize,
              "parity": instrument.parity,
              "stopBits": instrument.stopBits,
              "flowControl": instrument.flowControl,
              "bufferSize": instrument.bufferSize,
              "readTimeOut": instrument.readTimeOut,
              "writeTimeOut": instrument.writeTimeOut,
              "lineType": instrument.lineType,
              "permissionCode": instrument.permissionCode,
              "lastActiveDate": instrument.lastActiveDate,
              "enabled": instrument.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.getInstruments(this.hospitalValue[0]);
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
            url: "/setting/instrument",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "instrumentId": instrument.instrumentId,
              "instrumentTypeId": instrument.instrumentTypeId,
              "instrumentGroupId": instrument.instrumentGroupId,
              "instrumentName": instrument.instrumentName,
              "online": instrument.online,
              "location": instrument.location,
              "communicateType": instrument.communicateType,
              "baudRate": instrument.baudRate,
              "bitSize": instrument.bitSize,
              "parity": instrument.parity,
              "stopBits": instrument.stopBits,
              "flowControl": instrument.flowControl,
              "bufferSize": instrument.bufferSize,
              "readTimeOut": instrument.readTimeOut,
              "writeTimeOut": instrument.writeTimeOut,
              "lineType": instrument.lineType,
              "permissionCode": instrument.permissionCode,
              "lastActiveDate": instrument.lastActiveDate,
              "enabled": instrument.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getInstruments(this.hospitalValue[0]);
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
        this.instrumentDialogVisible = true;
        this.instrument = {};
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
            url: "/setting/instrument",
            params: {
              "type": "delete"
            },
            data: {
              "instrumentId": row.instrumentId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getInstruments(this.hospitalValue[0]);
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
      formatOnline(row) {
        let ret = ''
        if (row.online) {
          ret = "在线"
        } else {
          ret = "不在线"
        }
        return ret;
      },
      selectDown() {
        this.getInstruments(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
