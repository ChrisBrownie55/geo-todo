<template>
  <main>
    <h1>Welcome to the homepage.</h1>
    <todo-list :todoList='todos' />
  </main>
</template>

<script>
import TodoList from "./TodoList.vue";

export default {
  components: {
    TodoList
  },
  data() {
    return {
      todos: [
        { text: "Test", checked: false },
        { text: "Checked test", checked: true }
      ]
    };
  }
};
</script>

<style scoped>
</style>