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

    <el-table :data="tableData" stripe size="mini">
      <el-table-column prop="instrumentName" label="instrumentName" width="120%"></el-table-column>
      <el-table-column prop="instrumentTypeName" label="instrumentType" width="110%"></el-table-column>
      <el-table-column prop="instrumentGroupName" label="instrumentGroup" width="120%"></el-table-column>
      <el-table-column prop="lineTypeName" label="lineType" width="80%"></el-table-column>
      <el-table-column prop="location" label="location" width="90%"></el-table-column>
      <el-table-column prop="permissionCode" label="permissionCode" width="130%"></el-table-column>
      <el-table-column prop="lastActiveDate" label="lastActiveDate" width="130%"></el-table-column>
      <el-table-column prop="communicateType" label="communicateType" width="130%"></el-table-column>
      <el-table-column prop="baudRate" label="baudRate" width="80%"></el-table-column>
      <el-table-column prop="bitSize" label="bitSize" width="60%"></el-table-column>
      <el-table-column prop="parity" label="parity" width="60%"></el-table-column>
      <el-table-column prop="stopBits" label="stopBits" width="70%"></el-table-column>
      <el-table-column prop="flowControl" label="flowControl" width="90%"></el-table-column>
      <el-table-column prop="bufferSize" label="bufferSize" width="80%"></el-table-column>
      <el-table-column prop="readTimeOut" label="readTimeOut" width="100%"></el-table-column>
      <el-table-column prop="writeTimeOut" label="writeTimeOut" width="100%"></el-table-column>
      <el-table-column prop="online" :formatter="formatOnline" label="isOnline" width="80%"></el-table-column>
      <el-table-column prop="enabled" :formatter="formatEnable" label="isEnabled" width="80%"></el-table-column>
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
        <el-form-item label="instrumentName">
          <el-input v-model="instrument.instrumentName" placeholder="instrumentName" style="width: 90%"/>
        </el-form-item>
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
        <el-form-item label="lineType">
          <template>
            <el-select v-model="lineTypeValue" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in lineTypeData"
                :key="item.lineTypeName"
                :label="item.lineTypeName"
                :value="item.lineTypeId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="location">
          <el-input v-model="instrument.location" placeholder="location" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="permissionCode">
          <el-input v-model="instrument.permissionCode" placeholder="permissionCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="lastActiveDate">
          <el-date-picker
            v-model="instrument.lastActiveDate"
            type="datetime"
            placeholder="选择日期"
            style="width: 90%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="communicateType">
          <template>
            <el-input-number v-model="instrument.communicateType" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="baudRate">
          <template>
            <el-input-number v-model="instrument.baudRate" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="bitSize">
          <template>
            <el-input-number v-model="instrument.bitSize" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="parity">
          <template>
            <el-input-number v-model="instrument.parity" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="stopBits">
          <template>
            <el-input-number v-model="instrument.stopBits" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="flowControl">
          <template>
            <el-input-number v-model="instrument.flowControl" :min="1" :max="3"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="bufferSize">
          <template>
            <el-input-number v-model="instrument.bufferSize" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="readTimeOut">
          <template>
            <el-input-number v-model="instrument.readTimeOut" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="writeTimeOut">
          <template>
            <el-input-number v-model="instrument.writeTimeOut" :min="1" :max="999999999"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="isOnline">
          <el-switch
            v-model="instrument.online"
            active-text="在线"
            inactive-text="不在线">
          </el-switch>
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
        <el-button type="primary" @click="confirmInstrumentEdit(instrument, instrumentTypeValue, instrumentGroupValue, lineTypeValue)">save</el-button>
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
        instrumentTypeData: [],
        instrumentTypeValue: '',
        instrumentGroupData: [],
        instrumentGroupValue: '',
        lineTypeData: [],
        lineTypeValue: '',

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
              this.getInstrumentTypes(list[0].hospitalId);
              this.getInstrumentGroups(list[0].hospitalId);
              this.getLineTypes();
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
      getLineTypes() {
        this.req({
          url: "/setting/lineType",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.lineTypeData = res.data.data;
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
        this.instrumentTypeValue = row.instrumentTypeId;
        this.instrumentGroupValue = row.instrumentGroupId;
        this.lineTypeValue = row.lineType;
      },
      confirmInstrumentEdit(instrument, instrumentTypeValue, instrumentGroupValue, lineTypeValue) {
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
              "lineType": lineTypeValue,
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
              "instrumentTypeId": instrumentTypeValue,
              "instrumentGroupId": instrumentGroupValue,
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
              "lineType": lineTypeValue,
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
        this.instrumentTypeValue = '';
        this.instrumentGroupValue = '';
        this.lineTypeValue = '';
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
        this.getInstrumentTypes(this.hospitalValue[0]);
        this.getInstrumentGroups(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
