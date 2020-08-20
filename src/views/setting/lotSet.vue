<template>
  <div class="root">
    <div>
      <el-button type="primary" size="mini" @click="handleCreate" style="margin-left: 80%">Create</el-button>
    </div>

    <el-table :data="tableData" stripe style="margin-left: 2%; width: 96%">
      <el-table-column prop="materialId" label="materialId"></el-table-column>
      <el-table-column prop="lotSetName" label="lotSetName"></el-table-column>
      <el-table-column prop="levelCount" label="levelCount"></el-table-column>
      <el-table-column prop="level1Code" label="level1Code"></el-table-column>
      <el-table-column prop="level2Code" label="level2Code"></el-table-column>
      <el-table-column prop="level3Code" label="level3Code"></el-table-column>
      <el-table-column prop="active" :formatter="formatActive" label="isActive"></el-table-column>
      <el-table-column  label="Edit">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleLotSetEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="Delete">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="lotSetDialogVisible" title="lotSet" width="40%">
      <el-form :model="lotSet" label-width="40%" label-position="left">
        <el-form-item label="materialId">
          <el-input v-model="lotSet.materialId" placeholder="materialId" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="lotSetName">
          <el-input v-model="lotSet.lotSetName" placeholder="lotSetName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="levelCount">
          <el-input v-model="lotSet.levelCount" placeholder="levelCount" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="level1Code">
          <el-input v-model="lotSet.level1Code" placeholder="level1Code" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="level2Code">
          <el-input v-model="lotSet.level2Code" placeholder="level2Code" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="level3Code">
          <el-input v-model="lotSet.level3Code" placeholder="level3Code" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="isActive">
          <el-switch
            v-model="lotSet.active"
            active-text="激活"
            inactive-text="未激活">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="lotSetDialogVisible=false">cancel</el-button>
        <el-button type="primary" @click="confirmLotSetEdit(lotSet)">save</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'lotSet',
    data() {
      return {
        tableData: [],
        lotSetDialogVisible: false,
        lotSet: {},
        type: ''
      };
    },
    mounted () {
      this.getLotSets();
    },
    methods: {
      getLotSets() {
        this.req({
          url: "/setting/lotSet",
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
      handleLotSetEdit(row) {
        this.lotSetDialogVisible = true;
        this.lotSet = row;
        this.type = 'edit';
      },
      confirmLotSetEdit(lotSet) {
        if (this.type === 'edit'){
          this.req({
            url: "/setting/lotSet",
            params: {
              "type": "modify"
            },
            data: {
              "lotSetId": lotSet.lotSetId,
              "materialId": lotSet.materialId,
              "lotSetName": lotSet.lotSetName,
              "levelCount": lotSet.levelCount,
              "level1Code": lotSet.level1Code,
              "level2Code": lotSet.level2Code,
              "level3Code": lotSet.level3Code,
              "active": lotSet.active
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
            url: "/setting/lotSet",
            params: {
              "type": "create"
            },
            data: {
              "materialId": lotSet.materialId,
              "lotSetName": lotSet.lotSetName,
              "levelCount": lotSet.levelCount,
              "level1Code": lotSet.level1Code,
              "level2Code": lotSet.level2Code,
              "level3Code": lotSet.level3Code,
              "active": lotSet.active
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getLotSets();
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
        this.lotSetDialogVisible = true;
        this.lotSet = {};
        this.type = 'create';
      },
      handleDelete(lotSet) {
        this.$confirm('此操作将永久删除该lotSet, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.req({
            url: "/setting/lotSet",
            params: {
              "type": "delete"
            },
            data: {
              "lotSetId": lotSet.lotSetId,
            },
            method: "POST"
          }).then(
            res => {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getLotSets();
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
      formatActive(row){
        let ret = ''
        if (row.enabled) {
          ret = "激活"
        } else {
          ret = "未激活"
        }
        return ret;
      }
    },
  }
</script>

<style scoped>

</style>
