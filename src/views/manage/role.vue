<template>
  <div class="role-root">
    <div class="role-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="role" label="角色代码"></el-table-column>
        <el-table-column prop="roleDescription" label="角色名称"></el-table-column>
      </el-table>
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
            url: "/security/getRole",
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
      }
    }
</script>

<style scoped>
  .role-table{
    margin-top: 3%;
    margin-left: 3%;
    margin-right: 3%;
  }
  .page-button{
    margin-top: 3%;
    margin-left: 70%;
    margin-bottom: 10%;
  }
</style>
