<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="dataTypeName" label="dataTypeName"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDataTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dataTypeDialogVisible" title="dataType" width="40%">
      <el-form :model="dataType" label-width="40%" label-position="left">
        <el-form-item label="dataTypeName">
          <el-input v-model="dataType.dataTypeName" placeholder="dataTypeName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dataTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmDataTypeEdit(dataType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'dataType',
    data() {
      return {
        tableData: [],
        dataTypeDialogVisible: false,
        dataType: {},
        type: ''
      };
    },
    mounted () {
      this.getDataTypes();
    },
    methods: {
      getDataTypes() {
        this.req({
          url: "/setting/dataType",
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
      handleDataTypeEdit(row) {
        this.dataTypeDialogVisible = true;
        this.dataType = row;
        this.type = 'edit';
      },
      confirmDataTypeEdit(dataType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/dataType",
            params: {
              "type": "modify"
            },
            data: {
              "dataTypeId": dataType.dataTypeId,
              "dataTypeName": dataType.dataTypeName
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
            url: "/setting/dataType",
            params: {
              "type": "create"
            },
            data: {
              "dataTypeName": dataType.dataTypeName
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getDataTypes();
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
        this.dataTypeDialogVisible = true;
        this.dataType = {};
        this.type = 'create';
      },
      handleDelete(dataType) {
        this.$confirm('此操作将永久删除该dataType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/dataType",
            params: {
              "type": "delete"
            },
            data: {
              "dataTypeId": dataType.dataTypeId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getDataTypes();
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
