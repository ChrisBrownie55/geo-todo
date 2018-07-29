<template>
  <main>
    <h1>Login</h1>
    <h2>Choose your form of authentication</h2>
    <button @click='loginGoogle'>Login with Google</button>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  methods: {
    loginGoogle() {
      Vue.googleAuth().signIn(
        googleUser => {
          console.log(googleUser);
          window
            .fetch(this.authURL, {
              method: 'POST',
              body: JSON.stringify({
                token: googleUser.access_token,
                id: googleUser.id_token,
                issuedAt: googleUser.first_issued_at,
                expiresIn: googleUser.expires_in
              })
            })
            .then(response => response.json())
            .then(json => console.log(json));
        },
        error => console.error(error)
      );
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