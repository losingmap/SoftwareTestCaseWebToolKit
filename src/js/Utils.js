export default {
    //存储数据 key value
    setItem(key, value){
        window.localStorage.setItem(key, JSON.stringify(value));
    },

    //读取数据 key
    getItem(key){
        return JSON.parse(window.localStorage.getItem(key) || '[]')
    }
}