<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="sexTypeName" label="sexTypeName"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleSexTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sexTypeDialogVisible" title="sexType" width="40%">
      <el-form :model="sexType" label-width="40%" label-position="left">
        <el-form-item label="sexTypeName">
          <el-input v-model="sexType.sexTypeName" placeholder="sexTypeName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="sexTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmSexTypeEdit(sexType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'sexType',
    data() {
      return {
        tableData: [],
        sexTypeDialogVisible: false,
        sexType: {},
        type: ''
      };
    },
    mounted () {
      this.getSexTypes();
    },
    methods: {
      getSexTypes() {
        this.req({
          url: "/setting/sexType",
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
      handleSexTypeEdit(row) {
        this.sexTypeDialogVisible = true;
        this.sexType = row;
        this.type = 'edit';
      },
      confirmSexTypeEdit(sexType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/sexType",
            params: {
              "type": "modify"
            },
            data: {
              "sexTypeId": sexType.sexTypeId,
              "sexTypeName": sexType.sexTypeName
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
            url: "/setting/sexType",
            params: {
              "type": "create"
            },
            data: {
              "sexTypeName": sexType.sexTypeName,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSexTypes();
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
        this.sexTypeDialogVisible = true;
        this.sexType = {};
        this.type = 'create';
      },
      handleDelete(sexType) {
        this.$confirm('此操作将永久删除该sexType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/sexType",
            params: {
              "type": "delete"
            },
            data: {
              "sexTypeId": sexType.sexTypeId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSexTypes();
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
