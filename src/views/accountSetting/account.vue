<template>
  <div class="root">
    <div style="margin-left: 5%; margin-top: 5%">
      <span style="font-weight: bold; font-size: 150%">账号设置</span>
    </div>
    <el-card class="box-card">
      <div style="margin: 5%;">
        <div class="account">
          <span>账号：</span>
          <span style="margin-left: 8%">{{ userName }}</span>
          <el-button size="mini" type="primary" @click="clickUserName"
                     style="float: right; margin-right: 20%">修改</el-button>
        </div>
        <el-divider></el-divider>
        <div class="password">
          <span>密码：</span>
          <span style="margin-left: 8%">**************</span>
          <el-button size="mini" type="primary" @click="clickPassword"
                     style="float: right; margin-right: 20%">修改</el-button>
        </div>
      </div>
    </el-card>

    <el-dialog :visible.sync="accountDialogVisible" width="30%">
      <el-form :model="newUserName" label-width="20%" label-position="middle">
        <el-form-item label="新账号:">
          <el-input v-model="newUserName" placeholder="新账号" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="accountDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="modifyUserName(newUserName)">save</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="passwordDialogVisible" width="30%">
      <el-form :model="newPassword" label-width="20%" label-position="middle">
        <el-form-item label="新密码:">
          <el-input v-model="newPassword" placeholder="新密码" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="passwordDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="modifyPassword(newPassword)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
      name: "account",
      data() {
        return {
          userId: 0,

          accountDialogVisible: false,
          newUserName: '',
          passwordDialogVisible: false,
          newPassword: '',

          userName: '',
          password: '',
        };
      },
      mounted () {
        this.fillUserName();
      },
      methods: {
        fillUserName() {
          this.userName = localStorage.getItem("userName");
          this.queryByUserName(this.userName);
        },
        clickUserName() {
          this.accountDialogVisible = true;
          this.newUserName = '';
        },
        clickPassword() {
          this.passwordDialogVisible = true;
          this.newPassword = '';
        },
        modifyUserName(newUserName) {
          this.accountDialogVisible = false;
          this.req({
            url: "/security/user",
            params: {
              "type": "modify"
            },
            data: {
              "userId": this.userId,
              "username": newUserName,
              "accountNonLocked": false,
              "enabled": true
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              localStorage.removeItem('hasLogin')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'info',
                message: '修改失败'
              });
            }
          );
        },
        modifyPassword(newPassword) {
          this.passwordDialogVisible = false;
          this.req({
            url: "/security/user",
            params: {
              "type": "modify"
            },
            data: {
              "userId": this.userId,
              "password": newPassword,
              "accountNonLocked": false,
              "enabled": true
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              localStorage.removeItem('hasLogin')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'info',
                message: '修改失败'
              });
            }
          );
        },
        queryByUserName(userName) {
          this.req({
            url: "/security/user",
            params: {
              "username": userName,
            },
            method: "GET"
          }).then(
            res => {
              this.userId = res.data.data[0].userId;
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
  .text {
    font-size: 14px;
  }

  .box-card {
    margin-top: 3%;
    margin-left: 5%;
    width: 90%;
  }
  .account {
    margin-bottom: 3%;
  }
  .password {
    margin-top: 3%;
  }
</style>
