<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="resultTypeName" label="resultType"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleComparisonTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="resultTypeDialogVisible" title="resultType" width="40%">
      <el-form :model="resultType" label-width="40%" label-position="left">
        <el-form-item label="resultType">
          <el-input v-model="resultType.resultTypeName" placeholder="resultType" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resultTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmComparisonTypeEdit(resultType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'resultType',
    data() {
      return {
        tableData: [],
        resultTypeDialogVisible: false,
        resultType: {},
        type: ''
      };
    },
    mounted () {
      this.getComparisonTypes();
    },
    methods: {
      getComparisonTypes() {
        this.req({
          url: "/setting/resultType",
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
      handleComparisonTypeEdit(row) {
        this.resultTypeDialogVisible = true;
        this.resultType = row;
        this.type = 'edit';
      },
      confirmComparisonTypeEdit(resultType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/resultType",
            params: {
              "type": "modify"
            },
            data: {
              "resultTypeId": resultType.resultTypeId,
              "resultTypeName": resultType.resultTypeName
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
            url: "/setting/resultType",
            params: {
              "type": "create"
            },
            data: {
              "resultTypeName": resultType.resultTypeName
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getComparisonTypes();
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
        this.resultTypeDialogVisible = true;
        this.resultType = {};
        this.type = 'create';
      },
      handleDelete(resultType) {
        this.$confirm('此操作将永久删除该resultType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/resultType",
            params: {
              "type": "delete"
            },
            data: {
              "resultTypeId": resultType.resultTypeId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getComparisonTypes();
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
