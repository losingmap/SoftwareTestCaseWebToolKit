<template>
	<div class="container">
		<Table max-height="1000" border :columns="columns" :data="data">
			<template slot-scope="{ row }" slot="id">
				<strong>{{ row.id }}</strong>
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button v-if="index===0" type="primary" size="small" @click="add()">添加</Button>
				<Button v-if="index!==0" type="error" size="small" @click="remove(index)">删除</Button>
				<Button type="warning" size="small" @click="toOrigin(index)">模板</Button>
			</template>
		</Table>
		<Button type="primary" @click="ex">导出excel</Button>
		<Button type="primary" @click="ex">复制JSON数据</Button>
		<Button type="primary" @click="ex">导入JSON数据</Button>
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
				]
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
				this.data.push(this.newData);
				this.newData = JSON.parse(JSON.stringify(this.newData));
			},
			toOrigin: function (index) {
				this.newData = JSON.parse(JSON.stringify(this.data[index]));
				this.data.splice(0,1,JSON.parse(JSON.stringify(this.data[index])));
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
						if (this.data[i][col.key].replace) {
							params[col.title] = this.data[i][col.key].
							replace(/<br>/g, "\n").replace(/<div>/g, "\n").replace(/<\/div>/g, "\n");
						}else{
							params[col.title] = this.data[i][col.key];
						}
					}
					table[i] = params
				}
				workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(table);
				console.log(table);
				
				FileSaver.saveAs(new Blob([this.changeData(XLSX.write(workBook, wopts))], {type: 'application/octet-stream'}), "sheetjs.xlsx")
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
			}
		},
		watch: {
			cols(newValue, oldValue) {
				this.columns.slice(this.columns.length - 1, 1);
				let val = JSON.parse(JSON.stringify(newValue));
				val.reverse();
				val.forEach(x => {
					x.sortable = true;
					x.render = (h, {row, index}) => {
						if (x.key === 'id') {
							if (index === 0) return "";
							return h("div", this.prefix + row.id);
						}
						
						return h("div", {
							attrs: {
								contenteditable: true
							},
							domProps: {
								innerHTML: row[x.key]
							},
							on: {
								'blur': event => {
									row[x.key] = event.target.innerHTML;
									if (index === 0) {
										this.newData[x.key] = event.target.innerHTML;
									} else {
										this.data[index][x.key] = event.target.innerHTML;
									}
								},
								'mousedown': e => {
									if (e.button === 1) {
										this.data[0][x.key] = this.data[index][x.key];
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