// main.js
import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router/router.js';
import Vuex from 'vuex';

// export a factory function for creating fresh app, router and store
// instances
export function createApp() {
  Vue.use(Vuex);
  // create store
  const store = new Vuex.Store({
    state: {
      jwt: null,
      todoLists: [],
      authURL: `${process.env.URL || 'http://localhost'}:${process.env.PORT ||
        8080}/auth`,
      authorized: false
    },
    mutations: {
      updateAuth(state, payload) {
        state.authorized = payload.authorized;
        state.username = payload.username || null;
        state.jwt = payload.jwt || null;
        state.todoLists = payload.todoLists || [];
      }
    },
    getters: {
      filteredTodos: state => (index, filter) =>
        state.todoLists[index].filter(filter),
      finishedTodos: (_, getters) => index =>
        getters.filteredTodos(index, todo => todo.finished),
      unfinishedTodos: (_, getters) => index =>
        getters.filteredTodos(index, todo => !todo.finished)
    }
  });

  // create router instance, with access to store.authorized
  const router = createRouter(() => store.authorized);

  const app = new Vue({
    router,
    store,
    // the root instance simply renders the App component.
    render: h => h(App)
  });

  return { app, router };
}
