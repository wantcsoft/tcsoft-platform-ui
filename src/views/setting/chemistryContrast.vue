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
      <el-table-column prop="testItemId" label="TestItemID"></el-table-column>
      <el-table-column prop="sampleTypeId" label="SampleTypeID"></el-table-column>
      <el-table-column prop="instrumentId" label="InstrumentID"></el-table-column>
      <el-table-column prop="chemCode" label="ChemCode"></el-table-column>
      <el-table-column prop="programmed" :formatter="formatProgramme" label="IsProgrammed"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope" >
          <el-button size="mini" type="primary" @click="handleChemistryContrastEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="chemistryContrastDialogVisible" title="ChemistryContrast" width="30%">
      <el-form :model="chemistryContrast" label-width="40%" label-position="left">
        <el-form-item label="testItemId">
          <el-input v-model="chemistryContrast.testItemId" placeholder="testItemId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="sampleTypeId">
          <el-input v-model="chemistryContrast.sampleTypeId" placeholder="sampleTypeId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="instrumentId">
          <el-input v-model="chemistryContrast.instrumentId" placeholder="instrumentId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="chemCode">
          <el-input v-model="chemistryContrast.chemCode" placeholder="chemCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="programmed">
          <el-switch
            v-model="chemistryContrast.programmed"
            active-text="已编程"
            inactive-text="未编程">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="chemistryContrastDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmChemistryContrastEdit(chemistryContrast)">save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'chemistryContrast',
    data() {
      return {
        tableData: [],
        chemistryContrastDialogVisible: false,
        chemistryContrast: {},
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
              this.getChemistryContrasts(list[0].hospitalId);
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
      getChemistryContrasts(hospitalId) {
        this.req({
          url: "/setting/chemistryContrast",
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
      handleChemistryContrastEdit(row) {
        this.chemistryContrastDialogVisible = true;
        this.chemistryContrast = row;
        this.type = 'edit';
      },
      confirmChemistryContrastEdit(chemistryContrast) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/chemistryContrast",
            params: {
              "type": "modify"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "testItemId": chemistryContrast.testItemId,
              "sampleTypeId": chemistryContrast.sampleTypeId,
              "instrumentId": chemistryContrast.instrumentId,
              "chemCode": chemistryContrast.chemCode,
              "programmed": chemistryContrast.programmed,
            },
            method: "POST"
          }).then(
            res => {
              this.getChemistryContrasts(this.hospitalValue[0]);
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
            url: "/setting/chemistryContrast",
            params: {
              "type": "create"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "testItemId": chemistryContrast.testItemId,
              "sampleTypeId": chemistryContrast.sampleTypeId,
              "instrumentId": chemistryContrast.instrumentId,
              "chemCode": chemistryContrast.chemCode,
              "programmed": chemistryContrast.programmed,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getChemistryContrasts(this.hospitalValue[0]);
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
        this.chemistryContrastDialogVisible = true;
        this.chemistryContrast = {};
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
            url: "/setting/chemistryContrast",
            params: {
              "type": "delete"
            },
            data: {
              "hospitalId": this.hospitalValue[0],
              "testItemId": row.testItemId,
              "sampleTypeId": row.sampleTypeId,
              "instrumentId": row.instrumentId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getChemistryContrasts(this.hospitalValue[0]);
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
      formatProgramme(row){
        let ret = ''
        if (row.programmed) {
          ret = "已编程"
        } else {
          ret = "未编程"
        }
        return ret;
      },
      selectDown() {
        this.getChemistryContrasts(this.hospitalValue[0]);
      },
    }
  }
</script>

<style scoped>

</style>
