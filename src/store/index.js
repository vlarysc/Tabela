import { store } from 'quasar/wrappers';
import Vue from 'vue';
import Vuex from 'vuex';

import * as pessoas from './modules/pessoa.store';

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

//export default function(/* { ssrContext } */) {
const Store = new Vuex.Store({
  modules: {
    pessoas
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
});

export default Store;
//}
