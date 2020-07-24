<template>
  <div class="develop-container">
    <div class="switch" style="padding-top: 6%; margin-left: 70%">
      <el-button type="primary" @click="toManagerPlat">管理平台</el-button>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form02"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container02">
        <h3 class="title">TCSOFT开发平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container02">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          id="account"
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container02">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          id="psw"
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd02" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        id="login_btn"
        :loading="loading"
        type="primary"
        style="width:40%;margin-bottom:30px; margin-left: 10%"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      <el-button
        id="registered_btn"
        :loading="loading"
        type="primary"
        style="width:40%;margin-bottom:30px;"
        @click.native.prevent="handleRegistered"
      >注册</el-button>
    </el-form>
    <div class="info02" style="bottom: 40px;">version: 1.0</div>
    <div class="info02">tcsoft platform</div>
    <el-dialog :visible.sync="dialogVisible" :title="'用户注册'" width="30%">
      <el-form :model="developUser" label-width="20%" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="developUser.username" placeholder="username" style="width: 60%"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="developUser.password" placeholder="password" style="width: 60%"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmEdit(user)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      developUser: {},
      dialogVisible: false,
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      // let that = this;
      // this.loading = true;
      // this.req({
      //   url: "/auth",
      //   data: {
      //     username: that.loginForm.username,
      //     password: that.loginForm.password
      //   },
      //   method: "POST"
      // }).then(
      //   res => {
      //     localStorage.setItem("hasLogin", true);
      //     localStorage.setItem("token", res.data.data);
      //     // localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
      //     this.$router.push({ path: "/" });
      //     this.$message({
      //       type: 'success',
      //       message: '登陆成功'
      //     });
      //
      //   },
      //   err => {
      //     console.log("err :", err);
      //     this.$message({
      //       type: 'info',
      //       message: '登陆失败'
      //     });
      //   }
      // );
      // this.loading = false;
    },
    handleRegistered() {
      this.dialogVisible = true;
    },
    toManagerPlat() {
      this.$router.push({ path: "/login" });
    },
  }
};
</script>

<style lang="scss">
.info02 {
  /*position: fixed;*/
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: #000000;
}

@supports (-webkit-mask: none) and (not (cater-color: #000000)) {
  .develop-container .el-input input {
    color: #ffffff;
  }
}

/* reset element-ui css */
.develop-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: #e5e5e5;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000000;
      height: 47px;
      caret-color: #000000;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #e5e5e5 inset !important;
        -webkit-text-fill-color: #000000 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #eeeeee;

.develop-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form02 {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 50px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container02 {
    padding: 6px 5px 6px 15px;
    color: #000000;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container02 {
    position: relative;

    .title {
      font-size: 26px;
      color: #000000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd02 {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #000000;
    cursor: pointer;
    user-select: none;
  }
}
</style>
