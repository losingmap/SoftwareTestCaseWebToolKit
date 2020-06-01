<template>
	<div class="container">
		<Table ref="addTable" max-height="800" border :columns="columns" :data="addCol">
			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" @click="add()">添加</Button>
			</template>
		</Table>
		<Table max-height="1000" border :columns="columns" :data="data">
			<template slot-scope="{ row }" slot="id">
				<strong>{{ row.id }}</strong>
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
				<Button type="error" size="small" @click="remove(index)">Delete</Button>
			</template>
		</Table>
	</div>
</template>
<script>
	import {mapActions, mapGetters} from 'vuex'
	
	export default {
		data() {
			return {
				addCol:[
					{}
				],
				columns: [
					{
						title: '操作',
						slot: 'action',
						width: 150,
						align: 'center'
					}
				],
				data: [
					{
						id:"1",
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park'
					},
					{
						name: 'Jim Green',
						age: 24,
						address: 'London No. 1 Lake Park'
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park'
					},
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
				console.log(this.$refs['addTable'].$children[1]);
			},
		},
		watch: {
			cols(newValue, oldValue) {
				this.columns.slice(this.columns.length - 1, 1);
				let val = JSON.parse(JSON.stringify(newValue));
				val.reverse();
				val.forEach(x => {
					x.sortable = true;
					x.render =  (h, { row, index }) => {
						return this.renderTableColumn('edit' + x.key, x.key, h, { row, index })
					}
					this.columns.unshift(x);
				})
			}
		},
		mounted: function () {
			this.getCols();
		},
		updated() {
			document.getElementsByClassName("ivu-table-cell").forEach(x => {
				x.contentEditable = true;
			})
		},
		// 对列的render处理：编辑和未编辑
		renderTableColumn (editName, columnName, h, { row, index }) {
			let edit
			if (this.editTableIndex === index) {
				this[editName] = row[columnName]
				edit = [h('Input', {
					props: {
						value: row[columnName]
					},
					on: {
						input: (val) => {
							this[editName] = val
						}
					}
				})]
			} else {
				edit = row[columnName]
			}
			return h('div', [edit])
		},
	}
</script>

<style scoped>
	.container {
		width: 80%;
		margin: auto;
	}
	
	.editor{
		border: 1px solid black;
	}
	
	.ivu-table-wrapper:first-child {
		margin-bottom: 40px;
		margin-top: 80px;
	}
</style>