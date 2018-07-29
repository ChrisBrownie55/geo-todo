import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";

Vue.use(Router);

export function createRouter(isAuthorized) {
  const router = new Router({
    mode: "history",
    routes: [
      { path: "/", component: Home },
      { path: "/login", component: Login }
    ]
  });
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (isAuthorized()) {
        next({
          path: "/login",
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    } else {
      next(); // make sure to always call next()!
    }
  });
}
