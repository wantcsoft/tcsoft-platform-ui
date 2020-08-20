<template>
  <div class="role-root">
    <div class="add-role">
      <el-button type="primary" @click="handleCreate">新增角色</el-button>
    </div>
    <div class="role-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="roleId" label="角色ID"></el-table-column>
        <el-table-column prop="role" label="角色代码"></el-table-column>
        <el-table-column prop="roleDescription" label="角色名称"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            <span>&nbsp;&nbsp;</span>
            <i class="el-icon-delete" @click="handleDelete(scope.row, scope.index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" :title="'角色信息'" width="30%">
        <el-form :model="role" label-width="80px" label-position="left">
          <el-form-item label="角色代码">
            <el-input v-model="role.role" placeholder="role" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="role.roleDescription" placeholder="roleDescription" style="width: 90%"/>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmEdit(group)">确认</el-button>
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
        name: "role",
      data() {
        return {
          role: {},
          dialogVisible: false,
          dialogType: 'new',
          tableData: [],
          keyword: ''
        };
      },
      mounted () {
        this.getRoles();
      },
      methods: {
        //获取角色的信息
        getRoles() {
          this.req({
            url: "/security/role",
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
        //删除角色
        // handleDelete(row, index) {
        //   this.$confirm('此操作将永久删除该医院, 是否继续?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning',
        //     center: true
        //   }).then(() => {
        //     this.req({
        //       url: "/security/group",
        //       data: {
        //         "userId": row.userId
        //       },
        //       params: {
        //         "type": "delete"
        //       },
        //       method: "POST"
        //     }).then(
        //       res => {
        //         this.getUsers();
        //       },
        //       err => {
        //         console.log("err :", err);
        //       }
        //     );
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     });
        //   }).catch(() => {
        //     this.$message({
        //       type: 'info',
        //       message: '已取消删除'
        //     });
        //   });
        // },
        // 创建组
        // handleCreate() {
        //   this.dialogVisible = true;
        //   this.dialogType = 'new';
        //   this.group = {};
        // },
        // 编辑医院组信息
        // handleEdit(row) {
        //   this.dialogVisible = true;
        //   this.dialogType = 'edit';
        //   this.group = row;
        // },
        // 保存,新建医院组
        // confirmEdit(hospital){
        //   if (this.dialogType !== 'edit') {
        //     this.req({
        //       url: "/security/group",
        //       params: {
        //         "type": "create",
        //       },
        //       data: {
        //         "group": hospital.group,
        //         "groupDescription": hospital.groupDescription,
        //       },
        //       method: "POST"
        //     }).then(
        //       res => {
        //         this.$message({
        //           type: 'success',
        //           message: res.data.message
        //         });
        //         this.getGroups();
        //       },
        //       err => {
        //         console.log("err :", err);
        //         this.$message({
        //           type: 'info',
        //           message: '创建失败'
        //         });
        //       }
        //     );
        //   }
        //   else {
        //     this.req({
        //       url: "/security/group",
        //       params: {
        //         "type": "modify",
        //       },
        //       data: {
        //         "groupId": hospital.groupId,
        //         "group": hospital.group,
        //         "groupDescription": hospital.groupDescription,
        //       },
        //       method: "POST"
        //     }).then(
        //       res => {
        //         this.$message({
        //           type: 'success',
        //           message: res.data.message
        //         });
        //         this.getGroups();
        //       },
        //       err => {
        //         console.log("err :", err);
        //         this.$message({
        //           type: 'info',
        //           message: '修改失败'
        //         });
        //       }
        //     );
        //   }
        // },
      }
    }
</script>

<style scoped>
  .role-table{
    margin-left: 3%;
    margin-right: 3%;
  }
  .add-role{
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
