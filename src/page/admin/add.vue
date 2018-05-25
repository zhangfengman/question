<template>
  <div class="page_edit">
    <div class="survey_wrap">

      <h1 class="survey_title inner">
        <v-edit-div v-model='survey.title'></v-edit-div>
      </h1>
      <div class="survey_remarks inner">
        <v-edit-div v-model='survey.remark'></v-edit-div>
      </div>
      <div class="editor_question">
        <div class="inner" v-for="(item, index) in issueReqBeans" :key="index">
          <h2>题 {{index + 1}}
            <div class="operation_block">
              <a class="icon_del" v-if="index !== 0" @click="delQues(index)"></a>
              <div class="arrow-top" @click="moveTop(index)"></div>
              <div class="arrow-bottom" @click="moveBottom(index)"></div>
            </div>

          </h2>
          <div class="row editor_title">
            <label class="row_title">题目</label>
            <div class="row_content">
              <div class="question_title mod_editor inline_editor">
                <v-edit-div v-model="issueReqBeans[index].issueName"></v-edit-div>
              </div>
            </div>
          </div>
          <div class="row editor_type">
            <div class="row_content">
              <select id="question_type" v-model="issueReqBeans[index].type">
                <option value="1">单选题</option>
                <option value="2" selected="">多选题</option>
              </select>
              <label>
                <input name="question_required" style="margin-right: 0;" type="checkbox"
                       v-model="issueReqBeans[index].must"> 必填</label>
            </div>
          </div>
          <div class="row editor_options" style="">
            <ul class="options_list">
              <li class="option_item" v-for="(obj, num) in issueReqBeans[index].answerReqBeans" :key="num">
                <div class="option_input_wrap">
                  <div class="mod_editor inline_editor option_text">
                    <v-edit-div v-model="obj.answerName"></v-edit-div>
                  </div>
                </div>
                <div class="btn_opt_block">
                  <a href="javascript:;" @click="delOpt(index,num)" class="icon_del"></a>
                  <div class="arrow-top" @click="moveOptTop(index,num)"></div>
                  <div class="arrow-bottom" @click="moveOptBottom(index,num)"></div>
                </div>

              </li>

              <li class="option_item option_create">
                <div class="option_input_wrap" @click="addOpt(index,1)"><span class="add_option">新建选项</span></div>
              </li>
            </ul>
            <div class="options_control" @click="addOpt(index,0)">
              <a class="add_other " href="javascript:;">添加「其他」项</a>
            </div>
            <div class="options_control" v-if="issueReqBeans[index].id" @click="setRelation(item,index)">
              <a class="add_other " href="javascript:;">设置关联</a>
            </div>
          </div>
        </div>
      </div>
      <div class="operation_center">
        <el-button @click="confirm()">确定</el-button>
      </div>
    </div>
    <div class="editor_sidebar">

      <div id="menu" class="tab_content question_type" style="display: block;">
        <ul>
          <li class="type_item radio" @click="addQ('1')"><a href="javascript:;"><span class="ico"><i></i></span>单选题</a>
          </li>
          <li class="type_item select" @click="addQ('2')"><a href="javascript:;"><span class="ico"><i></i></span>多选题</a>
          </li>

        </ul>
      </div>

    </div>

    <el-dialog
      title="设置关系"
      :visible.sync="dialogVisible"
      width="60%">
      <div>
        <div class="relation_title">关联 <i @click="addRelation()" class="el-icon-circle-plus-outline"></i></div>

        <el-row :gutter="20" class="relation_row" v-if="item.joinId == curItem.id" v-for="(item, n) in relationList" :id="item.id" :key="item.id">
          <el-col :span="6">关联题目</el-col>
          <el-col :span="14">
            <el-select v-model="relationList[n].issueId" @change="changeIssue" placeholder="请选择">
              <el-option
                v-for="obj in checkList" :key="obj.id"
                :label="obj.issueName"
                :value="obj.id">
              </el-option>
            </el-select>

            <div>当关联的题目选择下面的选项：</div>
            <el-radio-group v-model="relationList[n].optId">
              <div v-for="obj in relationList[n].checkoutItem.answerReqBeans" :key="obj.id">
                <el-radio :label="obj.id"> <span v-html="obj.answerName"></span></el-radio>
              </div>
            </el-radio-group>
            <div>中的任意一个时当前题目才显示</div>
            <i @click="removeRelation(n)" class="el-icon-remove-outline"></i>
          </el-col>
        </el-row>

        <div class="relation_title">跳转</div>
        <el-row :gutter="20" class="relation_header">
          <el-col :span="10">选项</el-col>
          <el-col :span="10">跳到</el-col>
        </el-row>
        <el-row :gutter="20" class="relation_row" v-for="(item, k) in curItem.answerReqBeans" :key="item.id">
          <el-col :span="10"><span v-html="item.answerName"></span></el-col>
          <el-col :span="10">
            <el-select clearable v-model="curItem.answerReqBeans[k].relId" placeholder="请选择">
              <el-option v-for="obj in goList" :key="obj.id"
                         :label="obj.issueName"
                         :value="obj.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmRelate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import VEditDiv from '../../components/vedit'
import http from '../../utils/http'
import {
  isEmpty
} from '../../utils/global'

export default {
  name: 'add',
  data () {
    return {
      id: '',
      dialogVisible: false,
      isEdit: false,
      survey: {
        'description': '',
        'remark': '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧！',
        'title': '问卷标题'
      },
      issueReqBeans: [
        {
          'answerReqBeans': [
            {
              'answerName': '选项',
              'answerRemark': '',
              // 正常类型
              'answerStatus': 1
            }
          ],
          'issueName': '',
          'must': false,
          'type': '1'
        }
      ],
      //
      curItem: {},
      curIndex: 0,
      relationList: [],
      // 跳转试题列表
      goList: [],
      // 关联待选list
      checkList: []
    }
  },
  components: {
    VEditDiv
  },
  async created () {
    let id = this.$route.params.id
    this.id = id
    if (id) {
      this.isEdit = true
      let info = await http.get('/question/getById', {id: id})
      this.initData(info)
    }
  },
  methods: {
    validate () {
      var flag = true
      var msg = ''
      if (isEmpty(this.survey.title)) {
        msg = '问卷标题不能为空'
        flag = false
      }
      if (flag) {
        for (var i = 0; i < this.survey.issueReqBeans.length; i++) {
          if (isEmpty(this.survey.issueReqBeans[i].issueName)) {
            msg = '第' + (i + 1) + '题目不能为空'
            flag = false
            break
          }
          for (var j = 0; j < this.survey.issueReqBeans[i].answerReqBeans.length; j++) {
            if (isEmpty(this.survey.issueReqBeans[i].answerReqBeans[j].answerName)) {
              msg = '第' + (i + 1) + '题' + (j + 1) + '选型不能为空'
              flag = false
              break
            }
          }
        }
      }
      // console.log(msg)
      if (!flag) {
        this.$alert(msg, '提示')
      }
      return flag
    },
    initData (data) {
      this.survey.title = data.title
      this.survey.remark = data.remark
      this.survey.description = data.describe
      this.issueReqBeans = []
      for (var k = 0; k < data.issueResps.length; k++) {
        var answerReqBeans = []
        for (var j = 0; j < data.issueResps[k].answerResp.length; j++) {
          var answer = data.issueResps[k].answerResp[j]
          answerReqBeans.push({
            'answerName': answer.aname,
            'answerRemark': answer.remark,
            // 正常类型
            'answerStatus': answer.status,
            'id': answer.id,
            'relation': answer.relation
          })
        }
        var must = false
        if (data.issueResps[k].must === 1) {
          must = true
        }
        this.issueReqBeans.push({
          'issueName': data.issueResps[k].name,
          'id': data.issueResps[k].id,
          'must': must,
          'type': data.issueResps[k].type,
          'answerReqBeans': answerReqBeans
        })
      }
      this.changeId()
      // console.log(this.issueReqBeans)
    },
    getIssue (id) {
      var item = null
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        if (id === this.issueReqBeans[i].id) {
          item = this.issueReqBeans[i]
          break
        }
      }
      return item
    },
    // 每次更新数据，id是新生成的，需要把id转序号
    getIndexById (id) {
      var index = null
      if (id === '-1') {
        return '-1'
      }
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        if (id === this.issueReqBeans[i].id) {
          index = i
          break
        }
      }
      return index
    },
    // index 可能是id
    getIdByIndex (index) {
      var id = null
      if (index === '-1') {
        return '-1'
      }
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        if (this.issueReqBeans[i].id === index) {
          id = index
          break
        }
        if (index === i) {
          id = this.issueReqBeans[i].id
          break
        }
      }
      return id
    },
    changeIndex () {
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        var list = this.issueReqBeans[i].answerReqBeans
        for (var j = 0; j < list.length; j++) {
          if (list[j].relation) {
            var arrStr = list[j].relation
            var arr = JSON.parse(arrStr)
            for (var k1 = 0; k1 < arr.length; k1++) {
              var index = this.getIndexById(arr[k1].to)
              arr[k1].to = index
            }
            list[j].relation = JSON.stringify(arr)
          }
        }
      }
    },
    changeId () {
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        var list = this.issueReqBeans[i].answerReqBeans
        for (var j = 0; j < list.length; j++) {
          if (list[j].relation) {
            var arrStr = list[j].relation
            var arr = JSON.parse(arrStr)
            for (var k1 = 0; k1 < arr.length; k1++) {
              var id = this.getIdByIndex(arr[k1].to)
              arr[k1].to = id
            }
            list[j].relation = JSON.stringify(arr)
          }
        }
      }
    },
    async confirm () {
      this.changeIndex()
      this.survey.issueReqBeans = this.issueReqBeans
      // console.log(this.survey)
      if (this.validate()) {
        for (var i = 0; i < this.survey.issueReqBeans.length; i++) {
          if (this.survey.issueReqBeans[i].must) {
            this.survey.issueReqBeans[i].must = 1
          } else {
            this.survey.issueReqBeans[i].must = 0
          }
        }
        if (this.id) {
          this.survey.id = this.id
          await http.put('/question/updateQuestion', this.survey)
        } else {
          await http.post('/question/insertQuestionnaire', this.survey)
        }
        this.$router.push('/admin')
      }
    },
    addOpt (index, type) {
      let obj = {
        'answerName': '选项',
        'answerRemark': '',
        'answerStatus': type
      }
      if (type === 0) {
        obj.answerName = '其他____'
      }
      this.issueReqBeans[index].answerReqBeans.push(obj)
    },
    delQues (index) {
      // console.log(index)
      this.issueReqBeans.splice(index, 1)
    },
    delOpt (index, num) {
      this.issueReqBeans[index].answerReqBeans.splice(num, 1)
    },
    addQ (type) {
      let obj = {
        'answerReqBeans': [
          {
            'answerName': '选项',
            'answerRemark': '',
            'answerStatus': type
          }
        ],
        'issueName': '',
        'must': true,
        'type': type
      }
      this.issueReqBeans.push(obj)
    },
    moveTop (index) {
      // console.log(index)
      var temp
      var arr = JSON.parse(JSON.stringify(this.issueReqBeans))
      temp = arr[index]
      arr[index] = arr[index - 1]
      arr[index - 1] = temp
      this.issueReqBeans = arr
      // console.log(arr)
    },
    moveBottom (index) {
      var temp
      var arr = JSON.parse(JSON.stringify(this.issueReqBeans))
      if (index > arr.length - 1) {
        return arr
      }
      temp = arr[index]
      arr[index] = arr[index + 1]
      arr[index + 1] = temp
      this.issueReqBeans = arr
    },
    moveOptTop (index, num) {
      var issueReqBeans = JSON.parse(JSON.stringify(this.issueReqBeans))
      var arr = issueReqBeans[index].answerReqBeans
      var temp = arr[num]
      arr[num] = arr[num - 1]
      arr[num - 1] = temp
      this.issueReqBeans = issueReqBeans
    },
    moveOptBottom (index, num) {
      var issueReqBeans = JSON.parse(JSON.stringify(this.issueReqBeans))
      var arr = issueReqBeans[index].answerReqBeans
      var temp = arr[num]
      arr[num] = arr[num + 1]
      arr[num + 1] = temp
      this.issueReqBeans = issueReqBeans
    },
    // 设置关系
    setRelation (item, index) {
      this.curItem = {}
      this.relationList = []
      this.dialogVisible = true
      var newItem = JSON.parse(JSON.stringify(item))
      for (var i = 0; i < newItem.answerReqBeans.length; i++) {
        if (newItem.answerReqBeans[i].relation) {
          var jsonStr = newItem.answerReqBeans[i].relation
          var arr = JSON.parse(jsonStr)
          for (var k = 0; k < arr.length; k++) {
            if (arr[k].type === 'go') {
              newItem.answerReqBeans[i].relId = this.getIdByIndex(arr[k].to)
            } else if (arr[k].type === 'join') {
              // this.setJoinData(arr[k],item.id,newItem.answerReqBeans[i].id)
            }
          }
        } else {
          newItem.answerReqBeans[i].relId = ''
        }
      }
      this.curItem = newItem
      this.curIndex = index
      this.setJoinData()
      this.setCheckList()
    },
    setJoinData (obj) {
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        var list = this.issueReqBeans[i].answerReqBeans
        for (var j = 0; j < list.length; j++) {
          if (list[j].relation) {
            var jsonStr = list[j].relation
            var arr = JSON.parse(jsonStr)
            for (var k = 0; k < arr.length; k++) {
              if (arr[k].type === 'join') {
                this.relationList.push({
                  joinId: this.getIdByIndex(arr[k].to),
                  issueId: this.issueReqBeans[i].id,
                  optId: list[j].id,
                  checkoutItem: this.getIssue(this.issueReqBeans[i].id)
                })
                console.log(this.relationList)
              }
            }
          }
        }
      }
    },
    addRelation () {
      this.relationList.push({
        // 当前题id
        joinId: this.curItem.id,
        // 关联题
        issueId: '',
        // 关联题 选项
        optId: '',
        // 关联题
        checkoutItem: {}
      })
    },
    removeRelation (index) {
      for (var i1 = 0; i1 < this.relationList.length; i1++) {
        if (i1 === index && this.curItem.id === this.relationList[i1].joinId) {
          this.setRelationJson(this.relationList[i1].issueId, this.relationList[i1].optId, {type: 'del', to: this.curItem.id})
          this.relationList.splice(i1, 1)
        }
      }
    },
    changeIssue (id) {
      var obj = this.getIssue(id)
      for (var i = 0; i < this.relationList.length; i++) {
        if (this.relationList[i].issueId === id) {
          this.relationList[i].checkoutItem = obj
        }
      }
    },
    addUnique (list, json) {
      var isExist = false
      for (var k = 0; k < list.length; k++) {
        if (list[k].type === json.type && list[k].to === json.to) {
          isExist = true
        }
      }
      if (!isExist) {
        list.push(json)
      }
    },
    setRelationJson (id, opId, json) {
      for (var i = 0; i < this.issueReqBeans.length; i++) {
        if (id === this.issueReqBeans[i].id) {
          var list = this.issueReqBeans[i].answerReqBeans
          for (var j = 0; j < list.length; j++) {
            if (list[j].id === opId) {
              if (list[j].relation) {
                var arrStr = list[j].relation
                var arr = JSON.parse(arrStr)
                if (json.type === 'del') {
                  for (var k = 0; k < arr.length; k++) {
                    if (arr[k].to === json.to) {
                      arr.splice(k, 1)
                    }
                  }
                  // 删除 跳转
                  if (json.to === '') {
                    arr = []
                  }
                  if (arr.length === 0) {
                    list[j].relation = ''
                  } else {
                    list[j].relation = JSON.stringify(arr)
                  }
                } else {
                  this.addUnique(arr, json)
                  // arr.push(json)
                  list[j].relation = JSON.stringify(arr)
                }
              } else if (json.type !== 'del') {
                var arr2 = []
                arr2.push(json)
                list[j].relation = JSON.stringify(arr2)
              }
            }
          }
        }
      }
    },
    confirmRelate () {
      // console.log(this.relationList)
      // go
      var item = this.curItem
      for (var i = 0; i < item.answerReqBeans.length; i++) {
        if (item.answerReqBeans[i].relId) {
          this.setRelationJson(item.id, item.answerReqBeans[i].id, {type: 'go', to: item.answerReqBeans[i].relId})
        } else {
          this.setRelationJson(item.id, item.answerReqBeans[i].id, {type: 'del', to: ''})
        }
      }
      for (var i1 = 0; i1 < this.relationList.length; i1++) {
        if (this.curItem.id === this.relationList[i1].joinId && this.relationList[i1].optId) {
          this.setRelationJson(this.relationList[i1].issueId, this.relationList[i1].optId, {type: 'join', to: item.id})
        }
      }
      this.dialogVisible = false
    },
    setCheckList () {
      this.goList = []
      this.checkList = []
      for (var i = this.curIndex; i < this.issueReqBeans.length; i++) {
        this.goList.push(this.issueReqBeans[i])
      }
      for (var j = 0; j < this.issueReqBeans.length; j++) {
        if (j < this.curIndex) {
          this.checkList.push(this.issueReqBeans[j])
        }
      }
      // 第一个试题 跳转end 提交
      // if (this.curIndex === 0) {
      this.goList.push({issueName: '跳到問卷末', id: '-1'})
      // }
    }
  },
  mounted () {
    setTimeout(function () {
      // CKEDITOR.disableAutoInline = true
      // CKEDITOR.inline('editable')
    }, 2000)

    // let editor = CKEDITOR.instances.editor2
  }
}
</script>
<style scoped>
  @import '../../assets/style.css';
</style>
