<template>
  <SecondNav :list="secondNavList" :isNav="true"></SecondNav>
  <div class="view" id='page'>
    <span style="color: #ffffff">域：</span>
    <TreeSelect v-model="treeSelect" class="input" @change="changTree" :options="treeList" placeholder="请选择域" />
  </div>
  <div class="tableView" style="overflow:auto;height: 100%;">
    <div class="p-grid" style="margin-right: 1rem;">
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">域计算机数</p>
                <h3 class="m-0">{{ data.host }}</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="fa fa-3x fa-desktop" style="color: orange"></i>
              </div>
            </div>
            <Button class="p-button-link button-right" @click="toPage('/DomainManage/DomainManage')">
              查看明细
            </Button>
          </template>
        </Card>
      </div>
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">组织单位（OU）数</p>
                <h3 class="m-0">{{ data.ou }}</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="fa fa-3x fa-sitemap" style="color: rgb(230,55,64)"></i>
              </div>
            </div>
            <Button class="p-button-link button-right" @click="toPage('/DomainManage/DomainManage')">查看明细
            </Button>
          </template>
        </Card>
      </div>
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">用户组数</p>
                <h3 class="m-0">{{ data.user_group }}</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="fa fa-3x fa-users" style="color: rgb(18,63,130)"></i>
              </div>
            </div>
            <Button class="p-button-link button-right" @click="toPage('/DomainManage/DomainManage')">查看明细</Button>
          </template>
        </Card>
      </div>
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">域用户数</p>
                <h3 class="m-0">{{ data.user }}</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="fa fa-3x fa-user" style="color: purple"></i>
              </div>
            </div>
            <Button class="p-button-link button-right" @click="toPage('/DomainManage/DomainManage')">查看明细
            </Button>
          </template>
        </Card>
      </div>

      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">LDAP域控集群节点数</p>
                <h3 class="m-0">3</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="pi fa-3x pi-list" style="color: slateblue"></i>
              </div>
            </div>
            <Button class="p-button-link button-right">
              查看明细
            </Button>
          </template>
        </Card>
      </div>
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">LDAP域控集群状态</p>
                <h3 class="m-0">正常</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="pi fa-3x pi-flag" style="color: seagreen"></i>
              </div>
            </div>
            <Button class="p-button-link button-right">
              查看明细
            </Button>
          </template>
        </Card>
      </div>
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">系统警告</p>
                <h3 class="m-0">0</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="pi fa-3x pi-info-circle" style="color: darkgoldenrod"></i>
              </div>
            </div>
            <Button class="p-button-link button-right">
              查看明细
            </Button>
          </template>
        </Card>
      </div>
      <div class="p-col-3">
        <Card>
          <template v-slot:content>
            <div class="p-grid p-m-0">
              <div class="p-col-9 p-0 ">
                <p class="m-0 text">系统错误</p>
                <h3 class="m-0">0</h3>
              </div>
              <div class="p-col-3 p-0">
                <i class="pi pi-exclamation-triangle fa-3x" style="color: red;"></i>
              </div>
            </div>
            <Button class="p-button-link button-right">
              查看明细
            </Button>
          </template>
        </Card>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;width:98.3%;margin-bottom: 6rem;">
      <div class="card" style="padding-right:0.5rem;padding-left:0">
        <Card>
          <template v-slot:header>
            <div class="card-title">
              <span>域主机架构</span>
            </div>
          </template>
          <template v-slot:content>
            <div id="main1" style="width: 100%;height: 250px;text-align: center;">暂无数据</div>
          </template>
        </Card>
      </div>

      <div class="card" style="padding-left:0.5rem;padding-right:0">
        <Card>
          <template v-slot:header>
            <div class="card-title">
              <span>域主机操作系统版本</span>
            </div>
          </template>
          <template v-slot:content>
            <div id="main6" style="width: 100%;height: 250px;text-align: center;">暂无数据</div>
          </template>
        </Card>
      </div>

      <div class="cardx">
        <Card>
          <template v-slot:header>
            <div class="card-titlex">
              <span>域用户在线人数</span>
            </div>
          </template>
          <template v-slot:content>
            <div id="main7" style="width: 100%;height: 250px;text-align: center;">暂无数据</div>
          </template>
        </Card>
      </div>


    </div>
  </div>
</template>

<script>
import SecondNav from "@/views/modules/Public/SecondNav";
import * as echarts from "echarts";

export default {
  name: "CustomPanel",
  components: {
    SecondNav,
  },
  data() {
    return {
      secondNavList: [],
      // {
      //   index: 1,
      //   icon: "fa fa-home",
      //   name: "首页",
      //   url: "/",
      //   message: "从这里可以看到系统概览信息，还可以自定义喔！",
      // },
      // {
      //   index: 2,
      //   icon: 'fa-book',
      //   name: '使用手册'
      // }
      treeSelect: {},
      treeList: [],
      data: {},
      sysArchData: [],
      sysversionData: [],
      online_numData: [],
      online_ynumData: [],
      client_install_stat_x_data: [],
      client_install_stat_y_data: [],
      groupby_ou_x_data: [],
      groupby_ou_y_data: [],
      passwdExpirData: [],
      userData: [],
      strategyData: [],
      clientVersionData: [],
      passwdExpirName: [],
      userName: [],
      strategyName: [],
      clientVersionName: [],
    };
  },
  created() {
    if (localStorage.getItem("resources")) {
      this.secondNavList = [];
      JSON.parse(localStorage.getItem("resources")).forEach((item) => {
        if (item.pid == 168) {
          this.secondNavList.push(item);
        }
      });
    }
  },
  mounted() {
    window.onresize = () => {
      this.sysArchData = [];
      this.sysversionData = [];
      this.online_numData = [];
      this.online_ynumData = [];
      this.passwdExpirData = [];
      this.userData = [];
      this.strategyData = [];
      this.clientVersionData = [];
      this.passwdExpirName = [];
      this.userName = [];
      this.strategyName = [];
      this.clientVersionName = [];
      for (let i = 1; i <= 7; i++) {
        this.$echarts.init(document.getElementById("main" + i)).dispose();
      }
      let id = Object.keys(this.treeSelect)[0].split('-')[0];
      this.getEchartData(id);
    };
    let domainId = localStorage.getItem("DOMAIN_ID");
    this.treeSelect[domainId + "-0"] = true;
    this.getData(domainId);
    this.getEchartData(domainId);
    this.$http.get("/domain/tree").then((res) => {
      let data = res.data;
      data = data.filter((item) => {
        return item.type === "0" && item.upStatus === 0;
      });
      this.treeList = this.$global.Tree.makeTree(data);
    });
  },
  methods: {
    parseTime(time) {
      if (arguments.length === 0) {
        return null;
      }
      const format = "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (typeof time === "string" && /^[0-9]+$/.test(time)) {
          time = parseInt(time);
        }
        if (typeof time === "number" && time.toString().length === 10) {
          time = time * 1000;
        }
        date = new Date(time);
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
      };
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
          value = "0" + value;
        }
        return value || 0;
      });
      return time_str;
    },
    getEchartData(domainId) {
      this.$http
        .get("/report/charts", { params: { domainId: domainId } })
        .then((res) => {
          //主机分类
          Object.values(res.data.sys_arch).forEach((item) => {
            item.name = item.key;
            delete item.key;
            this.sysArchData.push(item);
          });

          //系统版本(饼图)
          Object.values(res.data.sys_version).forEach((item) => {
            item.name = item.key;
            delete item.key;
            this.sysversionData.push(item);
          });
          console.log(res.data.sys_version);
          console.log(this.sysversionData);

          //在线人数
          let arr = [];
          arr = Object.keys(res.data.online_num);
          arr.forEach((item) => {
            this.online_numData.push(this.parseTime(item));
          });
          this.online_ynumData = Object.values(res.data.online_num);

          // 客户端安装量统计
          for (let i in res.data.install_stat) {
            this.client_install_stat_x_data.push(res.data.install_stat[i].key);
            this.client_install_stat_y_data.push(
              res.data.install_stat[i].value
            );
          }

          // ou分组的客户端安装量统计
          let arr3 = [];
          arr3 = Object.keys(res.data.install_groupby_ou);
          arr3.forEach((item) => {
            this.groupby_ou_x_data.push(item);
          });
          this.groupby_ou_y_data = Object.values(res.data.install_groupby_ou);

          //密码过期
          Object.keys(res.data.passwd_expir).forEach((item) => {
            if (item == "seven") {
              this.passwdExpirName[2] = "7天内过期";
            } else if (item == "fourteen") {
              this.passwdExpirName[1] = "14天内过期";
            } else if (item == "expir") {
              this.passwdExpirName[3] = "已过期";
            } else if (item == "other") {
              this.passwdExpirName[0] = "其它";
            }
          });
          this.passwdExpirData[3] = res.data.passwd_expir.expir;
          this.passwdExpirData[2] = res.data.passwd_expir.seven;
          this.passwdExpirData[1] = res.data.passwd_expir.fourteen;
          this.passwdExpirData[0] = res.data.passwd_expir.other;

          //域用户
          Object.keys(res.data.user).forEach((item) => {
            if (item == "login_in_seven") {
              this.userName.push("7天内登录");
            } else if (item == "never_login_in_seven") {
              this.userName.push("7天未登录");
            } else if (item == "total") {
              this.userName.push("总计");
            }
          });
          Object.values(res.data.user).forEach((item) => {
            this.userData.push(item);
          });
          //组策略
          Object.keys(res.data.strategy).forEach((item) => {
            if (item == "private") {
              this.strategyName.push("私有策略");
            } else if (item == "public") {
              this.strategyName.push("公共策略");
            } else if (item == "used") {
              this.strategyName.push("已使用策略");
            }
          });
          this.strategyName.push("未使用策略");
          this.strategyName.push("总计");
          let total = 0;
          let neverUse = 0;
          Object.values(res.data.strategy).forEach((item) => {
            total += item.num;
            item.name = item.type;
            item.value = item.num;
            delete item.type;
            delete item.num;
            this.strategyData.push(item);
          });
          Object.values(res.data.strategy).forEach((item) => {
            if (item.name == "used") {
              neverUse = total - item.value;
            }
          });
          this.strategyData.push(neverUse);
          this.strategyData.push(total);
          //客户端
          Object.keys(res.data.client_version).forEach((item) => {
            this.clientVersionName.push(item);
          });
          Object.values(res.data.client_version).forEach((item) => {
            this.clientVersionName.forEach((i) => {
              if (item.key == i) {
                this.clientVersionData.push(item.value);
              }
            });
          });
          this.myChart();
        });
    },
    myChart() {
      //主机分类
      let myChart = this.$echarts.init(document.getElementById("main1"), null, {
        height: 250,
      });
      let option = {
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   orient: "vertical",
        //   left: "left",
        // },
        series: [
          {
            name: "数量",
            type: "pie",
            radius: "50%",
            data: this.sysArchData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(option);

      //系统版本
      let myChart6 = this.$echarts.init(
        document.getElementById("main6"),
        null,
        {
          height: 250,
        }
      );
      let option6 = {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "数量",
            type: "pie",
            radius: "50%",
            data: this.sysversionData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart6.setOption(option6);

      //在线人数
      let myChart7 = this.$echarts.init(
        document.getElementById("main7"),
        null,
        { height: 250 }
      );

      let option7 = {
        tooltip: {
          trigger: "axis",
          confine:true,
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.online_numData,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 90,
            end: 100,
          },
          {
            start: 90,
            end: 100,
          },
        ],
        series: [
          {
            name: "在线人数",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgb(255, 70, 131)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)",
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)",
                },
              ]),
            },
            data: this.online_ynumData,
          },
        ],
      };
      // 渲染折线图
      myChart7.setOption(option7);

      /**
      //客户端安装量统计
      let clientInstallStatChart = this.$echarts.init(
        document.getElementById("clientInstallStatChart"),
        null,
        { height: 250 }
      );
      let clientInstallStatChartOpts = {
        tooltip: {
          trigger: "axis",
          confine:true,
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.client_install_stat_x_data,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 90,
            end: 100,
          },
          {
            start: 90,
            end: 100,
          },
        ],
        series: [
          {
            name: "客户端安装量",
            type: "line",
            symbol: "none",
            sampling: "lttb",
            itemStyle: {
              color: "rgb(255, 70, 131)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)",
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)",
                },
              ]),
            },
            data: this.client_install_stat_y_data,
          },
        ],
      };
      // 渲染折线图
      clientInstallStatChart.setOption(clientInstallStatChartOpts);


      //客户端安装量统计
      let groupbyOuCharts = this.$echarts.init(
        document.getElementById("groupbyOu"),
        null,
        { height: 1200 }
      );
      let groupbyOuChartsOpts = {
        tooltip: {
          trigger: "axis",
          confine:true,
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.groupby_ou_x_data,
        },
        series: [
          {
            type: "bar",
            data: this.groupby_ou_y_data,
          },
        ],
      };
      groupbyOuCharts.setOption(groupbyOuChartsOpts);


      //密码过期
      let myChart2 = this.$echarts.init(
        document.getElementById("main2"),
        null,
        {
          height: 250,
        }
      );
      let option2 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.passwdExpirName,
        },
        series: [
          {
            type: "bar",
            data: this.passwdExpirData,
            itemStyle: {
              color: function () {
                return (
                  "#" +
                  Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                );
              },
            },
          },
        ],
      };
      myChart2.setOption(option2);
      //域用户
      let myChart3 = this.$echarts.init(
        document.getElementById("main3"),
        null,
        {
          height: 250,
        }
      );
      let option3 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.userName,
        },
        series: [
          {
            type: "bar",
            data: this.userData,
            itemStyle: {
              color: function () {
                return (
                  "#" +
                  Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                );
              },
            },
          },
        ],
      };
      myChart3.setOption(option3);
      //组策略
      let myChart4 = this.$echarts.init(
        document.getElementById("main4"),
        null,
        {
          height: 250,
        }
      );
      let option4 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.strategyName,
        },
        series: [
          {
            type: "bar",
            data: this.strategyData,
            itemStyle: {
              color: function () {
                return (
                  "#" +
                  Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                );
              },
            },
          },
        ],
      };
      myChart4.setOption(option4);
      //客户端
      let myChart5 = this.$echarts.init(
        document.getElementById("main5"),
        null,
        {
          height: 250,
        }
      );
      let option5 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: this.clientVersionName,
        },
        series: [
          {
            type: "bar",
            data: this.clientVersionData,
            itemStyle: {
              color: function () {
                return (
                  "#" +
                  Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                );
              },
            },
          },
        ],
      };
      myChart5.setOption(option5);
       **/
    },
    getData(id) {
      this.$http
        .get("/report/countByDomain", {
          params: {
            domainId: Number(id),
          },
        })
        .then((res) => {
          this.data = res.data;
        });
    },
    changTree(e) {
      let id = Object.keys(e)[0].split("-")[0];
      this.getData(id);
    },
    toPage(url) {
      if (localStorage.getItem("resources")) {
        let resources = JSON.parse(localStorage.getItem("resources"));
        let urls = [];
        resources.forEach((item) => {
          if (item.url) {
            urls.push(item.url);
          }
        });
        if (urls.includes(url)) {
          this.$router.push(url);
        } else {
          this.$toast.add({
            severity: "error",
            summary: "无权访问此功能",
            life: 3000,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.view {
  margin-right: 1rem;
}

.p-0 {
  padding: 0;
}

.m-0 {
  margin: 0;
}

.text {
  font-size: 12px;
  color: #6c757d;
}
.card-title {
  border-bottom: 1px solid #dee2e6;
  line-height: 50px;
  padding: 0 1.5rem;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}
/*在线人数*/
.card-titlex {
  border-bottom: 1px solid #dee2e6;
  line-height: 50px;
  padding: 0 1.5rem;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}

.card-title i {
  font-size: 18px;
  line-height: 50px;
}

.card-titlex i {
  font-size: 18px;
  line-height: 50px;
}

.input {
  padding-left: 1rem !important;
  height: 34px;
  width: 200px;
  border-radius: 34px;
}

.input::v-deep(.p-inputtext) {
  line-height: 30px;
  padding: 0 0.5rem;
}

::v-deep(.p-button) {
  padding: 0 1rem;
  height: 30px;
  line-height: 30px;
}

.tableView {
  margin-top: 10px;
}

.button-right {
  padding: 0;
}

.p-col-3 ::v-deep(.p-button) {
  background-color: transparent;
  height: 30px;
  border: none;
  color: #015486;
  padding: 0;
}

.p-col-3::v-deep(.p-button:enabled:hover) {
  background-color: transparent;
  border: none;
  color: #015486;
}

.p-grid {
  margin-right: 0;
  margin-top: 0;
}

.p-grid p {
  width: 100%;
}

.p-card {
  border-radius: 8px;
}

.p-grid .p-col-9 {
  padding: 0;
}

.card {
  padding: 0;
  width: 50%;
  flex: 0 0 auto;
  background: transparent;
}

/*在线人数*/
.cardx {
  padding: 0;
  width: 100%;
  flex: 1 1 auto;
  background: transparent;
}
/* .card:nth-child(n + 3) {
  margin-top: 1rem;
} */
.card:nth-child(2n-1) {
  padding-left: 0.5rem;
}
.card:nth-child(2n) {
  padding-right: 0.5rem;
}
.card:nth-child(4),
.card:nth-child(5) {
  margin-top: 1rem;
}
::-webkit-scrollbar {
  display: none;
}
::v-deep(.p-card-content) {
  padding: 0;
}
</style>
