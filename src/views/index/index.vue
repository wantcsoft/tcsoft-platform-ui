<template>
  <div class="login-container">
    <el-col style="padding: 1%">
      <el-card shadow="always" style="text-align: center">
        <span style="font-size: 20px">欢迎来到TCSOFT大数据平台!</span>
      </el-card>
    </el-col>

    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always">
          <i class="el-icon-info"></i>
<!--          总是显示-->
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          鼠标悬浮时显示
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always">
          从不显示
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted: {},
  methods: {}
};
</script>

<style>
</style>
