<template>
  <div>
    <div class="p-grid content">
      <div v-if="domainOrOrg=='domain'" class="p-col-6 p-md-4 p-lg-4">
        <div class="m-card">
          <p>域控服务器</p>
          <p>{{ data.host4dc }}<span>台</span></p>
          <div>
            <p><i class="fa fa-clock-o"></i> {{ date }}</p>
          </div>
        </div>
      </div>
      <div v-if="domainOrOrg=='domain'" class="p-col-6 p-md-4 p-lg-4">
        <div class="m-card">
          <p>域计算机</p>
          <p>{{ data.host4normal }}<span>台</span></p>
          <div>
            <p><i class="fa fa-clock-o"></i> {{ date }}</p>
          </div>
        </div>
      </div>

      <div class="p-col-6 p-md-4 p-lg-4">
        <div class="m-card">
          <p>组织单位数</p>
          <p>{{ data.ou }}<span>个</span></p>
          <div>
            <p><i class="fa fa-clock-o"></i> {{ date }}</p>
          </div>
        </div>
      </div>

      <div class="p-col-6 p-md-4 p-lg-4">
        <div class="m-card">
          <p>用户组</p>
          <p>{{ data.user_group }}<span>个</span></p>
          <div>
            <p><i class="fa fa-clock-o"></i> {{ date }}</p>
          </div>
        </div>
      </div>

      <div class="p-col-6 p-md-4 p-lg-4 ">
        <div class="m-card">
          <p>域用户</p>
          <p>{{ data.user }}<span>个</span></p>
          <div>
            <p><i class="fa fa-clock-o"></i> {{ date }}</p>
          </div>
        </div>
      </div>

<!--      <div class="p-col-6 p-md-4 p-lg-4" v-if="domainOrOrg=='domain'">-->
<!--        <div class="m-card">-->
<!--          <p>组策略对象</p>-->
<!--          <p>{{ data.sudurule }}<span>个</span></p>-->
<!--          <div>-->
<!--            <p><i class="fa fa-clock-o"></i> {{ date }}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->


    </div>
  </div>
</template>

<script>
export default {
  name: "Routine",
  emits: ['close'],
  data() {
    return {
      data: {},
      date: '',
      domainOrOrg: '',
    }
  },
  props: ['domainId', 'treeData'],
  watch: {
    domainId(val) {
      if (val.split('-')[1] == 0) {
        this.domainOrOrg = 'domain'
      } else {
        this.domainOrOrg = 'org'
      }
      this.getData()
    }
  },
  mounted() {
    if (this.domainId.split('-')[1] == 0) {
      this.domainOrOrg = 'domain'
    } else {
      this.domainOrOrg = 'org'
    }

    this.getData()
  },
  methods: {
    getData() {
      this.$http.get(this.domainId.split('-')[1] == 1 ? '/report/countByOU' : '/report/countByDomain', {
        params: {
          domainId: this.domainId.split('-')[1] == 0 ? this.domainId.split('-')[0] : this.$global.Tree.searchDomainId(this.treeData, this.domainId.split('-')[0], null),
          ouId: this.domainId.split('-')[1] == 0 ? null : this.domainId.split('-')[0]
        }
      }).then((res) => {
        this.data = res.data
        this.date = new Date().toLocaleString('chinese',{hour12:false}).replace(/\//g, '-')
      })
    },

  }
}
</script>

<style scoped>
.p-grid {
  margin: 0;
}

.content {
  margin-top: 15px;
}


.m-card {
  padding: 1rem 1rem 0 1rem;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  border-radius: 6px;
}

.m-card > p {
  font-weight: 500;
  font-size: 18px;
  margin: 0;
  line-height: 30px;
}


.m-card > div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  border-top: 1px solid #dee2e6;
  line-height: 30px;
}

.m-card > div > p {
  color: rgba(0, 0, 0, 0.447058823529412);
  line-height: inherit;
  margin: 0;
}

.m-card > p > span {
  margin-left: 3px;
  font-size: 12px;
}

.m-card a {
  cursor: pointer;
}
</style>
