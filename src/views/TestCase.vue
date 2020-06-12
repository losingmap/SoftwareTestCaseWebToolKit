<template>
	<div class="container">
		<Button type="primary" @click="about">关于</Button>
		<Table border :columns="columns" :draggable="false" :data="data" @on-drag-drop="onDragDrop">
			<template slot-scope="{ row }" slot="id">
				<strong>{{ row.id }}</strong>
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button v-if="index===0" type="primary" size="small" @click="add()">添加</Button>
				<Button v-if="index!==0" type="error" size="small" @click="remove(index)">删除</Button>
				<Button type="warning" size="small" @click="toOrigin(index)">模板</Button>
				<Button v-if="index===0" type="error" size="small" @click="deletePlate(index)">清空</Button>
			</template>
		</Table>
		<Button type="primary" @click="ex">导出excel</Button>
		<Button type="primary" @click="copyData">复制JSON数据</Button>
		<Input v-model="pasteData" size="large" placeholder="导入JSON数据" style="width: 120px" @input="paste"/>
		<input type="text" :value="JSON.stringify(data)" ref="dataVal" style="opacity: 0;cursor: default" readonly>
	</div>
</template>
<script>
	import {mapActions, mapGetters} from 'vuex'
	import Utils from "../js/Utils";
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	
	export default {
		data() {
			return {
				prefix: "exp",
				addCol: [{}],
				newData: {},
				columns: [
					{
						title: '操作',
						slot: 'action',
						width: 150,
						align: 'center'
					}
				],
				data: [
					{}
				],
				pasteData: "",
			}
		},
		computed: {
			...mapGetters("col", ["cols"])
		},
		methods: {
			...mapActions("col", ["getCols"]),
			show(index) {
				this.$Modal.info({
					title: 'User Info',
					content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`
				})
			},
			remove(index) {
				this.data.splice(index, 1);
			},
			add: function () {
				this.newData.id = this.data.length;
				this.data.push(JSON.parse(JSON.stringify(this.newData)));
				this.newData = JSON.parse(JSON.stringify(this.data[0]));
			},
			toOrigin: function (index) {
				if (index === 0) {
					this.data.splice(0, 1, JSON.parse(JSON.stringify(this.newData)));
					this.newData = JSON.parse(JSON.stringify(this.newData));
					return;
				}
				this.newData = JSON.parse(JSON.stringify(this.data[index]));
				this.data.splice(0, 1, JSON.parse(JSON.stringify(this.data[index])));
			},
			deletePlate: function () {
				Object.keys(this.data[0]).forEach(key => {
					this.data[0][key] = "";
				})
				this.newData = JSON.parse(JSON.stringify(this.data[0]));
				this.saveData();
			},
			copyData: function () {
				let input = this.$refs['dataVal'];
				input.select();
				document.execCommand("copy");
				this.$Message.success("复制成功");
			},
			paste: function (data) {
				this.pasteData = new String("");
				try {
					let parse = JSON.parse(data);
					// parse.forEach(x => {
					// 	this.data.push(x);
					// })
					for (let i = 0; i < parse.length; i++) {
						if (i === 0) {
							this.data[0] = parse[i];
							continue;
						}
						parse[i].id = this.data.length;
						this.data.push(parse[i]);
					}
					this.$Message.success("解析JSON成功");
				} catch (e) {
					this.$Message.error("JSON数据有误");
				}
			},
			onDragDrop: function (start, end) {
				if (start === 0 || end === 0) {
					this.$Message.error("不要乱放");
					return;
				}
				console.log(start, end);
				let splice = this.data.splice(start, 1)[0];
				this.data.splice(end, 0, splice);
			},
			ex: function () {
				let wopts = {
					bookType: 'xlsx',
					bookSST: true,
					type: 'binary'
				};
				
				let workBook = {
					SheetNames: ['Sheet1'],
					Sheets: {},
					Props: {}
				};
				
				let table = [];
				for (let i = 1; i < this.data.length; i++) {
					let params = {};
					for (const col of this.cols) {
						if (this.data[i][col.key] && this.data[i][col.key].replace) {
							let breakLine = String.fromCharCode(10);
							params[col.title] = this.data[i][col.key].replace(/<br>/g, "").replace(/<div>/g, breakLine).replace(/<\/div>/g, "");
						} else {
							params[col.title] = this.data[i][col.key];
						}
					}
					table[i] = params
				}
				workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(table);
				
				FileSaver.saveAs(new Blob([this.changeData(XLSX.write(workBook, wopts))], {type: 'application/octet-stream'}), "测试用例.xlsx")
			},
			changeData(s) {
				
				//如果存在ArrayBuffer对象(es6) 最好采用该对象
				if (typeof ArrayBuffer !== 'undefined') {
					
					//1、创建一个字节长度为s.length的内存区域
					var buf = new ArrayBuffer(s.length);
					
					//2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
					var view = new Uint8Array(buf);
					
					//3、返回指定位置的字符的Unicode编码
					for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
					return buf;
					
				} else {
					var buf = new Array(s.length);
					for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
					return buf;
				}
			},
			about: function () {
				this.$Modal.info({
					title: "关于",
					content: `项目建设阶段<br>中键设置单一模板<br>按下ctrl可以拖拽移动`
				})
			},
			saveData: function () {
				Utils.setItem("data", this.data);
			},
		},
		watch: {
			cols(newValue, oldValue) {
				newValue.forEach(x => {
					if (this.data[0][x.key] === undefined) {
						this.data[0][x.key] = {};
					}
				})
				this.columns.slice(this.columns.length - 1, 1);
				let val = JSON.parse(JSON.stringify(newValue));
				val.reverse();
				val.forEach(x => {
					x.sortable = true;
					x.render = (h, {row, index}) => {
						if (x.key === 'id') {
							if (index === 0) return "";
							this.data[index].id = index;
							return h("div", this.prefix + row.id);
						}
						
						
						let innerHTML = index === 0 ? this.newData[x.key] : row[x.key];
						return h("div", {
							attrs: {
								contenteditable: true
							},
							domProps: {
								innerHTML
							},
							on: {
								'blur': event => {
									row[x.key] = event.target.innerHTML;
									if (index === 0) {
										this.newData[x.key] = event.target.innerHTML;
									} else {
										this.data[index][x.key] = event.target.innerHTML;
										this.saveData();
									}
								},
								'mousedown': e => {
									if (e.button === 1) {
										// this.data[0][x.key] = this.data[index][x.key];
										this.newData[x.key] = this.data[index][x.key];
									}
								}
							}
						});
					}
					this.addCol[0][x.key] = " ";
					this.columns.unshift(x);
				})
			},
			data(newValue, oldValue) {
				Utils.setItem("data", newValue);
			}
		},
		mounted: function () {
			this.getCols();
			this.data = Utils.getItem("data") || [{}];
			this.data.length <= 0 && (this.data = [{}]);
			this.newData = this.data[0];
			document.querySelectorAll(".ivu-table-row").forEach(x => x.removeAttribute("draggable"));
			document.onkeydown = e => {
				if (e.keyCode === 17) {
					if (e.keyCode === 17) {
						document.querySelectorAll(".ivu-table-row").forEach(x => x.setAttribute("draggable", true));
					}
				}
			}
			document.onkeyup = e => {
				if (e.keyCode === 17) {
					document.querySelectorAll(".ivu-table-row").forEach(x => x.removeAttribute("draggable"));
				}
			}
		}
	}
</script>

<style scoped>
	.container {
		width: 80%;
		margin: auto;
	}
	
	.editor {
		border: 1px solid black;
	}
	
	.ivu-table-wrapper:first-child {
		margin-bottom: 40px;
		margin-top: 80px;
	}
</style>