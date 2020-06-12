<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	import {mapActions} from 'vuex'
	
	export default {
		methods: {
			...mapActions('user', ['init'])
		},
		created() {
			this.init({
				callback: user => {
					this.$router.push("/");
					if (!user || !user.username || user === "anonymousUser" || this.$route.path != "/") {
						this.$router.push("/");
					} else if (user !== "anonymousUser") {
						this.$router.push("/testcase");
					}
				}
			})
		}
	}
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
	}
	
	#nav {
		padding: 30px;
	}
	
	#nav a {
		font-weight: bold;
		color: #2c3e50;
	}
	
	#nav a.router-link-exact-active {
		color: #42b983;
	}
</style>
