<template>
  <div class="view">
    <h5>锁屏</h5>
    <img style="width:200px;" :src="require('../../../../../assets/images/登录.png')" alt="">
    <div class="p-fluid p-mt-3">
      <h5>锁屏设置</h5>
      <div class="p-field p-grid">
        <label>显示锁屏壁纸在登录页面</label>
        <InputSwitch v-model="checked"/>
      </div>
      <div class="p-field p-grid">
        <label>激活屏保是锁定屏幕</label>
        <InputSwitch v-model="checked"/>
      </div>
    </div>
    <div>
      <h5>选择锁屏壁纸</h5>
      <div class="images">
        <img v-for="item of 10" :key="item" :src="require('../../../../../assets/images/登录.png')" alt="">
      </div>
      <div class="p-d-flex p-ai-center">
        <label class="p-mr-3">自定义图片</label>
        <div class="uploadImg" @click="uploadFile()">
          <span class="pi pi-upload" style="font-size: 30px;"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "lock-screen",
  data() {
    return {
      checked: false
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

.images {
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.images > img {
  width: 100px;
  margin: 0 1rem 1rem 0;
}

.uploadImg {
  width: 200px;
  height: 106px;
  border: 1px dashed var(--text-color-secondary);
  overflow: hidden;
  margin: 0 1rem 1rem 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
