<template>
  <div class="user-root">
    <div class="search">
      <el-input placeholder="请输入账号" v-model="keyword" @keyup.enter.native="goSearch" clearable class="input-with-select">
        <el-button @click="goSearch" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="add-user">
      <el-button type="primary" @click="handleCreate">新增用户</el-button>
    </div>
    <div class="user-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="groupDescription" label="分组"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="roleDescription" label="角色"></el-table-column>
        <el-table-column prop="accountNonLocked" :formatter="formatLock" label="是否锁定"></el-table-column>
        <el-table-column prop="enabled" :formatter="formatEnable" label="是否启用"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            <span>&nbsp;&nbsp;</span>
            <i class="el-icon-delete" @click="handleDelete(scope.row, scope.index)"></i>
<!--            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>-->
<!--            <el-button type="text" size="small">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新建用户'" width="30%">
        <el-form :model="user" label-width="80px" label-position="left">
          <el-form-item label="分组">
            <template>
              <el-select v-model="groupValue" placeholder="请选择" style="width: 90%">
                <el-option
                  v-for="item in groupData"
                  :key="item.groupDescription"
                  :label="item.groupDescription"
                  :value="item.groupId">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="user.username" placeholder="username" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="user.password" placeholder="password" style="width: 90%"/>
          </el-form-item>
          <el-form-item label="角色">
            <template>
              <el-select v-model="roleValue" placeholder="请选择" style="width: 90%">
                <el-option
                  v-for="item in roleData"
                  :key="item.roleDescription"
                  :label="item.roleDescription"
                  :value="item.roleId">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="是否锁定">
            <el-switch
              v-model="user.accountNonLocked"
              active-text="锁定"
              inactive-text="未锁定">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              v-model="user.enabled"
              active-text="启用"
              inactive-text="未启用">
            </el-switch>
          </el-form-item>

        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmEdit(user)">确认</el-button>
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

  const defaultUser = {
    group: '',
    username: '',
    password: '',
    roles: '',
    accountNonLocked: false,
    enabled: true
  }
  export default {
    data() {
      return {
        user: Object.assign({}, defaultUser),
        dialogVisible: false,
        groupEdit: false,
        dialogType: 'new',
        tableData: [],
        groupId: 0,
        groupData: [],
        groupValue: '',
        roleData: [],
        roleValue: '',
        keyword: ''
      };
    },
    //这个属性就可以，在里面声明初始化时要调用的方法即可
    mounted () {
      this.getGroups();
      this.getUsers();
      this.getRoles();
    },
    methods: {
      //获取组的信息
      getGroups() {
        this.req({
          url: "/security/group",
          method: "GET",
        }).then(
          res => {
            this.groupData = res.data.data;
          },
          err => {
            console.log("err :", err);
          }
        );
      },
      // 获取所有的用户信息
      getUsers() {
        this.req({
          url: "/security/front/user",
          method: "GET",
        }).then(
          res => {
            if (res.data.code === 401){
              console.log(res);
              this.$router.push({ path: "/401" });
            }else {
              this.tableData = res.data.data;
            }
          },
          err => {
            console.log("err :", err);
          }
        );
      },
      //获取权限的信息
      getRoles () {
        let that = this;
        this.req({
          url: "/security/getRoles",
          method: "GET",
        }).then(
          res => {
            that.roleData = res.data.data;
          },
          err => {
            console.log("err :", err);
          }
        );
      },
      // 搜索
      goSearch() {
        if (this.keyword === ''){
          this.getUsers();
        }else {
          this.req({
            url: "/security/front/user",
            params: {
              "username": this.keyword
            },
            method: "GET"
          }).then(
            res => {
              this.tableData = res.data.data;
              console.log(res.data.data);
              this.$message({
                type: 'success',
                message: res.data.message
              });
            },
            err => {
              console.log("err :", err);
            }
          );
        }
      },
      //删除用户
      handleDelete(row, index) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/security/user",
            data: {
              "userId": row.userId
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
      // 创建用户
      handleCreate() {
        this.dialogVisible = true;
        this.groupEdit = true;
        this.dialogType = 'new';
        this.user = Object.assign({}, defaultUser);
        this.roleValue = '';
      },
      // 编辑用户信息
      handleEdit(row) {
        this.dialogVisible = true;
        this.groupEdit = false;
        this.dialogType = 'edit';
        this.user = row;
        this.groupValue = row.groupDescription;
        this.roleValue = row.roleDescription;
      },
      // 保存,新建用户
      confirmEdit(user){
        if (this.dialogType !== 'edit') {
          this.req({
            url: "/security/user",
            params: {
              "type": "create"
            },
            data: {
              "groupId": this.groupValue,
              "roleId": this.roleValue,
              "username": user.username,
              "password": user.password,
              "accountNonLocked": user.accountNonLocked,
              "enabled": user.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getUsers();
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
            url: "/security/user",
            params: {
              "type": "modify"
            },
            data: {
              "userId": user.userId,
              "groupId": this.groupValue,
              "roleId": this.roleValue,
              "username": user.username,
              "password": user.password,
              "accountNonLocked": user.accountNonLocked,
              "enabled": user.enabled
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getUsers();
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
      // 账户是否锁定值转换
      formatLock(row, column, value) {
        let ret = ''
        if (value) {
          ret = "锁定"
        } else {
          ret = "未锁定"
        }
        return ret;
      },
      // 账户是和否启用值转换
      formatEnable(row, column, value){
        let ret = ''
        if (value) {
          ret = "启用"
        } else {
          ret = "未启用"
        }
        return ret;
      }
    }
  };
</script>

<style>
  .user-table{
    margin-left: 3%;
    margin-right: 3%;
  }
  .search {
    display: block;
    float: left;
    width: 40%;
    margin-left: 3%;
    margin-top: 3%;
    margin-bottom: 1%;
  }
  .add-user{
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
