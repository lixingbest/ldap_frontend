<template>
  <div class="view">
    <h5 class="p-d-flex p-jc-between p-ai-center">屏保
      <Button label="保存" @click="save" icon="pi pi-save"/>
    </h5>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>开启屏保</label>
        <InputSwitch v-model="checked"/>
      </div>
      <div class="p-field p-grid">
        <label>屏幕保护程序</label>
        <Dropdown v-model="screenSave" :options="screenSaveList" option-label="label" option-value="value"></Dropdown>
      </div>
      <div class="p-field p-grid">
        <label>等待时间</label>
        <Dropdown v-model="time" :options="timeList" option-label="label" option-value="value"></Dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "screen-saver",
  data() {
    return {
      checked: true,
      screenSave: null,
      time: null,
      screenSaveList: [
        {label: '默认', value: 'default-ukui'},
        {label: '黑屏', value: 'default-ukui-custom'},
      ],
      timeList: [
        {label: '1分钟', value: 1},
        {label: '5分钟', value: 5},
        {label: '10分钟', value: 10},
        {label: '30分钟', value: 30},
        {label: '45小时', value: 45},
        {label: '1小时', value: 60},
        {label: '1.5小时', value: 90},
        {label: '2小时', value: 120},
      ],
    }
  },
  computed: {
    device_flag() {
      return this.$store.state.device_flag
    }
  },
  watch: {
    device_flag() {
      this.changeDevice()
    }
  },
  mounted() {
    this.changeDevice()
  },
  methods: {
    changeDevice() {
      this.screenSave = null
      this.time = null
      const deviceList = localStorage.getItem('device') ? JSON.parse(localStorage.getItem('device')) : []
      deviceList.forEach(item => {
        if (item.name === 'screensaver.idle-delay') {
          this.time = JSON.parse(item.value).value
        } else if (item.name === 'screensaver.type') {
          this.screenSave = JSON.parse(item.value).name
        }
      })
    },
    save() {
      let selectedNode = JSON.parse(localStorage.getItem('selectedNode'))
      let data = [
        {
          strategyId: selectedNode.id,
          name: 'screensaver.idle-delay',
          value: JSON.stringify({value: this.time})
        },
        {
          strategyId: selectedNode.id,
          name: 'screensaver.type',
          value: JSON.stringify({name: this.screenSave})
        }
      ]
      if (selectedNode.type === 'strategy') {
        this.$http.post('/strategy/settings/saveValues', data).then(() => {
          this.$toast.add({severity: 'info', summary: '保存成功！', life: 3000});
          this.$store.commit('changeDeviceSaveFlag')
        })
      } else {
        this.$toast.add({severity: 'info', summary: '请选择策略！', life: 3000});
      }
    }
  }
}
</script>

<style scoped>
.view {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.p-grid {
  margin: 0 0 1rem 0;
}

.p-field {
  align-items: center;
}

h5 {
  font-weight: 600;
}

.p-field > label {
  margin-bottom: 0;
  width: 150px;
}
</style>
