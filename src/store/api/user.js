import axios from 'axios'
import qs from 'qs'
import Utils from "../../js/Utils";

export default {
	namespaced: true,
	getters: {
	
	},
	actions: {
		login: function (context, params) {
			let {callback, info, posted, valid, formLogin} = params;
			//======处理表单错误==============================================
			if (!valid) {
				info("error", '表单数据有误');
				return;
			}
			//======处理频繁请求==============================================
			if (posted.login) {
				info("warning", "请求过于频繁");
				return;
			}
			posted.login = true;
			setTimeout(() => posted.login = false, 3000);
			//=======处理Data=============================================
			params.onget = data => {
				let {success} = data;
				
				if (success) {
					Utils.setItem("logininfo", {
						login: true
					});
					info("success", "登录成功");
					callback && callback();
					context.dispatch("init");
				} else {
					posted.login = false;
					formLogin.password = "";
					info("error", "登录失败，用户名或密码错误");
				}
			};
			//////////////////////////////////////////////////////
			context.commit("login", params)
		},
		init: function ({commit},{callback}) {
			commit("init",{
				onget:({user}) => {
					callback && callback(user);
					commit("register",["user",user || {}],{root:true});
				}
			})
		},
	},
	mutations: {
		login: function (state, {username, password, onget}) {
			axios.post('/login', qs.stringify({
				username,
				password
			})).then(({data}) => {
				onget(data);
			});
		},
		init: function (state, {onget}) {
			axios.get("/user/login").then(({data}) => {
				onget(data);
			})
		},
	}
	
}