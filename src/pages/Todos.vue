<template>
  <main>
    <h1>Todos</h1>
    <details>
      <summary>Unfinished</summary>
      <todo-list :todos='unfinishedTodos' />
    </details>
    <details>
      <summary>Finished</summary>
      <todo-list :todos='finishedTodos' />
    </details>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: mapGetters(["finishedTodos", "unfinishedTodos"])
};
</script>

<style scoped>
</style>