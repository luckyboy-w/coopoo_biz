<template>
  <div class="sidebar-logo-container">
    <img v-if="logo" :src="logo" class="sidebar-logo">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'

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
      title: '蓝思羽',
      logo: logo
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  width: 100%;
  height: 30vh;
  font-size: 15px;
  //background: #2b2f3a;
  background: #FFFFFF;
  text-align: center;
  //overflow: hidden;
  color: #414141;

  .sidebar-logo {
    width: 12vh;
    height: 12vh;
    vertical-align: middle;
  }
}
</style>
