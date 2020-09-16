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
        <el-table-column  label="权限">
          <template slot-scope="scope" >
            <el-button size="mini" type="primary" @click="handleAuthority(scope.row)">授权</el-button>
          </template>
        </el-table-column>
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

      <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新建用户'" width="30%">
        <el-form :model="user" label-width="80px" label-position="left">
          <el-form-item label="分组">
            <template>
              <el-select v-model="groupValue" placeholder="请选择" style="width: 90%">
                <el-option
                  v-for="item in groupData"
                  :key="item.group"
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
                  :key="item.role"
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
          <el-button type="primary" @click="confirmEdit(user, groupValue, roleValue)">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog title="权限管理" :visible.sync="authorityDialogVisible" width="44%" center>
        <template>
          <el-transfer v-model="authorityValue" :data="authorityData" :titles="['所有权限', '已有权限']"></el-transfer>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="authorityDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyAuthority">确 定</el-button>
        </span>
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
        authorityDialogVisible: false,
        authorityData: [],
        authorityValue: [],
        userId: 0,

        dialogType: 'new',
        tableData: [],

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
      this.getAuthority();
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
          url: "/security/user",
          method: "GET",
        }).then(
          res => {
            if (res.data.code === 200){
              this.tableData = res.data.data;
            }
          },
          err => {
            console.log("err :", err);
          }
        );
      },
      //获取角色的信息
      getRoles () {
        this.req({
          url: "/security/getRole",
          method: "GET",
        }).then(
          res => {
            this.roleData = res.data.data;
          },
          err => {
            console.log("err :", err);
          }
        );
      },
      // 获取权限信息
      getAuthority() {
        this.req({
          url: "/security/authority",
          method: "GET",
        }).then(
          res => {
            for (let i=0; i<res.data.data.length; i++){
              this.authorityData.push({
                key: res.data.data[i].authorityId,
                label: res.data.data[i].authority,
              })
            }
          },
          err => {
            console.log("err :", err);
          }
        );
      },
      // 根据用户ID获取用户的权限
      getUserPermission(userId) {
        this.req({
          url: "/security/permission",
          params: {
            "userId": userId,
          },
          method: "GET",
        }).then(
          res => {
            this.authorityValue = [];
            for (let i=0; i<res.data.data.length; i++){
              this.authorityValue.push(res.data.data[i].authorityId);
            }
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
            url: "/security/user",
            params: {
              "username": this.keyword
            },
            method: "GET"
          }).then(
            res => {
              this.tableData = res.data.data;
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
      handleDelete(row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/security/user",
            data: {
              "userId": row.userId,
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
        this.dialogType = 'new';
        this.user = Object.assign({}, defaultUser);
        this.groupValue = '';
        this.roleValue = '';
      },
      // 编辑用户信息
      handleEdit(row) {
        this.dialogVisible = true;
        this.dialogType = 'edit';
        this.user = row;
        this.groupValue = row.group;
        this.roleValue = row.role;
      },
      // 保存,新建用户
      confirmEdit(user, groupValue, roleValue){
        this.dialogVisible = false;
        if (this.dialogType !== 'edit') {
          this.req({
            url: "/security/user",
            params: {
              "type": "create"
            },
            data: {
              "groupId": groupValue,
              "roleId": roleValue,
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
              "groupId": groupValue,
              "roleId": roleValue,
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
      formatLock(row) {
        let ret = ''
        if (row.accountNonLocked) {
          ret = "锁定"
        } else {
          ret = "未锁定"
        }
        return ret;
      },
      // 账户是和否启用值转换
      formatEnable(row){
        let ret = ''
        if (row.enabled) {
          ret = "启用"
        } else {
          ret = "未启用"
        }
        return ret;
      },
      // 查看用户的权限
      handleAuthority(row) {
        this.authorityDialogVisible = true;
        this.getUserPermission(row.userId);
        this.userId = row.userId;
      },
      // 编辑用户的权限
      modifyAuthority() {
        this.authorityDialogVisible = false;
        this.req({
          url: "/security/permission",
          params: {
            "userId": this.userId,
          },
          data: this.authorityValue,
          method: "POST",
        }).then(
          res => {
            this.$message({
              type: 'success',
              message: res.data.message
            });
          },
          err => {
            console.log("err :", err);
          }
        );
      },
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
