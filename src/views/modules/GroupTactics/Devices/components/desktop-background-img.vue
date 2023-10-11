<template>
  <div class="p-p-3 view">
    <h5 class="p-d-flex p-jc-between p-ai-center">
      桌面背景
      <Button label="保存" @click="save" icon="pi pi-save"/>
    </h5>
    <img style="width:200px;cursor: default" id="desktop" src="" alt="">
    <div class="p-mt-3">
      <div class="images">
        <p class="p-col-12">系统图片</p>
        <img v-for="item of desktopImages" :key="item" @click="selectImage(item)"
             :style="{border:type===0&&selectedImage===item?'3px solid var(--blue-500)':'none'}"
             :src="require('/src/assets/desktop-image/'+item)"
             alt="">
      </div>

      <div class="p-d-flex p-ai-center p-mt-3 p-flex-wrap">
        <p class="p-col-12">自定义图片</p>
        <div id="userImages" class="p-overlay-badge">
          <div v-for="name of userImages" :key="name" @click="selectImage(name)">
            <img :id="name" style="cursor:default"
                 :style="{border:type===1&&selectedImage===name?'3px solid var(--blue-500)':'none'}"
                 :src="getImgPath(name)" alt="">
            <span class="pi pi-times p-badge" style="padding:0;line-height: 1.5rem;cursor: pointer;"
                  @click="removeImg($event,name)"></span>
          </div>
        </div>
        <div class="uploadImg" @click="uploadFile()">
          <span class="pi pi-upload" style="font-size: 30px"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const images = require("/src/assets/desktop-images-names.json");
export default {
  name: "desktop-background-img",
  data() {
    return {
      desktopImages: images,
      selectedImage: null,
      //0 系统图片 1自定义
      type: 0,
      userImages: null,
    };
  },
  computed: {
    device_flag() {
      return this.$store.state.device_flag;
    },
  },
  watch: {
    device_flag() {
      this.changeDevice();
    },
  },
  mounted() {
    if (this.$route.query.sign) {
      this.$emit("show");
    }
    this.changeDevice();
    this.getUsersImage();
  },
  methods: {
    removeImg(e, name) {
      e.stopPropagation();
      this.$confirm.require({
        message: "确定要删除此壁纸？",
        header: "删除壁纸",
        icon: "pi pi-info-circle",
        acceptLabel: "确定",
        rejectLabel: "取消",
        accept: () => {
          this.$http
              .get("/strategy/settings/removeImage", {
                params: {
                  fileName: name,
                },
              })
              .then(() => {
                this.$toast.add({
                  severity: "info",
                  summary: "删除成功！",
                  life: 3000,
                });
                this.getUsersImage();
              });
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    getUsersImage() {
      this.$http.get("/strategy/settings/getAllImages").then((res) => {
        this.userImages = res.data;
      });
    },
    changeDevice() {
      this.selectedImage = null;
      document.getElementById("desktop").src = null;
      const deviceList = localStorage.getItem("device")
          ? JSON.parse(localStorage.getItem("device"))
          : [];
      deviceList.forEach((item) => {
        if (item.name === "wallpaper.local" || item.name === "wallpaper.web") {
          let img;
          try {
            img = JSON.parse(item.value).name;
          } catch (e) {
            console.log(item.value + "不是JSON格式");
          }
          this.selectedImage = img;
          if (img) {
            if (images.includes(img)) {
              this.type = 0;
              document.getElementById(
                  "desktop"
              ).src = require("/src/assets/desktop-image/" + img);
            } else {
              this.type = 1;
              const imgNode = document.getElementById("desktop");
              this.getImage(imgNode, img);
            }
          }
        }
      });
    },
    getImgPath(name) {
      const baseURL = this.$http.defaults.baseURL;
      return baseURL + '/strategy/settings/getImage?fileName=' + name;
    },
    getImage(node, name) {
      this.$http
          .get("/strategy/settings/getImage", {
            params: {
              fileName: name,
            },
            responseType: "blob",
          })
          .then((res) => {
            let result = [];
            result.push(res);
            const url = URL.createObjectURL(new Blob(result));
            if (node) {
              node.src = url;
              node.onload = function () {
                URL.revokeObjectURL(url);
              };
            } else {
              const imgNode = document.getElementById(name);
              imgNode.src = url;
              imgNode.onload = function () {
                URL.revokeObjectURL(url);
              };
            }
          });
    },
    uploadFile() {
      let node = document.createElement("input");
      node.type = "file";
      const _this = this;
      node.onchange = function () {
        let file = this.files[0];
        const url = window.URL.createObjectURL(file);
        _this.type = 1;
        document.getElementById("desktop").src = url;
        document.getElementById("desktop").onload = function () {
          window.URL.revokeObjectURL(url);
        };
        let param = new FormData();
        param.append("file", file);
        let config = {
          headers: {"Content-Type": "multipart/form-data"},
        };
        _this.$http
            .post("/strategy/settings/upload", param, config)
            .then((res) => {
              _this.selectedImage = res.data;
              _this.getUsersImage();
            });
      };
      node.click();
    },
    selectImage(item) {
      this.selectedImage = item;
      if (this.userImages.length > 0 && this.userImages.includes(item)) {
        this.type = 1;
        document.getElementById("desktop").src = this.getImgPath(item)
        //this.getImage(document.getElementById("desktop"), item);
      } else {
        this.type = 0;
        document.getElementById(
            "desktop"
        ).src = require("/src/assets/desktop-image/" + item);
      }
    },

    save() {
      let selectedNode = JSON.parse(localStorage.getItem("selectedNode"));
      let data;
      if (this.type === 0) {
        data = [
          {
            strategyId: selectedNode.id,
            name: "wallpaper.local",
            value: JSON.stringify({name: this.selectedImage}),
          },
        ];
      } else {
        let url = "/strategy/settings/getImage?fileName=" + this.selectedImage;
        data = [
          {
            strategyId: selectedNode.id,
            name: "wallpaper.web",
            value: JSON.stringify({url: url, name: this.selectedImage}),
          },
        ];
      }
      let img = JSON.parse(data[0].value).name;
      if (selectedNode.type === "strategy") {
        this.$http.post("/strategy/settings/saveValues", data).then(() => {
          let data = JSON.parse(localStorage.getItem("device"));
          if (data.length == 0) {
            this.$http
                .get("/strategy/settings/getValues", {
                  params: {
                    strategyId: selectedNode.id,
                  },
                })
                .then((res) => {
                  localStorage.setItem("device", JSON.stringify(res.data));
                  this.save();
                });
          } else {
            data.forEach((item) => {
              if (
                  item.name == "wallpaper.local" ||
                  item.name == "wallpaper.web"
              ) {
                item.value = null;
                let imgName = {name: img};
                item.value = JSON.stringify(imgName);
              }
            });
            localStorage.setItem("device", JSON.stringify(data));
            this.$toast.add({
              severity: "info",
              summary: "保存成功！",
              life: 3000,
            });
            this.changeDevice();
          }
        });
      } else {
        this.$store.commit("changeDeviceSaveFlag");
        this.$toast.add({
          severity: "info",
          summary: "请选择策略！",
          life: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.view {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}

.images {
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.images > img {
  width: 100px;
  margin: 0 1rem 1rem 0;
  border-radius: 4px;
}

h5 {
  font-weight: 600;
}

.uploadImg {
  width: 100px;
  height: 66.67px;
  border: 1px dashed var(--text-color-secondary);
  overflow: hidden;
  margin: 0 1rem 1rem 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.colors {
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.colors > div,
.selectColor {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin: 0 1rem 1rem 0;
}

::v-deep(.p-colorpicker-preview.p-inputtext) {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: none;
}

#userImages {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

#userImages div {
  width: 100px;
  margin: 0 1rem 1rem 0;
  position: relative;
}

#userImages img {
  width: 100%;
  border-radius: 4px;
}

img {
  cursor: pointer;
}
</style>
