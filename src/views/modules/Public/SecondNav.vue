<template>
  <div class="secondDir">
    <div v-for="item in list" :key="item.id" @click="toPage(item)" :class="{'thisItem': isNav&&item===page}" class="item">
      <i :class="item.icon"></i>
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SecondNav",
  props: {
    list: Array,
    isNav: Boolean,
  },
  data() {
    return {
      page: {},
      clickTime: 0,
    };
  },
  watch: {
    $route(e) {
      this.list.forEach((item) => {
        if (item.url === e.path) {
          this.page = item;
        }
      });
    },
  },
  mounted() {
    if (this.isNav) {
      // console.log(this.list)
      this.list.forEach((item) => {
        if (item.url === this.$route.path) {
          this.page = item;
        }
      });
    }
  },
  methods: {
    toPage(item) {
      this.clickTime = new Date().getTime();
      this.page = item;
      this.$emit("click", item);
      window["item"] = item;
    },
  },
};
</script>

<style scoped>
.thisItem {
  position: relative;
}

.thisItem:before {
  content: "";
  position: absolute;
  width: 80%;
  height: 2px;
  background-color: #ffffff;
  bottom: 0;
  left: 10%;
}

.secondDir {
  width: 100%;
  position: relative;
  top: -1rem;
  border-radius: 2px;
  box-sizing: border-box;
  display: flex;
  padding-left: 2rem;
  color: #ffffff;
  line-height: 50px;
  margin-bottom: 10px;
  border-bottom: 2px solid rgb(26, 61, 125);
}

.secondDir .item {
  max-height: 100%;
  margin-right: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.secondDir .item i {
  margin-right: 3px;
}

.secondDir .item p {
  width: 100%;
  background-color: transparent;
  font-size: 14px;
  line-height: 50px;
  font-weight: 400;
}
</style>
