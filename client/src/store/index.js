import Vue from 'vue'
import Vuex from 'vuex'
import request from '../libs/request'
import {district} from '../api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    districts: []
  },
  mutations: {

  },
  actions: {
    async getDisticts({state}) {
      let res = await district()
      state.districts = res
    }
  }
})

export default store