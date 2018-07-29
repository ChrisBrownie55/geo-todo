<template>
  <div id='app'>
    <img src='./assets/logo.png' />
    <router-link to='/'>Home</router-link>
    <button v-if='authenticated'>Logout</button>
    <router-link v-else to='/login'>Login</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'app',
  computed: mapState(['authenticated'])
};
</script>

<style lang='scss'>
:root {
  --vue-green: #42b983;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
