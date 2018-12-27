<template>
  <v-btn color="primary">Hello world</v-btn>
</template>

<script>
export default {
  created () {
    this.$store.commit('SET_TITLE', 'Home')
  }
}
</script>
