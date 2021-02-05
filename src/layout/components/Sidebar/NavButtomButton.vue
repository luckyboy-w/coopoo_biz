<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <!--    不使用动画,代码保留-->
    <!--    <transition-group name="sidebarBottomFade">-->
    <router-link v-if="collapse" key="collapse1" class="sidebar-logo-link" to="/">
      <img :src="ChangePasswd" class="sidebar-logo">
    </router-link>
    <router-link v-else key="expand1" class="sidebar-logo-link" to="/">
      <img :src="ChangePasswd" class="sidebar-logo">
      <span class="sidebar-title">修改密码</span>
    </router-link>
    <router-link v-if="collapse" key="collapse2" class="sidebar-logo-link" to="/">
      <img :src="Logout" class="sidebar-logo">
    </router-link>
    <router-link v-else key="expand2" class="sidebar-logo-link" to="/">
      <img :src="Logout" class="sidebar-logo">
      <span class="sidebar-title">退出登录</span>
    </router-link>
    <!--    </transition-group>-->
  </div>
</template>

<script>
import Logout from '@/assets/logout.png'
import ChangePasswd from '@/assets/changePasswd.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      Logout,
      ChangePasswd
    }
  }
}
</script>

<style lang="scss" scoped>

@import "~@/styles/variables.scss";

.sidebar-logo-container {
  margin-top: 15vh;
  width: 100%;
  height: 10vh;
  padding-left: 20px;
  overflow: hidden;

  & .sidebar-logo-link {
    line-height: 5vh;
    height: 5vh;
    width: 100%;

    & .sidebar-logo {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 16px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: $fontColor;
      font-weight: 500;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}

.sidebarBottomFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarBottomFade-enter,
.sidebarBottomFade-leave-to {
  opacity: 0;
}
</style>
