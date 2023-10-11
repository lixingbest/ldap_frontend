<template>
  <div class="page">
    <div class="view" id='page' style="display: flex;align-items: center;justify-content: space-between">
      <div>
        <span>域：</span>
        <TreeSelect v-model="treeSelect" class="input" @change="changTree" :options="treeList" placeholder="请选择域"/>
      </div>
      <Button icon="pi pi-download" label="导出" @click="exportExe"></Button>
    </div>

    <div id="toolbar" class="toolbar" @click="changeTab">
      <div class="left-btn" @click="move('left')"><i class="pi pi-angle-left"></i></div>
      <div :style="{background:current===0?'#dee2e6':''}" class="toolbar-item" id="0">域主机架构</div>
      <div :style="{background:current===1?'#dee2e6':''}" class="toolbar-item" id="1">域主机操作系统版本</div>
      <div :style="{background:current===2?'#dee2e6':''}" class="toolbar-item" id="2">域用户在线人数</div>
      <div :style="{background:current===3?'#dee2e6':''}" class="toolbar-item" id="3">客户端日安装量统计</div>
      <div :style="{background:current===4?'#dee2e6':''}" class="toolbar-item" id="4">组织机构终端安装统计</div>
      <div :style="{background:current===5?'#dee2e6':''}" class="toolbar-item" id="5">域用户密码过期</div>
      <div :style="{background:current===6?'#dee2e6':''}" class="toolbar-item" id="6">域用户登录</div>
      <div :style="{background:current===7?'#dee2e6':''}" class="toolbar-item" id="7">组策略</div>
      <div :style="{background:current===8?'#dee2e6':''}" class="toolbar-item" id="8">客户端版本</div>
      <div :style="{background:current===9?'#dee2e6':''}" class="toolbar-item" id="9">退域入域统计</div>
      <div :style="{background:current===10?'#dee2e6':''}" class="toolbar-item" id="10">系统日志统计</div>
      <div class="right-btn" @click="move('right')"><i class="pi pi-angle-right"></i></div>
    </div>

    <div class="chartDiv">
      <div v-show="current===0" id="main1">暂无数据</div>
      <div v-show="current===1" id="main6">暂无数据</div>
      <div v-show="current===2" id="main7">暂无数据</div>
      <div v-show="current===3" id="clientInstallStatChart">
        暂无数据
      </div>
      <div v-show="current===4" id="groupbyOu">暂无数据</div>
      <div v-show="current===5" id="main2">暂无数据</div>
      <div v-show="current===6" id="main3">暂无数据</div>
      <div v-show="current===7" id="main4">暂无数据</div>
      <div v-show="current===8" id="main5">暂无数据</div>
      <div v-show="current===9" id="main9">暂无数据</div>
      <div v-show="current===10" id="main10">暂无数据</div>
    </div>

  </div>
</template>

<script>

import * as echarts from "echarts";
import {format} from '@/utils/time'

export default {
  name: "CustomPanel",

  data() {
    return {
      domainId: null,
      current: 0,
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
      clientNameList: [],
      clientValueList: [],
      countByMessageNames: [],
      countByMessageValues: []
    };
  },
  created() {
    this.domainId = localStorage.getItem("DOMAIN_ID");

  },
  watch: {
    current: {
      handler() {

        let element = document.getElementById(this.current);

        let instanceByDom = this.$echarts.getInstanceByDom(element);
        if (instanceByDom) {

          instanceByDom.resize();
        } else {
          this.$nextTick(() => {
            this.myChart()
          })
        }
      }
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
    move(direction) {
      let element = document.getElementById("toolbar");

      element.scrollBy({
        top: 0,
        left: direction === 'right' ? 150 : -150,
        behavior: 'smooth'
      })
    },
    changeTab(event) {
      this.current = parseInt(event.target.getAttribute("id"))

    },
    exportExe() {
      this.$http.get("/report/export", {
        params: {
          domainId: Object.keys(this.treeSelect)[0].split('-')[0]
        },
        responseType: 'blob'
      }).then(res => {
        // const name = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1]).replace(/\"/g, '');
        const name = '系统报表.xlsx'
        const link = document.createElement('a')
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `${name}`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    getEchartData(domainId) {
      this.$http
          .get("/report/charts", {params: {domainId: domainId}})
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


            //在线人数
            let arr = [];
            arr = Object.keys(res.data.online_num);
            arr.forEach((item) => {
              this.online_numData.push(format(item));
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


            const clientmap = res.data.clientmap

            this.clientNameList = ["终端入域", "终端退域"]
            this.clientValueList = [clientmap['clientinstcount'], clientmap['clientleavecount']]


            const countByMessage = res.data.countByMessage;

            this.countByMessageNames = [];
            this.countByMessageValues = [];
            for (let item of countByMessage) {
              this.countByMessageNames.push(item['message'])
              this.countByMessageValues.push(item['count']);
            }

            this.myChart();
          });
    },
    myChart() {
      //主机分类
      if (this.current === 0) {
        let element = document.getElementById("main1");
        let myChart = this.$echarts.getInstanceByDom(element);
        if (!myChart) {
          myChart = this.$echarts.init(element);
        }
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
      }

      if (this.current === 1) {

        let element = document.getElementById("main6");
        let myChart6 = this.$echarts.getInstanceByDom(element);
        if (!myChart6) {
          myChart6 = this.$echarts.init(element);
        }
        //系统版本
        // let myChart6 = this.$echarts.init(
        //     document.getElementById("main6")
        // );
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
      }

      if (this.current === 2) {

        let element = document.getElementById("main7");
        let myChart7 = this.$echarts.getInstanceByDom(element);
        if (!myChart7) {
          myChart7 = this.$echarts.init(element);
        }
        //在线人数
        // let myChart7 = this.$echarts.init(
        //     document.getElementById("main7")
        // );

        let option7 = {
          tooltip: {
            trigger: "axis",
            confine: true,
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
      }
      if (this.current === 3) {
        let element = document.getElementById("clientInstallStatChart");
        let clientInstallStatChart = this.$echarts.getInstanceByDom(element);
        if (!clientInstallStatChart) {
          clientInstallStatChart = this.$echarts.init(element);
        }
        //客户端安装量统计
        // let clientInstallStatChart = this.$echarts.init(
        //     document.getElementById("clientInstallStatChart")
        // );
        let clientInstallStatChartOpts = {
          tooltip: {
            trigger: "axis",
            confine: true,
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
      }
      if (this.current === 4) {

        let element = document.getElementById("groupbyOu");
        let groupbyOuCharts = this.$echarts.getInstanceByDom(element);
        if (!groupbyOuCharts) {
          groupbyOuCharts = this.$echarts.init(element);
        }
        //客户端安装量统计
        // let groupbyOuCharts = this.$echarts.init(
        //     document.getElementById("groupbyOu")
        // );
        let groupbyOuChartsOpts = {
          tooltip: {
            trigger: "axis",
            confine: true,
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
      }
      //密码过期
      if (this.current === 5) {
        let element = document.getElementById("main2");
        let myChart2 = this.$echarts.getInstanceByDom(element);
        if (!myChart2) {
          myChart2 = this.$echarts.init(element);
        }
        // let myChart2 = this.$echarts.init(
        //     document.getElementById("main2")
        // );
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
      }
      //域用户
      if (this.current === 6) {
        let element = document.getElementById("main3");
        let myChart3 = this.$echarts.getInstanceByDom(element);
        if (!myChart3) {
          myChart3 = this.$echarts.init(element);
        }
        // let myChart3 = this.$echarts.init(
        //     document.getElementById("main3")
        // );
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
      }
      if (this.current === 7) {
        let element = document.getElementById("main4");
        let myChart4 = this.$echarts.getInstanceByDom(element);
        if (!myChart4) {
          myChart4 = this.$echarts.init(element);
        }
        // //组策略
        // let myChart4 = this.$echarts.init(
        //     document.getElementById("main4")
        // );
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
      }
      if (this.current === 8) {
        let element = document.getElementById("main5");
        let myChart5 = this.$echarts.getInstanceByDom(element);
        if (!myChart5) {
          myChart5 = this.$echarts.init(element);
        }
        //客户端
        // let myChart5 = this.$echarts.init(
        //     document.getElementById("main5")
        // );
        console.log("客户端ele")
        console.log(myChart5)
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
      }

      if (this.current === 9) {
        const ele = document.getElementById("main9")
        let inst = this.$echarts.getInstanceByDom(ele)
        if (!inst) {
          inst = this.$echarts.init(ele);
        }

        let option = {
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
          },
          yAxis: {
            type: "category",
            data: this.clientNameList,
          },
          series: [
            {
              type: "bar",
              data: this.clientValueList,
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
        }

        inst.setOption(option)
      }
      if (this.current === 10) {
        const ele = document.getElementById("main10")
        let inst = this.$echarts.getInstanceByDom(ele)
        if (!inst) {
          inst = this.$echarts.init(ele);
        }

        let option = {
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
          },
          yAxis: {
            type: "category",
            data: this.countByMessageNames,
          },
          series: [
            {
              type: "bar",
              data: this.countByMessageValues,
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
        }

        inst.setOption(option)
      }
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
      this.domainId = id;
      this.getEchartData(id);
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

<style scoped lang="scss">
.toolbar {
  margin-top: 1rem;
  display: flex;
  border: 1px solid #dee2e6;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow-x: auto;
  position: relative;


  .left-btn {
    position: sticky;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    padding: 0 10px;
    background: #FFFFFF;
    z-index: 99;
  }

  .right-btn {
    position: sticky;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    padding: 0 10px;
    background: #FFFFFF;
    z-index: 99;
    cursor: pointer;
  }

  .toolbar-item {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-right: 1px solid #dee2e6;
    cursor: pointer;
    white-space: nowrap;
  }
}

.chartDiv {
  width: 100%;
  height: calc(100% - 100px);

  div {
    width: 100%;
    height: 100%;

  }
}

.page {
  display: block;
  padding: 10px;
}

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
  padding: 10px;
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
