<template>
  <div class="authority-root">
    <div class="add-authority">
      <el-button type="primary" @click="handleCreate">新增权限</el-button>
    </div>
    <div class="authority-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="authority" label="权限代码"></el-table-column>
        <el-table-column prop="authorityDescription" label="权限名称"></el-table-column>
        <el-table-column  label="编辑">
          <template slot-scope="scope" >
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column  label="删除">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" :title="'权限信息'" width="30%">
        <el-form :model="authority" label-width="80px" label-position="left">
          <el-form-item label="权限代码">
            <el-input v-model="authority.authority" placeholder="authority" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input v-model="authority.authorityDescription" placeholder="authorityDescription" style="width: 90%"/>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmEdit(authority)">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="page-button">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
        <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
    export default {
      name: "authority",
      data() {
        return {
          authority: {},
          dialogVisible: false,
          dialogType: 'new',
          tableData: [],
          keyword: ''
        };
      },
      mounted () {
        this.getAuthority();
      },
      methods: {
        //获取所有的权限信息
        getAuthority() {
          this.req({
            url: "/security/authority",
            method: "GET",
          }).then(
            res => {
              this.tableData = res.data.data;
            },
            err => {
              console.log("err :", err);
            }
          );
        },
        //删除某个权限信息
        handleDelete(row) {
          this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.req({
              url: "/security/group",
              data: {
                "authorityId": row.authorityId
              },
              params: {
                "type": "delete"
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message,
                });
                this.getAuthority();
              },
              err => {
                console.log("err :", err);
              }
            );
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        // 创建权限信息
        handleCreate() {
          this.dialogVisible = true;
          this.dialogType = 'new';
          this.authority = {};
        },
        // 编辑权限信息
        handleEdit(row) {
          this.dialogVisible = true;
          this.dialogType = 'edit';
          this.authority = row;
        },
        // 保存,新建权限信息
        confirmEdit(authority){
          if (this.dialogType !== 'edit') {
            this.req({
              url: "/security/authority",
              params: {
                "type": "create",
              },
              data: {
                "authority": authority.authority,
                "authorityDescription": authority.authorityDescription,
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getAuthority();
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
          else {
            this.req({
              url: "/security/authority",
              params: {
                "type": "modify",
              },
              data: {
                "authorityId": authority.authorityId,
                "authority": authority.authority,
                "authorityDescription": authority.authorityDescription,
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getAuthority();
              },
              err => {
                console.log("err :", err);
                this.$message({
                  type: 'info',
                  message: '修改失败'
                });
              }
            );
          }
        },
      }
    }
</script>

<style scoped>
  .authority-table{
    margin-left: 3%;
    margin-right: 3%;
  }
  .add-authority{
    display: block;
    float: right;
    margin-top: 3%;
    margin-right: 10%;
  }
  .page-button{
    margin-top: 3%;
    margin-left: 70%;
    margin-bottom: 10%;
  }
</style>
