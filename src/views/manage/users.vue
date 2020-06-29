<template>
  <div class="user-root">
    <div class="search">
      <el-input placeholder="请输入账号" v-model="keyword" clearable class="input-with-select">
        <el-button @click="goSearch" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="add-user">
      <el-button type="primary">新增用户</el-button>
    </div>
    <div class="user-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="active" label="是否激活"></el-table-column>
        <el-table-column prop="lock" label="是否锁定"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleClick(scope.row)"></i>
            <span>&nbsp;&nbsp;</span>
            <i class="el-icon-delete"></i>
<!--            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>-->
<!--            <el-button type="text" size="small">删除</el-button>-->
          </template>
        </el-table-column>
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
    data() {
      return {
        pageSize: 6,
        total: 6, // task总数
        srcList: [],
        tableData: [{"account": "1111", "password": "11111", "active": 1, "role": "admin", "lock": 1},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "3333", "password": "3333", "active": 1, "role": "user", "lock": 1},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0},
                    {"account": "2222", "password": "22222", "active": 1, "role": "user", "lock": 0}],
        keyword: "",
        headers: {
          token: localStorage.getItem("token")
        }
      };
    },
    methods: {
      goSearch() {
        console.log("搜索")
      },
      handleClick: function(row){
        console.log(row)
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
