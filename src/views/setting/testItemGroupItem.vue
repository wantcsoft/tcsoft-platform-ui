<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="testItemGroupId" label="testItemGroupId"></el-table-column>
      <el-table-column prop="testItemId" label="testItemId"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleTestItemGroupItemEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="testItemGroupItemDialogVisible" title="testItemGroupItem" width="40%">
      <el-form :model="testItemGroupItem" label-width="40%" label-position="left">
        <el-form-item label="testItemGroupId">
          <el-input v-model="testItemGroupItem.testItemGroupId" placeholder="testItemGroupId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="testItemId">
          <el-input v-model="testItemGroupItem.testItemId" placeholder="testItemId" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="testItemGroupItemDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmTestItemGroupItemEdit(testItemGroupItem)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'testItemGroupItem',
    data() {
      return {
        tableData: [],
        testItemGroupItemDialogVisible: false,
        testItemGroupItem: {},
        type: ''
      };
    },
    mounted () {
      this.getTestItemGroupItems();
    },
    methods: {
      getTestItemGroupItems() {
        this.req({
          url: "/setting/testItemGroupItem",
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
      handleTestItemGroupItemEdit(row) {
        this.testItemGroupItemDialogVisible = true;
        this.testItemGroupItem = row;
        this.type = 'edit';
      },
      confirmTestItemGroupItemEdit(testItemGroupItem) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/testItemGroupItem",
            params: {
              "type": "modify"
            },
            data: {
              "testItemGroupId": testItemGroupItem.testItemGroupId,
              "testItemId": testItemGroupItem.testItemId
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
            url: "/setting/testItemGroupItem",
            params: {
              "type": "create"
            },
            data: {
              "testItemGroupId": testItemGroupItem.testItemGroupId,
              "testItemId": testItemGroupItem.testItemId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroupItems();
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
        this.testItemGroupItemDialogVisible = true;
        this.testItemGroupItem = {};
        this.type = 'create';
      },
      handleDelete(testItemGroupItem) {
        this.$confirm('此操作将永久删除该testItemGroupItem, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/testItemGroupItem",
            params: {
              "type": "delete"
            },
            data: {
              "testItemGroupId": testItemGroupItem.testItemGroupId,
              "testItemId": testItemGroupItem.testItemId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getTestItemGroupItems();
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
