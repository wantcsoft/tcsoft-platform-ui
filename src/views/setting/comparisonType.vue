<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="comparisonTypeName" label="ComparisonTypeName"></el-table-column>
      <el-table-column prop="comparisonTableName" label="ComparisonTableName"></el-table-column>
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

    <el-dialog :visible.sync="comparisonTypeDialogVisible" title="comparisonType" width="40%">
      <el-form :model="comparisonType" label-width="40%" label-position="left">
        <el-form-item label="ComparisonTypeName">
          <el-input v-model="comparisonType.comparisonTypeName" placeholder="ComparisonTypeName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="ComparisonTableName">
          <el-input v-model="comparisonType.comparisonTableName" placeholder="ComparisonTableName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="comparisonTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmComparisonTypeEdit(comparisonType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'comparisonType',
    data() {
      return {
        tableData: [],
        comparisonTypeDialogVisible: false,
        comparisonType: {},
        type: ''
      };
    },
    mounted () {
      this.getComparisonTypes();
    },
    methods: {
      getComparisonTypes() {
        this.req({
          url: "/setting/comparisonType",
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
      handleComparisonTypeEdit(row) {
        this.comparisonTypeDialogVisible = true;
        this.comparisonType = row;
        this.type = 'edit';
      },
      confirmComparisonTypeEdit(comparisonType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/comparisonType",
            params: {
              "type": "modify"
            },
            data: {
              "comparisonTypeId": comparisonType.comparisonTypeId,
              "comparisonTypeName": comparisonType.comparisonTypeName,
              "comparisonTableName": comparisonType.comparisonTableName
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
            url: "/setting/comparisonType",
            params: {
              "type": "create"
            },
            data: {
              "comparisonTypeName": comparisonType.comparisonTypeName,
              "comparisonTableName": comparisonType.comparisonTableName
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
        this.comparisonTypeDialogVisible = true;
        this.comparisonType = {};
        this.type = 'create';
      },
      handleDelete(comparisonType) {
        this.$confirm('此操作将永久删除该comparisonType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/comparisonType",
            params: {
              "type": "delete"
            },
            data: {
              "comparisonTypeId": comparisonType.comparisonTypeId
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
