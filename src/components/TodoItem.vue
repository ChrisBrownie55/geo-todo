<template>
  <span class='todo-item'>
    <input type='checkbox' :id='id' :checked='$props.checked' />
    <label :for='_uid'></label>
    <p>{{ $props.text }}</p>
  </span>
</template>

<script>
export default {
  name: "todo-item",
  props: {
    checked: Boolean,
    text: String
  },
  mounted() {
    this.id = this._uid;
  }
};
</script>

<style scoped lang='scss'>
.todo-item {
  label {
    width: 1rem;
    height: 1rem;
    border: solid 1px lightgrey;
  }
  input[type="checkbox"] {
    display: none;
    &:checked + label {
      border: solid 1px var(--vue-green);
    }
  }
}
</style>