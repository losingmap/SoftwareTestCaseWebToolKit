import Vue from 'vue'
import Vuex from 'vuex'
import user from './api/user'
import col from './api/col'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user:{}
	},
	getters: {
		user: state => {
			return state.user;
		}
	},
	actions: {},
	mutations: {
		register: function (state,[key,value]) {
			state[key] = value;
		},
	},
	modules: {
		user,col
	}
})
