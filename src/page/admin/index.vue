<template>
  <div>
    <h1>調查問卷列表</h1>
    <a href="#/admin/add">
      <el-button type="text" size="small">新增問卷</el-button>
    </a>

    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column

        label="问卷名称"
        width="180">
        <template slot-scope="props">
          <span v-html="props.row.title"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180">
        <template slot-scope="props">
          <span>{{props.row.createdate | formatDate('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="props">
          <a :href="'#/survey/' + props.row.id"><el-button type="text" size="small">查看</el-button></a>
          <a :href="'#/admin/edit/' + props.row.id"><el-button type="text" size="small" >编辑</el-button></a>
          <el-button type="text" size="small" @click="del(props.row.id)">删除</el-button>
          <el-button type="text" size="small" v-if="props.row.status == 'C' || props.row.status == null" @click="publish(props.row.id)">发布</el-button>
          <el-button type="text" size="small" v-if="props.row.status =='P'" @click="cancle(props.row.id)">取消发布</el-button>
          <a :href="baseUrl+'/export/exportExcel?id=' + props.row.id"><el-button type="text" size="small">導出</el-button></a>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total >= 10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 100]"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import http from '../../utils/http'
import {
  baseUrl
} from '../../utils/global'
export default {
  name: 'list',
  data () {
    return {
      baseUrl: baseUrl,
      currentPage: 1,
      total: 0,
      limit: 10,
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
      this.getList()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
      console.log(`当前页: ${val}`)
    },
    async getList () {
      var page = this.currentPage - 1
      var offset = page * this.limit
      if (offset <= 0) {
        offset = 0
      }
      var params = {
        offset: offset,
        limit: this.limit
      }
      let res = await http.get('question/getByPage', params)
      this.list = res.data
      this.total = res.count
    },
    async del2 (id) {
      await http.delete('question/' + id, {})
      this.getList()
    },
    del (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.del2(id)
      })
    },
    async httpPublish (id) {
      await http.post('question/publish/' + id, {})
      this.getList()
    },
    publish (id) {
      this.$confirm('确定发布？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.httpPublish(id)
      })
    },
    async httpCancle (id) {
      await http.post('question/cancle/' + id, {})
      this.getList()
    },
    cancle (id) {
      this.$confirm('确定取消发布？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.httpCancle(id)
      })
    }
  }
}
</script>
