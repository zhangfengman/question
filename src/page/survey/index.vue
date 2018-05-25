<template>

  <div class="survey_wrap">
      <logo></logo>
      <div class="survey_main">
        <h1 class="survey_title" style="display: block;">
          <div class="inner">
            <div class="title_content"><p v-html="info.title"></p></div>
          </div>
        </h1>
        <div class="survey_content">
          <div class="survey_prefix" style="display: block;">
            <div class="inner">
              <h2 class="prefix_content">
                <p v-html="info.remark"></p>
              </h2>
            </div>
          </div>
          <div class="survey_container">
            <div v-for="(item, index) in info.issueResps" :key="index">
              <div v-if="item.isShow && item.type == 1" class="question question_radio " :class="{'required':item.must == 1 }" style="display: block;">
                <div class="inner">
                  <div class="title">
                    <span class="title_index">
                      <span class="question_index">{{index + 1}}</span>.
                    </span>
                    <h3 class="title_text" ><p v-html="item.name"></p></h3>
                    <span class="cancle" v-if="item.must == 0 && item.answer !== '' " @click="cancle(item)" >取消答题</span>
                  </div>
                  <div class="description">
                    <div class="description_text"></div>
                  </div>
                  <div class="inputs" v-if="!item.colspan">
                    <el-radio-group v-model="info.issueResps[index].answer" @change="changeRadio">
                      <div v-for="(opt, num) in item.answerResp" :key="num" class="option_item"
                           :class="{other_text:opt.status==='0'}" style="width: 100%;">
                        <el-radio class="label" :label="opt.id" ><span v-html="opt.aname"></span></el-radio>
                        <input v-if="opt.status === '0'" v-model="opt.remark" @click="checkedOpt(item,opt.id)" class="fill_blank">
                      </div>
                    </el-radio-group>
                  </div>
                  <div class="inputs column-layout" v-if="item.colspan">
                    <el-radio-group v-model="info.issueResps[index].answer" @change="changeRadio">
                      <div v-for="(opt, num) in item.answerResp" :key="num" class="option_item"
                           :class="{other_text:opt.status==='0'}">
                        <el-radio class="label" :label="opt.id" ><span v-html="opt.aname"></span></el-radio>
                        <input v-if="opt.status === '0'" v-model="opt.remark" @click="checkedOpt(item,opt.id)" class="fill_blank">
                      </div>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div v-if="item.isShow && item.type == 2" class="question question_radio" :class="{'required':item.must == 1 }" style="display: block;">
                <div class="inner">
                  <div class="title">
                   <span class="title_index">
                      <span class="question_index">{{index + 1}}</span>.
                    </span>
                    <h3 class="title_text" ><p v-html="item.name"></p></h3>
                  </div>
                  <div class="description">
                    <div class="description_text"></div>
                  </div>

                  <div class="inputs" v-if="!item.colspan">
                    <div v-for="(opt, num) in item.answerResp" :key="num" class="option_item"
                         :class="{other_text:opt.status==='0'}" style="width: 100%;">
                      <el-checkbox v-model="item.answerResp[num].checked">{{opt.aname}}</el-checkbox>
                      <input v-if="opt.status === '0'" v-model="opt.remark" @click="checkedOpt(item,num)" class="fill_blank">
                    </div>
                  </div>
                  <div class="inputs column-layout" v-if="item.colspan">
                    <div v-for="(opt, num) in item.answerResp" :key="num" class="option_item"
                         :class="{other_text:opt.status==='0'}">
                      <el-checkbox v-model="item.answerResp[num].checked" class="column-checkbox">{{opt.aname}}</el-checkbox>
                      <input v-if="opt.status === '0'" v-model="opt.remark" @click="checkedOpt(item,num)" class="fill_blank">
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="question question_radio" style="display: block;">
              <div class="inner">
                <div class="title">
                    <span class="title_index">
                      <span class="question_index">{{info.issueResps.length + 1}}</span>.
                    </span>
                  <h3 class="title_text"><p>你是否願意接受邀請於日後參加與內地升學相關的分享和交流活動？
                  </p></h3>

                </div>
                <div class="description">
                  <div class="description_text"></div>
                </div>
                <div class="inputs">
                  <div class="option_item" style="width: 100%;">
                    <el-radio v-model="radio" class="label" label="1">是</el-radio>
                  </div>
                  <div class="user" v-if="radio === '1'">
                    <el-row>
                      <el-col :span="4">
                        <div class="label">姓名：</div>
                      </el-col>
                      <el-col :span="14">
                        <el-input placeholder="姓名" v-model="answer.user.name"></el-input>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="label">電話：</div>
                      </el-col>
                      <el-col :span="14">
                        <el-input placeholder="電話" v-model="answer.user.phone"></el-input>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="label">WhatsApp ：</div>
                      </el-col>
                      <el-col :span="14">
                        <el-input placeholder="WhatsApp " v-model="answer.user.whatsapp"></el-input>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="label">電郵 ：</div>
                      </el-col>
                      <el-col :span="14">
                        <el-input placeholder="電郵 " v-model="answer.user.email"></el-input>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="label">地址 ：</div>
                      </el-col>
                      <el-col :span="14">
                        <el-input placeholder="地址 " v-model="answer.user.address"></el-input>
                      </el-col>
                    </el-row>
                    <p>若果未想在此留下通訊方式，可以電郵 ujobs@hkceec.hk 直接聯絡中國教育留學交流（香港）中心</p>

                  </div>
                  <div class="option_item" style="width: 100%;">
                    <el-radio v-model="radio" class="label" label="2">否</el-radio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-center">
          <el-button @click="confirm()">提交</el-button>
        </div>
      </div>
    </div>
</template>

<script>
import EditDiv from '../../components/vedit'
import http from '../../utils/http'
import logo from '../../components/header'
export default {
  components: {EditDiv, logo},
  name: 'survery',
  data () {
    return {
      info: {
        'description': '',
        'remark': '',
        'title': '',
        'issueResps': []
      },
      radio: '',
      answer: {
        issueReq: [
          /*
          {
            'answerReq': [
              {
                'aid': 0,
                'remark': ''
              }
            ],
            'id': 0
          }
          */
        ],
        'qid': this.$route.params.id,
        'user': {
          'address': '',
          'email': '',
          'file1': '',
          'file2': '',
          'id': 0,
          'name': '',
          'phone': '',
          'whatsapp': ''
        }
      },
      lock: false
    }
  },
  async created () {
    let id = this.$route.params.id
    let info = await http.get('/question/getById', {id: id})
    if (info) {
      for (let i = 0; i < info.issueResps.length; i++) {
        info.issueResps[i].answer = ''
        var colspan = true
        for (let j = 0; j < info.issueResps[i].answerResp.length; j++) {
          if (info.issueResps[i].answerResp[j].aname.length > 23) {
            colspan = false
          }
          if (info.issueResps[i].type === 2) {
            info.issueResps[i].answerResp[j].checked = false
          }
        }
        if (info.issueResps[i].answerResp.length > 4 && colspan) {
          info.issueResps[i].colspan = colspan
        }
      }
      this.initRelation(info, 0)
      this.info = info
    }
  },
  methods: {
    initRelation (info, start) {
      var hideArray = []
      for (let i = start; i < info.issueResps.length; i++) {
        var opts = info.issueResps[i].answerResp
        for (let j = 0; j < opts.length; j++) {
          var opt = opts[j]
          if (opt.relation) {
            var jsonStr = opt.relation
            var arr = JSON.parse(jsonStr)
            for (var k = 0; k < arr.length; k++) {
              if (arr[k].type === 'join' && arr[k].to) {
                hideArray.push(arr[k].to)
              }
            }
          }
        }
        info.issueResps[i].isShow = true
      }
      for (let j = 0; j < hideArray.length; j++) {
        info.issueResps[hideArray[j]].isShow = false
      }
    },
    // 必填校验
    validate () {
      var flag = true
      var msg = ''
      for (let i = 0; i < this.info.issueResps.length; i++) {
        let item = this.info.issueResps[i]
        if (item.isShow && item.must) {
          if (item.type === 1) {
            if (!item.answer) {
              flag = false
              msg = item.name
              break
            }
          } else if (item.type === 2) {
            var checked = false
            for (let j = 0; j < item.answerResp.length; j++) {
              if (item.answerResp[j].checked) {
                checked = true
                break
              }
            }
            if (!checked) {
              flag = false
              msg = item.name
              break
            }
          }
        }
      }
      return {flag: flag, msg: '请填写【' + msg + '】'}
    },
    validateUser () {
      var flag = true
      if (this.radio === '1' && !this.answer.user.name) {
        flag = false
        this.$alert('请填写姓名', '提示', {confirmButtonText: '确定'})
      } else if (this.radio === '1' && !this.answer.user.phone) {
        flag = false
        this.$alert('请填写電話', '提示', {confirmButtonText: '确定'})
      }
      return flag
    },
    async confirm () {
      // console.log(this.info)
      if (this.lock) {
        return
      }
      this.lock = true
      var obj = this.validate()
      if (!obj.flag) {
        this.$alert(obj.msg, '提示', {
          confirmButtonText: '确定'
        })
        this.lock = false
        return
      }
      if (!this.validateUser()) {
        this.lock = false
        return
      }
      for (var i = 0; i < this.info.issueResps.length; i++) {
        let item = this.info.issueResps[i]
        var answer = {
          'answerReq': [
            /*
            {
              'aid': 0,
              'remark': ''
            }
            */
          ],
          'id': item.id
        }
        if (item.type === 1) {
          for (var j = 0; j < item.answerResp.length; j++) {
            if (item.answerResp[j].id === item.answer) {
              var oo = {
                'aid': item.answerResp[j].id,
                'remark': item.answerResp[j].remark
              }
              answer.answerReq.push(oo)
            }
          }
        } else if (item.type === 2) {
          for (var j1 = 0; j1 < item.answerResp.length; j1++) {
            if (item.answerResp[j1].checked) {
              answer.answerReq.push({
                'aid': item.answerResp[j1].id,
                'remark': item.answerResp[j1].remark
              })
            }
          }
        }
        this.answer.issueReq.push(answer)
      }
      console.log(this.answer)
      await http.post('/question/insertQuestion', this.answer)
      this.lock = false
      this.$alert('問卷提交成功', '提示', {
        confirmButtonText: '確定',
        callback: action => {
          console.log('success')
          window.location.href = '#/success'
        }
      })
      // this.$router.push('/admin')
    },
    changeRadio (id) {
      console.log(id)
      var info = this.info
      var start = 0
      var relation = ''
      for (let i = 0; i < info.issueResps.length; i++) {
        for (let j = 0; j < info.issueResps[i].answerResp.length; j++) {
          var item = info.issueResps[i].answerResp[j]
          if (item.id === id && item.relation) {
            start = i
            relation = item.relation
          }
        }
      }
      if (relation) {
        this.initRelation(info, start)
        var arr = JSON.parse(relation)
        for (var k1 = 0; k1 < arr.length; k1++) {
          if (arr[k1].type === 'go') {
            for (let i = start; i < info.issueResps.length; i++) {
              if (arr[k1].to === '-1') {
                this.hideIssue(0, info.issueResps.length)
                this.confirm()
              } else {
                this.hideIssue(i, arr[k1].to)
              }
            }
          } else {
            this.showIssue(arr[k1].to)
          }
        }
      }
    },
    hideIssue (start, index) {
      if (index) {
        var info = this.info
        for (let i = start + 1; i < info.issueResps.length; i++) {
          if (i < index) {
            this.info.issueResps[i].isShow = false
          }
        }
      }
    },
    showIssue (index) {
      if (index) {
        this.info.issueResps[index].isShow = true
      }
    },
    cancle (item) {
      var info = this.info
      for (let i = 0; i < info.issueResps.length; i++) {
        if (item.id === info.issueResps[i].id) {
          info.issueResps[i].answer = ''
          if (info.issueResps[i].type === 2) {
            for (let j = 0; j < info.issueResps[i].answerResp.length; j++) {
              info.issueResps[i].answerResp[j].checked = false
            }
          }
        }
      }
    },
    checkedOpt (item, num) {
      if (item.type === 2) {
        item.answerResp[num].checked = true
      } else {
        item.answer = num
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .option_item .column-checkbox .el-checkbox__label{
    width: 90%;
  }
  .other_text .column-checkbox .el-checkbox__label{
    width: 90%;
    display: inline;
  }
</style>

<style scoped>
  .survey_wrap {
    width: 100%;
    max-width: 1000px;
    min-width: 730px;
    border: 1px solid #dadada;
    position: relative;
    background-color: #fff;
    font-size: 14px;
    line-height: 1.8em;
    margin: auto;
  }

  .survey_main {
    padding-top: 80px;
    padding-bottom: 100px;
  }

  .survey_title {
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    -ms-word-break: break-all;
    word-break: break-all;
    margin: 0;
  }

  .inner {
    margin-left: auto;
    margin-right: auto;
    max-width: 710px;
  }

  .survey_title .title_content {
    padding: 10px 0;
    font-size: 24px;
    color: #333333;
    font-weight: normal;
    margin: 0;
    word-break: break-word;
    font-weight: bold;
  }

  .survey_prefix {
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: left;
  }

  .prefix_content {
    font-size: 14px;
    color: #333333;
    padding: 10px 0;
    font-weight: normal;
    word-break: break-word;
  }

  .question .title .title_index {
    float: left;
  }

  .question .title .title_text {
    font-size: 16px;
    color: #333333;
    font-weight: normal;
    margin: 0;
    vertical-align: top;
    font-weight: bold;
  }
  .question .title .cancle{
    font-size: 12px;
    color: #409EFF;
  }
  .question .description {
    font-size: 12px;
    padding-bottom: 10px;
    margin-top: 5px;
  }

  .option_item {
    display: inline-block;
    zoom: 1;
    vertical-align: top;
    position: relative;
    margin-left: -10px;
    margin-right: 10px;
    margin-top: 2px;
  }
  .column-layout{
    overflow: hidden;
  }
  .column-layout .option_item{
    width: 50%;
    float: left;
  }
  .column-checkbox{
    white-space: normal;
  }

  .question.required .title_text > *:last-child:after {
    content: '*';
    font-weight: 700;
    color: #f00;
    margin-left: 5px;
  }

  .question_radio .option_item label {
    position: relative;
    overflow: hidden;
    zoom: 1;
    display: block;
    padding: 10px 0 10px 10px;
    cursor: pointer;
  }
  .question_radio .option_item label .el-checkbox__label{
    color: red;
  }

  .question_radio .option_item.other_text label {
    overflow: hidden;
    zoom: 1;
    display: inline-block;
    padding: 10px 0 10px 10px;
    cursor: pointer;
  }
  .question_radio .option_item.other_text label {
    display: block;
    float: left;
  }
  .question_radio .option_item.other_text .fill_blank {
    display: inline-block;
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
    border-radius: 0;
    outline: none;
    padding-top: 1px;
    padding-bottom: 1px;
    position: absolute;
    top: 10px;
    z-index: 1;
    border-bottom: 1px solid #000000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    margin-left: 1px;
    margin-right: 1px;
  }

  .question_radio .option_item label:hover {
    background-color: #f5f5f5;
  }

  .user .label {
    line-height: 40px;
    font-size: 18px;
    text-align: right;
  }

  .el-row {
    margin: 5px 0;
  }

  .btn-center {
    margin: 10px auto;
    text-align: center;
  }
</style>
