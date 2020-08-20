<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="eventDesc" label="eventDesc"></el-table-column>
      <el-table-column prop="eventDisplay" label="eventDisplay"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleSampleEventEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sampleEventDialogVisible" title="sampleEvent" width="40%">
      <el-form :model="sampleEvent" label-width="40%" label-position="left">
        <el-form-item label="eventDesc">
          <el-input v-model="sampleEvent.eventDesc" placeholder="eventDesc" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="eventDisplay">
          <el-input v-model="sampleEvent.eventDisplay" placeholder="eventDisplay" style="width: 90%"/>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="sampleEventDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmSampleEventEdit(sampleEvent)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'sampleEvent',
    data() {
      return {
        tableData: [],
        sampleEventDialogVisible: false,
        sampleEvent: {},
        type: ''
      };
    },
    mounted () {
      this.getSampleEvents();
    },
    methods: {
      getSampleEvents() {
        this.req({
          url: "/setting/sampleEvent",
          method: "POST",
          params: {
            "type": "query"
          },
          data: {

          },
        }).then(
          res => {
            if (res.data.code === 200) {
              this.tableData = res.data.data;
            }
          },
          err => {
            console.log(err)
            this.$message({
              type: 'success',
              message: "配置获取失败"
            });
          }
        );
      },
      handleSampleEventEdit(row) {
        this.sampleEventDialogVisible = true;
        this.sampleEvent = row;
        this.type = 'edit';
      },
      confirmSampleEventEdit(sampleEvent) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/sampleEvent",
            params: {
              "type": "modify"
            },
            data: {
              "sampleEventId": sampleEvent.sampleEventId,
              "eventDesc": sampleEvent.eventDesc,
              "eventDisplay": sampleEvent.eventDisplay
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'info',
                message: '修改失败'
              });
            }
          );
        }else {
          this.req({
            url: "/setting/sampleEvent",
            params: {
              "type": "create"
            },
            data: {
              "eventDesc": sampleEvent.eventDesc,
              "eventDisplay": sampleEvent.eventDisplay
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleEvents();
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
      },
      handleCreate() {
        this.sampleEventDialogVisible = true;
        this.sampleEvent = {};
        this.type = 'create';
      },
      handleDelete(sampleEvent) {
        this.$confirm('此操作将永久删除该sampleEvent, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/sampleEvent",
            params: {
              "type": "delete"
            },
            data: {
              "sampleEventId": sampleEvent.sampleEventId
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getSampleEvents();
            },
            err => {
              console.log("err :", err);
              this.$message({
                type: 'success',
                message: "删除失败"
              });
            }
          );
        })
      },
    },
  }
</script>

<style scoped>

</style>
