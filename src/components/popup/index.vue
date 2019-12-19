<template>
  <transition name="fade">
    <div class="popup" @click.stop="hide" v-show="isShow">
      <div class="popup-inner">
        <h3 class="popup-title">{{title}}</h3>
        <div class="popup-button-group">
          <span class="popup-confirm-button" @click.stop="confirm">{{confirmText}}</span>
          <span class="popup-cancel-button" @click.stop="cancel">{{cancelText}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "Popup",
  props: {
    title: {
      type: String,
      default: "确认删除吗？"
    },
    confirmText: {
      type: String,
      default: "确认"
    },
    cancelText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
    hide() {
      this.isShow = false;
    },
    show() {
      this.isShow = true;
    }
  }
};
</script>
<style lang='scss' scoped>
.popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  &-inner {
    margin: auto;
    position: relative;
    z-index: 1;
    background-color: #fff;
    padding: 20px;
    width: 50%;
    border-radius: 5px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-content: center;
  }
  &-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
  }
  &-button-group {
    user-select: none;
    display: flex;
    cursor: pointer;
  }
  &-confirm-button {
    flex: 1;
  }
  &-cancel-button {
    flex: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>