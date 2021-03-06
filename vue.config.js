module.exports = {
	devServer: {
		port: 80,
		proxy: {
			"/api": {
				target: "http://localhost:8081",
				changeOrign: true,
				pathRewrite : {
					'^/api' : '/'
				}
			}
		}
	}
}