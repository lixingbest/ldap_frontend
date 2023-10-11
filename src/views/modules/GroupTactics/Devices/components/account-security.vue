<template>
  <div class="view">
    <div class="p-d-flex p-jc-between">
      <h5><span class="pi pi-user p-mr-3" style="font-size:2rem"></span>账号安全</h5>
      <Button label="保存" @click="save" icon="pi pi-save"/>
    </div>

    <p class="p-text-secondary">提供账号相关安全保障</p>
    <h5 style="font-size: 1.1rem"><span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>账户密码安全</h5>
    <p class="p-text-secondary">提供账号密码强度、账户锁定、登录信息显示的配置</p>
    <div class="p-field-radiobutton">
      <RadioButton id="city1" name="city" value="Chicago"/>
      <label for="city1">高级 至少8位，包含大写字母、小写字母、数字、特殊字符的3种</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city2" name="city" value="Los Angeles"/>
      <label for="city2">中级 至少8位，包含大写字母、小写字母、数字、特殊字符的2种</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city3" name="city" value="New York"/>
      <label for="city3">低级 无密码长度和字符类型限制</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city4" name="city" value="San Francisco"/>
      <label for="city4">自定义 根据需要设置密码强度</label>
    </div>
    <h5 style="font-size: 1.1rem"><span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>账户锁定</h5>
    <p class="p-text-secondary">提供账号登录失败次数和时间阈值的选择</p>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>启用账户锁定功能</label>
        <InputSwitch v-model="checked"/>
      </div>
      <div class="p-field p-grid">
        <label>密码连续错误次数阈值（3-16次）</label>
        <div>
          <Dropdown v-model="num" :options="numberList"
                    :style="{'border-color':submitted&&checked&&( typeof num!='number' ||isNaN(num))?'red':null}"
                    option-label="label" option-value="value"></Dropdown>
          <span v-if="submitted&&checked&& ( typeof num!='number' ||isNaN(num))" class="required">此为必填项!</span>
        </div>
      </div>
      <div class="p-field p-grid">
        <label>账户锁定时间</label>
        <div>
          <Dropdown v-model="time" :options="timeList"
                    :style="{'border-color':submitted&&checked&& ( typeof time!='number' ||isNaN(time))?'red':null}"
                    option-label="label" option-value="value"></Dropdown>
          <span v-if="submitted&& checked && (typeof num!='number' ||isNaN(time))" class="required">此为必填项!</span>
        </div>
      </div>
    </div>
    <h5 style="font-size: 1.1rem"><span class="pi pi-desktop p-mr-3" style="font-size:1.5rem"></span>登录信息显示</h5>
    <p class="p-text-secondary">提供控制台的登录信息是否现实的选择</p>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>显示上次登录信息</label>
        <InputSwitch/>
      </div>
      <div class="p-field p-grid">
        <label>显示最近登录失败信息</label>
        <InputSwitch/>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "account-security",
  data() {
    return {
      submitted: false,
      checked: false,
      num: 3,
      numberList: [
        {label: '3次', value: 3},
        {label: '4次', value: 4},
        {label: '5次', value: 5},
        {label: '6次', value: 6},
        {label: '7次', value: 7},
        {label: '8次', value: 8},
        {label: '9次', value: 9},
        {label: '10次', value: 10},
        {label: '11次', value: 11},
        {label: '12次', value: 12},
        {label: '13次', value: 13},
        {label: '14次', value: 14},
        {label: '15次', value: 15},
        {label: '16次', value: 16},
      ],
      time: false,
      timeList: [
        {label: '5分钟', value: 5},
        {label: '10分钟', value: 10},
        {label: '30分钟', value: 30},
        {label: '1小时', value: 60},
        {label: '3小时', value: 180},
        {label: '24小时', value: 1440},
        {label: '15天', value: 21600},
        {label: '30天', value: 43200},
        {label: '60天', value: 86400},
        {label: '永久', value: -1},
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
      this.num = null
      this.time = null
      this.checked = false
      const deviceList = localStorage.getItem('device') ? JSON.parse(localStorage.getItem('device')) : []
      console.log(deviceList)
      deviceList.forEach(item => {
        if (item.name === 'account_lock') {
          this.checked = JSON.parse(item.value).value !== ''
          let str = JSON.parse(item.value).value
          this.num = parseInt(str.substr(68, 2))
          this.time = parseInt(str.substr(82, str.substr(82).indexOf(' '))) / 60
        }
      })
    },
    save() {
      let selectedNode = JSON.parse(localStorage.getItem('selectedNode'))
      this.submitted = true
      console.log(typeof this.time)
      console.log(typeof this.num)

      if (!this.checked || (this.checked && !isNaN(this.time) && typeof this.time == "number" && !isNaN(this.num) && typeof this.num == "number")) {
        let data = [
          {
            strategyId: selectedNode.id,
            name: 'account_lock',
            value: JSON.stringify({
              value: this.checked ?
                  'sed -i \'s/pam_unix.so nullok_secure /pam_unix.so nullok_secure deny=' + this.num + ' unlock_time=' + this.time * 60 + ' root_unlock_time=' + this.time * 60 + ' /g\' /usr/share/pam-configs/unix'
                  : ''
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

.p-fluid {
  padding-right: 100px;
}

.p-grid {
  margin: 0 0 1rem 0;
}

.p-field {
  align-items: center;
  justify-content: space-between;
}

.p-field > label {
  margin-bottom: 0;
}
</style>
