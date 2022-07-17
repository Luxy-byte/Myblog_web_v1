window.onload = function () {
    var {
        createEditor,
        createToolbar
    } = window.wangEditor;

    var vm = new Vue({
        el: '#app',
        data: {

            token: sessionStorage.getItem('token'),
            username: sessionStorage.getItem('username'),

            bar_data: [{
                value: 0,
                name: '没有相关文章'
            }],
            blog_num: 1,
            
            blog_data: [],
            hot_blog_data: [],

            search_title: '',

            bloglist_url: 'http://127.0.0.1:8000/blog_check/',
            previousPageUrl: null,
            nextPageUrl: null,
            total_page: '',

        },

        methods: {
            search_blog: function () {
                axios.defaults.headers['Authorization'] = 'JWT ' + this.token
                axios.put('http://127.0.0.1:8000/user_blog_filter/', {
                        search_title: this.search_title
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.data.length > 0) {
                            this.blog_data = res.data.data
                        }
                    })
                    .catch(err => {
                        alert('请求失败')

                    })

            },

            previous_page: function () {
                if (this.previousPageUrl != null) {
                    this.get_blog_list(this.previousPageUrl)
                } else {
                    alert('到头了')
                }
            },
            next_page: function () {
                if (this.nextPageUrl != null) {
                    this.get_blog_list(this.nextPageUrl)
                } else {
                    alert('到尾了')
                }
            },

            jump_page: function (num) {

                let jump_url = 'http://127.0.0.1:8000/blog_check/?page_num=' + num;
                this.get_blog_list(jump_url)

            },

            get_blog_list: function (url) {
                let that = this;
                axios.defaults.headers['Authorization'] = 'JWT ' + this.token
                axios.get(url, )
                    .then(function (ret) {
                        // console.log('正在请求');
                        that.blog_data = ret.data.results;
                        that.previousPageUrl = ret.data.previous;
                        that.nextPageUrl = ret.data.next;
                        that.total_page = parseInt(ret.data.count / 10);
                        if ((ret.data.count / 10) % 1 > 0) {
                            that.total_page += 1
                        } else {
                            that.total_page += 0
                        }
                    })
                    .catch(function (ret) {
                        alert('请求博客失败')
                    })
            },

            hot_blog_list: function () {
                let that = this;
                axios.defaults.headers['Authorization'] = 'JWT ' + this.token
                axios.get('http://127.0.0.1:8000/hot_blog_list/', )
                    .then(function (ret) {
                        that.hot_blog_data = ret.data;
                    })
                    .catch(function (ret) {
                        alert('没有热门博客')
                    })
            },

            blog_tmp_display: function (data) {
                window.sessionStorage.setItem('blog_id',data)
                // window.localStorage.setItem('tmp_blog', data);
                window.location.href = './blog_display.html';
            },
            blog_modify: function (blog_title) {
                localStorage.setItem('modify_blog', blog_title)
                window.location.href = './blog_editor.html'
            },

            blog_del: function (blog_id) {
                let that = this
                axios.defaults.headers['Authorization'] = 'JWT ' + this.token
                url = 'http://127.0.0.1:8000/blog_delete/' + String(blog_id) + '/'
                axios.delete(url)
                    .then(function (ret) {
                        console.log(ret.data);
                        if (ret.status == 200) {
                            that.get_blog_list(that.bloglist_url);
                        } else {
                            alert(ret.data.info)
                        }
                    })
                    .catch(function (ret) {
                        alert('请求失败')
                        console.log(ret);
                    })
                // location.reload()
            },
        },

        mounted: function () {
            if (this.username && this.token) {
                this.get_blog_list(this.bloglist_url);
                this.hot_blog_list();
            } else {
                alert('请先登陆')
                window.location.href = './blog_index.html'
            }
        },
    })

    async function init() {
        var res = await axios.get("http://127.0.0.1:8000/blog_type_count/")
        return res.data
    }
    var result = init()
    result.then(res => {

        var myChart = echarts.init(document.getElementById('user_info_display')).setOption({
            title: {
                text: "博客共计：" + res.blog_count + '篇',
                subtext: "Python Note",
                left: "center",
                textStyle: {
                    color: '#F4D03F'
                }
            },
            tooltip: {
                trigger: "item",
            },
            series: [{
                name: "Access From",
                type: "pie",
                radius: "65%",
                // data: vm.bar_data,
                data: res.res,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
                center: ['50%', '60%'],
            }, ],
        });
    })
}