import axios from 'axios'
import qs from 'qs'
import Utils from "../../js/Utils";

export default {
	namespaced: true,
	state:{
		cols:{}
	},
	getters: {
		cols: function (state) {
			return state.cols;
		},
	},
	actions: {
		getCols: function ({commit},params) {
			params = params || {}
			params.onget = ({cols}) => {
			
			};
			commit("getCols",params);
		},
	},
	mutations: {
		getCols: function (state, {onget}) {
			axios.get("/col").then(({data}) => {
				state.cols = data.cols;
			})
		},
	}
	
}