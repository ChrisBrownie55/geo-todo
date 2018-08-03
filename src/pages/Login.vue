<template>
  <main>
    <h1>Login / Sign Up</h1>
    <form @submit.prevent>
      <input type='text' v-model='username' placeholder='Username' :disabled='isDisabled' />
      <input type='password' v-model='password' placeholder='Password' :disabled='isDisabled' />
      <button type='submit' @click='login' :disabled='isDisabled'>Login Now</button>
      <button type='submit' @click='register' :disabled='isDisabled'>Sign Up</button>
    </form>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      isDisabled: false
    };
  },
  methods: {
    updateAuthWithJSON(json) {
      this.updateAuth({
        authenticated: true,
        token: json.token,
        username: this.username,
        password: this.password,
        todoLists: json.todoLists
      });
      this.$router.push('todos');
    },
    login() {
      window
        .fetch(`${this.authURL}/login`, this.authOptions)
        .then(response => response.json())
        .then(this.updateAuthWithJSON)
        .catch(err => console.error(err));
    },
    register() {
      window
        .fetch(`${this.authURL}/register`, this.authOptions)
        .then(response => response.json())
        .then(this.updateAuthWithJSON)
        .catch(err => console.error(err));
    },
    ...mapMutations(['updateAuth'])
  },
  computed: {
    ...mapState(['authURL']),
    authOptions: function() {
      return {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      };
    }
  }
};
</script>

<style scoped>
</style>