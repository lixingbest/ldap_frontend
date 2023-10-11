<template>
  <div class="size">
    <h5 id="3">背景桌面</h5>
    <p class="p-title">桌面背景</p>
    <img style="width:200px;" id="desktop_img" src="" alt="">
    <h5 id="4">屏幕保护程序</h5>
    <p class="p-title">屏保</p>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>屏幕保护程序</label>
        <Dropdown disabled v-model="screenSave" :options="screenSaveList" option-label="label"
                  option-value="value"></Dropdown>
      </div>
      <div class="p-field p-grid">
        <label>等待时间</label>
        <div>{{ time }}分钟</div>
      </div>
    </div>
    <h5 id="7">网络保护</h5>
    <p class="p-title">防火墙</p>
    <div>
      <div class="p-d-flex">
        <p class="p-text-secondary">提供网络访问许可策略</p>
        <InputSwitch class="p-ml-3" v-model="firewall"/>
      </div>
    </div>
    <p class="p-title">应用程序联网</p>
    <div class="p-field-radiobutton">
      <RadioButton id="city1" name="type" value="enforcing" v-model="appLine"/>
      <label for="city1">禁止 仅授权的应用程序可以联网</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city2" name="type" value="warning" v-model="appLine"/>
      <label for="city2">询问 检测到未授权的应用程序是提醒我</label>
    </div>
    <div class="p-field-radiobutton">
      <RadioButton id="city3" name="type" value="off" v-model="appLine"/>
      <label for="city3">允许 任何应用程序都可以联网</label>
    </div>
    <h5 id="10">账号安全</h5>
    <p class="p-title">账户锁定</p>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>启用账户锁定功能</label>
        <InputSwitch v-model="accountLock"/>
      </div>
      <div class="p-field p-grid">
        <label>密码连续错误次数阈值（3-16次）</label>
        <div>
          <Dropdown v-model="num" :options="numberList"
                    option-label="label" option-value="value"></Dropdown>
        </div>
      </div>
      <div class="p-field p-grid">
        <label>账户锁定时间</label>
        <div>
          <Dropdown v-model="lockTime" :options="lockTimeList"
                    option-label="label" option-value="value"></Dropdown>
        </div>
      </div>
    </div>
    <h5 id="12">共享桌面</h5>
    <p class="p-title">共享</p>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>允许其他人查看你的桌面</label>
        <InputSwitch disabled v-model="but1"/>
      </div>
      <div class="p-field p-grid">
        <label>允许连接控制屏幕</label>
        <InputSwitch disabled v-model="but2"/>
      </div>
    </div>
    <p class="p-title">安全</p>
    <div class="p-fluid p-mt-3">
      <div class="p-field p-grid">
        <label>您必须为本机机器确认访问</label>
        <InputSwitch disabled v-model="but3"/>
      </div>
    </div>
  </div>

</template>

<script>
const images = require('/src/assets/desktop-images-names.json');
export default {
  name: "preview-content",
  data() {
    return {
      time: null,
      backgroundImage: null,
      but1: false,
      but2: false,
      but3: false,
      screenSave: null,
      screenSaveList: [
        {label: '默认', value: 'default-ukui'},
        {label: '黑屏', value: 'default-ukui-custom'},
      ],
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
      lockTime: false,
      lockTimeList: [
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
      appLine: null,
      firewall: false,
      accountLock: false,
    }
  },
  computed: {
    device_flag() {
      return this.$store.state.device_flag
    },

  },
  watch: {
    device_flag() {
      this.getData()
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let deviceList = localStorage.getItem('device') ? JSON.parse(localStorage.getItem('device')) : []
      deviceList.forEach(item => {
        if (item.name === 'screensaver.idle-delay') {
          this.time = JSON.parse(item.value).value
        } else if (item.name === 'wallpaper.local'&&item.value.includes('name')) {
          this.backgroundImage = JSON.parse(item.value).name
          this.getImage(this.backgroundImage)
        } else if (item.name === 'desktopshare') {
          this.but1 = JSON.parse(item.value).value === 'start'
        } else if (item.name === 'desktopshare.control') {
          this.but2 = !JSON.parse(item.value).value
        } else if (item.name === 'desktopshare.confirm') {
          this.but3 = JSON.parse(item.value).value
        } else if (item.name === 'screensaver.type') {
          this.screenSave = JSON.parse(item.value).name
        } else if (item.name === 'firewall') {
          this.firewall = JSON.parse(item.value).value === 'custom'
        } else if (item.name === 'firewall.software') {
          this.appLine = JSON.parse(item.value).value
        } else if (item.name === 'account_lock') {
          this.accountLock = JSON.parse(item.value).value !== ''
          let str = JSON.parse(item.value).value
          this.num = parseInt(str.substr(68, 2))
          this.lockTime = parseInt(str.substr(82, str.substr(82).indexOf(' '))) / 60
        }else if (item.name === 'wallpaper.web'&&item.value.includes('name')) {
          this.backgroundImage = JSON.parse(item.value).name
          this.getImage(this.backgroundImage)
        }
      })
    },
    getImage(name) {
      const img_node = document.getElementById('desktop_img')
      if (images.includes(name)) {
        img_node.src = require('/src/assets/desktop-image/' + name)
      } else {
        this.$http.get('/strategy/settings/getImage', {
          params: {
            fileName: name
          },
          responseType: "blob"
        }).then(res => {
          let result = []
          result.push(res)
          const url = URL.createObjectURL(new Blob(result))
          img_node.src = url
          img_node.onload = function () {
            URL.revokeObjectURL(url)
          }
        })
      }
    }
  }

}
</script>

<style scoped>
.size {
  /*height: 100%;*/
  padding: 0 1.5rem;
  overflow-y: auto;
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

.p-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.p-field > label {
  margin-bottom: 0;
  width: 300px;
}
</style>
