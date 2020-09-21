<template>
  <div>
    <orderListDom :goodStatus="goodStatus" :dataSource='dataSource' :replyMsgStatusParent='replyMsgStatusParent'/>
  </div>
</template>

<script>
  import orderListDom from './evalList'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          replyMsgStatusParent:'1',
          dataSource:'ready-list'
      };
    },
    components: {orderListDom},
    computed: {},
    beforeMount() {},

    mounted() {},

    methods: {},

    watch: {}

  }

</script>
<style lang='' scoped>

</style>