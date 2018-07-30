<template>
  <main>
    <h1>Login</h1>
    <h4>or
      <a href='/sign-up'>Sign Up here</a>.</h4>
    <form @submit.prevent='login'>
      <input type='text' v-bind='username' placeholder='Username' />
      <input type='password' v-bind='password' placeholder='Password' />
      <button type='submit'>Login Now</button>
    </form>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  methods: {
    login() {
      window
        .fetch(this.authURL, {
          method: 'POST',
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
    },
    ...mapMutations(['updateAuth'])
  },
  computed: {
    ...mapState(['authURL'])
  }
};
</script>

<style scoped>
</style>