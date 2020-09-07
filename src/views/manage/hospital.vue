<template>
  <div class="hospital-root">
    <div class="add-hospital">
      <el-button type="primary" @click="handleCreate">新增医院</el-button>
    </div>
    <div class="hospital-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="group" label="医院代码"></el-table-column>
        <el-table-column prop="groupDescription" label="医院名称"></el-table-column>
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
      <el-dialog :visible.sync="dialogVisible" :title="'医院信息'" width="30%">
        <el-form :model="group" label-width="80px" label-position="left">
          <el-form-item label="医院代码">
            <el-input v-model="group.group" placeholder="group" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="医院名称">
            <el-input v-model="group.groupDescription" placeholder="groupDescription" style="width: 90%"/>
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
      name: "group",
      data() {
        return {
          group: {},
          dialogVisible: false,
          dialogType: 'new',
          tableData: [],
          keyword: ''
        };
      },
      mounted () {
        this.getGroups();
      },
      methods: {
        //获取医院组的信息
        getGroups() {
          this.req({
            url: "/security/group",
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
        //删除医院组
        handleDelete(row) {
          this.$confirm('此操作将永久删除该医院, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.req({
              url: "/security/group",
              data: {
                "groupId": row.groupId,
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
                this.getUsers();
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
        // 创建组
        handleCreate() {
          this.dialogVisible = true;
          this.dialogType = 'new';
          this.group = {};
        },
        // 编辑医院组信息
        handleEdit(row) {
          this.dialogVisible = true;
          this.dialogType = 'edit';
          this.group = row;
        },
        // 保存,新建医院组
        confirmEdit(hospital){
          if (this.dialogType !== 'edit') {
            this.req({
              url: "/security/group",
              params: {
                "type": "create",
              },
              data: {
                "group": hospital.group,
                "groupDescription": hospital.groupDescription,
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getGroups();
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
              url: "/security/group",
              params: {
                "type": "modify",
              },
              data: {
                "groupId": hospital.groupId,
                "group": hospital.group,
                "groupDescription": hospital.groupDescription,
              },
              method: "POST"
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getGroups();
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
  .hospital-table{
    margin-left: 3%;
    margin-right: 3%;
  }
  .add-hospital{
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
