<template>
  <main>
    <h1>Login</h1>
    <h2>Choose your form of authentication</h2>
    <button @click='loginGoogle'>Login with Google</button>
  </main>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  methods: {
    loginGoogle() {
      window.fetch(this.authURL, {
        method: "POST"
        // body:
      });
    },
    ...mapMutations(["updateAuth"])
  },
  computed: {
    ...mapState(["authURL"])
  }
};
</script>

<style scoped>
</style>