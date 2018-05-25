<template>
  <div class="survey_wrap">
    <div class="survey_main">
      <h1 class="survey_title" style="display: block;">
        <div class="inner">
          <div class="title_content"><p>{{info.title}}</p></div>
        </div>
      </h1>
      <div class="survey_content">
        <div class="survey_prefix" style="display: block;">
          <div class="inner">
            <h2 class="prefix_content">
              <p>{{info.remark}}</p>
            </h2>
          </div>
        </div>
        <div class="survey_container">
          <div v-for="(item, index) in info.issueResps" :key="index">
            <div v-if="item.type == 1" class="question question_radio " :class="{'required':item.must == 1 }"
                 style="display: block;">
              <div class="inner">
                <div class="title">
                  <span class="title_index">
                    <span class="question_index">{{index + 1}}</span>.
                  </span>
                  <h3 class="title_text"><p>{{item.name}}</p></h3>

                </div>
                <div class="description">
                  <div class="description_text"></div>
                </div>
                <div class="inputs">
                  <el-radio-group v-model="info.issueResps[index].answer">
                    <div v-for="(opt, num) in item.answerResp" :key="num" class="option_item"
                         :class="{other_text:opt.status==='0'}" style="width: 100%;">
                      <el-radio class="label" :label="opt.id">{{opt.aname}}</el-radio>
                      <input v-if="opt.status === '0'" v-model="opt.remark" class="fill_blank">
                    </div>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div v-if="item.type == 2" class="question question_radio" style="display: block;">
              <div class="inner">
                <div class="title">
                 <span class="title_index">
                    <span class="question_index">{{index + 1}}</span>.
                  </span>
                  <h3 class="title_text"><p>{{item.name}}</p></h3>

                </div>
                <div class="description">
                  <div class="description_text"></div>
                </div>
                <div class="inputs">
                  <div v-for="(opt, num) in item.answerResp" :key="num" class="option_item"
                       :class="{other_text:opt.status==='0'}" style="width: 100%;">
                    <el-checkbox v-model="item.answerResp[num].checked">{{opt.aname}}</el-checkbox>
                    <input v-if="opt.status === '0'" v-model="opt.remark" class="fill_blank">
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
                  <p>若果未想在此留下通訊方式，可以電郵 admissionscheme@hkceec.hk 直接聯絡中國教育留學交流（香港）中心</p>

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

  export default {
    components: {EditDiv},
    name: 'survery',
    data() {
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
        }
      }
    },
    async created() {
      let id = this.$route.params.id
      let info = await http.get('/question/getById', {id: id})


      if (info) {
        for (let i = 0; i < info.issueResps.length; i++) {
          info.issueResps[i].answer = ''
          if (info.issueResps[i].type === 2) {
            for (let j = 0; j < info.issueResps[i].answerResp.length; j++) {
              info.issueResps[i].answerResp[j].checked = false
            }
          }
        }
        this.info = info
      }
    },
    methods: {
      changeIndex() {
        for (var i = 0; i < this.issueReqBeans.length; i++) {
          var list = this.issueReqBeans[i].answerReqBeans
          for (var j = 0; j < list.length; j++) {
            if (list[j].relation) {
              var arrStr = list[j].relation
              var arr = JSON.parse(arrStr)
              for (var k = 0; k < arr.length; k++) {
                var index = this.getIndexById(arr[k].to)
                arr[k].to = index
              }
              list[j].relation = JSON.stringify(arr)
            }
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    font-size: 14px;
    color: #333333;
    font-weight: normal;
    margin: 0;
    vertical-align: top;
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

  .question_radio .option_item.other_text label {
    position: relative;
    overflow: hidden;
    zoom: 1;
    display: inline-block;
    padding: 10px 0 10px 10px;
    cursor: pointer;
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
