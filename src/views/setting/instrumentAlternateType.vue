<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="instrumentAlternateTypeName" label="instrumentAlternateTypeName"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleInstrumentAlternateTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="instrumentAlternateTypeDialogVisible" title="instrumentAlternateType" width="40%">
      <el-form :model="instrumentAlternateType" label-width="40%" label-position="left">
        <el-form-item label="instrumentAlternateTypeName">
          <el-input v-model="instrumentAlternateType.instrumentAlternateTypeName" placeholder="instrumentAlternateTypeName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="instrumentAlternateTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmInstrumentAlternateTypeEdit(instrumentAlternateType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'instrumentAlternateType',
    data() {
      return {
        tableData: [],
        instrumentAlternateTypeDialogVisible: false,
        instrumentAlternateType: {},
        type: ''
      };
    },
    mounted () {
      this.getInstrumentAlternateTypes();
    },
    methods: {
      getInstrumentAlternateTypes() {
        this.req({
          url: "/setting/instrumentAlternateType",
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
      handleInstrumentAlternateTypeEdit(row) {
        this.instrumentAlternateTypeDialogVisible = true;
        this.instrumentAlternateType = row;
        this.type = 'edit';
      },
      confirmInstrumentAlternateTypeEdit(instrumentAlternateType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/instrumentAlternateType",
            params: {
              "type": "modify"
            },
            data: {
              "instrumentAlternateTypeId": instrumentAlternateType.instrumentAlternateTypeId,
              "instrumentAlternateTypeName": instrumentAlternateType.instrumentAlternateTypeName
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
            url: "/setting/instrumentAlternateType",
            params: {
              "type": "create"
            },
            data: {
              "instrumentAlternateTypeName": instrumentAlternateType.instrumentAlternateTypeName
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getInstrumentAlternateTypes();
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
        this.instrumentAlternateTypeDialogVisible = true;
        this.instrumentAlternateType = {};
        this.type = 'create';
      },
      handleDelete(instrumentAlternateType) {
        this.$confirm('此操作将永久删除该instrumentAlternateType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/instrumentAlternateType",
            params: {
              "type": "delete"
            },
            data: {
              "instrumentAlternateTypeId": instrumentAlternateType.instrumentAlternateTypeId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getInstrumentAlternateTypes();
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
    },
  }
</script>

<style scoped>

</style>
