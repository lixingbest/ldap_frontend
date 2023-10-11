<template>
  <div class="view">
    <div class="p-d-flex p-jc-between">
      <h5><span class="pi pi-globe p-mr-3" style="font-size:2rem"></span>网络保护</h5>
      <Button label="保存" @click="save" icon="pi pi-save"/>
    </div>
    <p class="p-text-secondary">提供应用联网行为的管控，构筑安全上网环境</p>
    <div>
      <div class="p-d-flex">
        <h5 style="font-size: 1.1rem"><span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>防火墙</h5>
        <InputSwitch class="p-ml-3" v-model="check1"/>
      </div>
      <p class="p-text-secondary">提供网络访问许可策略</p>
    </div>

    <h5 style="font-size: 1.1rem"><span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>应用程序联网</h5>
    <p class="p-text-secondary">控制应用程序主动访问网络行为</p>
    <div class="p-field-radiobutton">
      <RadioButton id="city1" name="type" value="enforcing" v-model="value2"/>
      <label for="city1">禁止 仅授权的应用程序可以联网</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city2" name="type" value="warning" v-model="value2"/>
      <label for="city2">询问 检测到未授权的应用程序是提醒我</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city3" name="type" value="off" v-model="value2"/>
      <label for="city3">允许 任何应用程序都可以联网</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "network-protection",
  data() {
    return {
      check1: false,
      value2: null
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
      this.value2 = null
      this.check1 = false
      const deviceList = localStorage.getItem('device') ? JSON.parse(localStorage.getItem('device')) : []
      console.log(deviceList)
      deviceList.forEach(item => {
        if (item.name === 'firewall') {
          this.check1 = JSON.parse(item.value).value === 'custom'
        } else if (item.name === 'firewall.software') {
          this.value2 = JSON.parse(item.value).value
        }
      })
    },
    save() {
      let selectedNode = JSON.parse(localStorage.getItem('selectedNode'))
      let data = [
        {
          strategyId: selectedNode.id,
          name: 'firewall',
          value: JSON.stringify({value: this.check1 ? 'custom' : 'trusted'})
        },
        {
          strategyId: selectedNode.id,
          name: 'firewall.software',
          value: JSON.stringify({
            value: this.value2, kysec_status: 2,
            kysec_netctl: this.value2 === 'off' ? 0 : (this.value2 === 'warning' ? 2 : 1)
          })
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

h5 {
  font-weight: 600;
}
</style>
