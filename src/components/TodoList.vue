<template>
  <ul class='todo-list'>
    <li v-for='(todo, index) in $props.todoList' :key='index'>
      <todo-item :checked='todo.checked' :text='todo.string'></todo-item>
    </li>
  </ul>
</template>

<script>
import TodoItem from "./TodoItem";

export default {
  name: "todo-list",
  components: {
    TodoItem
  },
  props: {
    todoList: Array
  }
};
</script>

<style scoped>
</style>