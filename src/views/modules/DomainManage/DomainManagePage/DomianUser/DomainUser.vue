<template>
  <div class="layout-page">
    <div class="m-content">
      <ActiveUser v-if="activeDisplay" ref="active"
                  :domain-id="domainId" :update-flag="updateFlag"
                  :tree-data="treeData"></ActiveUser>
      <PlanUser v-if="planerDisplay" ref="planer"
                :domain-id="domainId" :tree-data="treeData" update-flag="updateFlag"></PlanUser>
      <SpareUser v-if="spareDisplay" ref="spare"
                 :domain-id="domainId" :tree-data="treeData" update-flag="updateFlag"></SpareUser>
    </div>
    <ul class="m-menu">
      <li :style="{'background':activeDisplay?'#E3F2FD':'#ffffff','color':activeDisplay?'#015486':null}"
          @click="changeState(1)">
        <i class="fa fa-check-circle-o p-mr-1" style="color: #20d077"></i>
        <span>活跃用户</span>
      </li>
      <li :style="{'background':planerDisplay?'#E3F2FD':'#ffffff','color':planerDisplay?'#015486':null}"
          @click="changeState(2)">
        <i class="fa fa-clock-o p-mr-1" style="color: dodgerblue"></i>
        <span>计划用户</span>
      </li>
      <li :style="{'background':spareDisplay?'#E3F2FD':'#ffffff','color':spareDisplay?'#015486':null}"
          @click="changeState(3)">
        <i class="fa fa-coffee p-mr-1"></i>
        <span>备用用户</span>
      </li>
    </ul>
  </div>
</template>

<script>
import ActiveUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/ActiveUser";
import PlanUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/PlanUser";
import SpareUser from "@/views/modules/DomainManage/DomainManagePage/DomianUser/SpareUser";

export default {
  name: "DomainUser",
  components: {SpareUser, PlanUser, ActiveUser},
  props: ['domainId', 'updateFlag', 'treeData'],
  data() {
    return {
      activeDisplay: true,
      planerDisplay: false,
      spareDisplay: false,
    }
  },
  methods: {
    changeState(i) {
      this.activeDisplay = false
      this.planerDisplay = false
      this.spareDisplay = false
      switch (i) {
        case 1: {
          this.activeDisplay = true
          break
        }
        case 2: {
          this.planerDisplay = true
          break
        }
        case 3: {
          this.spareDisplay = true
        }
      }
    }
  }
}
</script>

<style scoped>
.layout-page {
  width: 100%;
  height: 100%;
  padding-top: 1rem;
}

.m-menu {
  width: 100%;
  margin: 0;
  list-style: none;
  /*padding: 0.5rem 1rem;*/
  padding: 0;
  line-height: 20px;
  color: #495057;
  font-size: 14px;
  display: flex;
  border-top: 1px solid #dee2e6;
  position: absolute;
  left: 0;
  bottom: 0;
}

.m-menu > li {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: #6c757d;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 3px;
  cursor: pointer;
}

.m-content {
  width: 100%;
  height: 100%;
}
</style>
