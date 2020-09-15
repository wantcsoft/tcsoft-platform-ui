<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="lineTypeCode" label="lineTypeCode"></el-table-column>
      <el-table-column prop="lineTypeName" label="lineTypeName"></el-table-column>
      <el-table-column prop="comment" label="comment"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleLineTypeEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="lineTypeDialogVisible" title="lineType" width="40%">
      <el-form :model="lineType" label-width="40%" label-position="left">
        <el-form-item label="lineTypeCode">
          <el-input v-model="lineType.lineTypeCode" placeholder="lineTypeCode" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="lineTypeName">
          <el-input v-model="lineType.lineTypeName" placeholder="lineTypeName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="comment">
          <el-input v-model="lineType.comment" placeholder="comment" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="lineTypeDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmLineTypeEdit(lineType)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'lineType',
    data() {
      return {
        tableData: [],
        lineTypeDialogVisible: false,
        lineType: {},
        type: ''
      };
    },
    mounted () {
      this.getLineTypes();
    },
    methods: {
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
      handleLineTypeEdit(row) {
        this.lineTypeDialogVisible = true;
        this.lineType = row;
        this.type = 'edit';
      },
      confirmLineTypeEdit(lineType) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/lineType",
            params: {
              "type": "modify"
            },
            data: {
              "lineTypeId": lineType.lineTypeId,
              "lineTypeCode": lineType.lineTypeCode,
              "lineTypeName": lineType.lineTypeName,
              "comment": lineType.comment,
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
            url: "/setting/lineType",
            params: {
              "type": "create"
            },
            data: {
              "lineTypeCode": lineType.lineTypeCode,
              "lineTypeName": lineType.lineTypeName,
              "comment": lineType.comment,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getLineTypes();
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
        this.lineTypeDialogVisible = true;
        this.lineType = {};
        this.type = 'create';
      },
      handleDelete(lineType) {
        this.$confirm('此操作将永久删除该lineType, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/lineType",
            params: {
              "type": "delete"
            },
            data: {
              "lineTypeId": lineType.lineTypeId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getLineTypes();
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
