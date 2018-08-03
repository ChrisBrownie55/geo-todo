<template>
  <main>
    <h1>Todos</h1>
    <h3 v-if='!unfinishedTodos && !finishedTodos'>You have nothing Todo.</h3>
    <details v-if='unfinishedTodos'>
      <summary>Unfinished</summary>
      <todo-list :todos='unfinishedTodos' />
    </details>
    <details v-if='finishedTodos'>
      <summary>Finished</summary>
      <todo-list :todos='finishedTodos' />
    </details>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters(['finishedTodos', 'unfinishedTodos'])
};
</script>

<style scoped>
</style>