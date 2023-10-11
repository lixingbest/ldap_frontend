<template>
  <div class="view">
    <h5 class="p-d-flex p-jc-between p-ai-center">共享
      <Button label="保存" @click="save" icon="pi pi-save"/>
    </h5>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>允许其他人查看你的桌面</label>
        <InputSwitch v-model="but1"/>
      </div>
      <div class="p-field p-grid">
        <label>允许连接控制屏幕</label>
        <InputSwitch v-model="but2"/>
      </div>
    </div>
    <h5>安全</h5>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>您必须为本机机器确认访问</label>
        <InputSwitch v-model="but3"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "desktop-share",
  data() {
    return {
      but1: false,
      but2: false,
      but3: false,
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
      this.but1 = false
      this.but2 = false
      this.but3 = false
      const deviceList = localStorage.getItem('device') ? JSON.parse(localStorage.getItem('device')) : []
      deviceList.forEach(item => {
        if (item.name === 'desktopshare') {
          this.but1 = JSON.parse(item.value).value === 'start'
        } else if (item.name === 'desktopshare.control') {
          this.but2 = !JSON.parse(item.value).value
        } else if (item.name === 'desktopshare.confirm') {
          this.but3 = JSON.parse(item.value).value
        }
      })
    },
    save() {
      let selectedNode = JSON.parse(localStorage.getItem('selectedNode'))
      let data = [
        {
          strategyId: selectedNode.id,
          name: 'desktopshare',
          value: JSON.stringify({value: this.but1 ? 'start' : 'stop'})
        },
        {
          strategyId: selectedNode.id,
          name: 'desktopshare.control',
          value: JSON.stringify({value: !this.but2})
        },
        {
          strategyId: selectedNode.id,
          name: 'desktopshare.confirm',
          value: JSON.stringify({value: this.but3})
        },

      ]
      if (selectedNode.type === 'strategy') {
        this.$http.post('/strategy/settings/saveValues', data).then(() => {
          this.$store.commit('changeDeviceSaveFlag')
          this.$toast.add({severity: 'info', summary: '保存成功！', life: 3000});
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
  width: 300px;
}
</style>
