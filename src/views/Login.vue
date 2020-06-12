<template>
	<div class="login">
		<Row type="flex" justify="center">
			<Col :xs="24" :sm="12" :md="8">
				<h1 style="text-align: center;padding: 20px">登录</h1>
				<Form
						ref="formLogin"
						:model="formLogin"
						:rules="ruleLogin"
						label-position="left"
						:label-width="100"
				>
					<FormItem prop="user" label="用户名">
						<Input type="text" v-model="formLogin.username" placeholder="用户名" size="large">
							<Icon type="ios-person-outline" slot="prefix"/>
						</Input>
					</FormItem>
					<FormItem prop="password" label="密码">
						<Input
								type="password"
								v-model="formLogin.password"
								password
								placeholder="密码"
								size="large"
						>
							<Icon type="ios-lock-outline" slot="prefix"/>
						</Input>
					</FormItem>
					<FormItem style="text-align: justify">
						<checkbox v-model="checked" style="color:#a0a0a0;">记住密码</checkbox>
						<span
								class="lf"
								@click="clearCookie"
								style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;"
						>忘记密码？</span>
					</FormItem>
					<FormItem>
						<Button type="primary" v-on:keyup.enter="tryLogin(formLogin)" :class="{'grey':posted.login}"
						        @click="tryLogin(formLogin)">登录
						</Button>
						<Button @click="customMode">访客登录</Button>
					</FormItem>
				</Form>
			</Col>
		</Row>
	</div>
</template>

<script>
	import {mapActions} from 'vuex'
	import router from "../router/router";
	
	export default {
		data() {
			return {
				checked: false,
				posted: {
					login: false
				},
				formLogin: {
					username: "",
					password: ""
				},
				ruleLogin: {
					username: [
						{required: true, message: "账号不能为空", trigger: "blur"},
						{min: 3, max: 16, message: "账号长度3-16个字符", trigger: "blur"}
					],
					password: [
						{required: true, message: "密码不能为空", trigger: "blur"},
						{
							type: "string",
							min: 3,
							max: 16,
							message: "密码长度3-16个字符",
							trigger: "blur"
						}
					]
				}
			};
		},
		methods: {
			...mapActions("user", ["login"]),
			tryLogin(formLogin, custom = false) {
				console.log(formLogin)
				this.$refs["formLogin"].validate(valid => {
					let {username, password} = formLogin;
					this.login({
						username, password, formLogin,
						callback: () => {
							router.push("/testcase");
						},
						info: (type, msg) => this.$Message[type](msg),
						valid: valid || custom,
						posted: this.posted
					})
				});
			},
			clearCookie() {
			
			},
			customMode() {
				this.tryLogin({
					username: "test",
					password: "123"
				}, true);
			}
		}
	};
</script>
