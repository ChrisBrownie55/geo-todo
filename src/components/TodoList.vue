<template>
  <ul class='todo-list'>
    <li v-for='(todo, index) in $props.todos' :key='index'>
      <todo-item :checked='todo.checked' :text='todo.string'></todo-item>
    </li>
  </ul>
</template>

<script>
import TodoItem from './TodoItem';

export default {
  name: 'todo-list',
  components: {
    TodoItem
  },
  props: {
    todos: Array
  }
};
</script>

<style scoped>
</style>