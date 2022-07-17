window.onload = function () {
    var vm = new Vue({
        el: "#app",
        data: {

            baseURL: 'http://127.0.0.1:8000/',

            token: sessionStorage.getItem('token'),

            blog_list: [],
            page: 1,

            search_info: '',
            search_page: 1,

            sort_status: false,
            check_type: '',
            sort_page: 1,

            // 统计信息
            user_num: 0,
            blog_num: 0,
            framwork_num: 0,
            rank_list: []
        },
        methods: {

            display_blog:function(id){
                window.sessionStorage.setItem('blog_id',id)
                location.href = './blog_display.html'
            },

            get_statistic: function () {
                axios.get('blog_center_statistic/')
                    .then((ret) => {
                        let info = ret.data.data;
                        this.user_num = info.user_num;
                        this.blog_num = info.blog_num;
                        this.framwork_num = info.blog_type_num;
                        this.rank_list = info.rank_list
                    })
                    .catch((err) => {
                        console.log('读取信息失败');
                    })
            },

            // ----- 博客列表相关操作
            // 获取文档高度
            getScrollTop() {
                var scrollTop = 0,
                    bodyScrollTop = 0,
                    documentScrollTop = 0;
                if (document.body) {
                    bodyScrollTop = document.body.scrollTop;
                }
                if (document.documentElement) {
                    documentScrollTop = document.documentElement.scrollTop;
                }
                scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop :
                    documentScrollTop;
                return scrollTop;
            },
            // 可视窗口高度
            getWindowHeight() {
                var windowHeight = 0;
                if (document.compatMode == "CSS1Compat") {
                    windowHeight = document.documentElement.clientHeight;
                } else {
                    windowHeight = document.body.clientHeight;
                }
                return windowHeight;
            },
            // 滚动条高度
            getScrollHeight() {
                var scrollHeight = 0,
                    bodyScrollHeight = 0,
                    documentScrollHeight = 0;
                if (document.body) {
                    bodyScrollHeight = document.body.scrollHeight;
                }
                if (document.documentElement) {
                    documentScrollHeight = document.documentElement.scrollHeight;
                }
                scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight :
                    documentScrollHeight;
                return scrollHeight;
            },

            // 判断滚动条是否到底
            scrollFn() {
                const scrollHeight = this.getScrollTop() + this.getWindowHeight()
                const alreadyHeight = this.getScrollHeight()
                if (parseInt(scrollHeight) === alreadyHeight) {
                    // this.get_blog_list()

                    if (this.sort_status) {

                        this.check_sort_list(this.check_type)

                    } else if (this.search_info.length > 0) {

                        this.get_search_list()

                    } else {

                        this.get_blog_list()
                    }
                }
            },

            get_blog_list: function () {
                if (this.page <= 1) {
                    axios.get('all_blog_list/', {
                            params: {
                                page_num: this.page
                            }
                        })
                        .then((ret) => {
                            this.blog_list = []
                            this.blog_list = ret.data.results
                            this.page += 1
                        })
                        .catch((err) => {
                            location.reload()
                        })

                } else {
                    axios.get('all_blog_list/', {
                            params: {
                                page_num: this.page
                            }
                        })
                        .then((ret) => {
                            this.blog_list.push(...ret.data.results);
                            this.page += 1
                        })
                        .catch((err) => {
                            alert('到底啦！')
                        })
                }
            },
            get_search_list: function () {
                if (this.search_page <= 1) {
                    axios.put('all_blog_list/?page_num=' + this
                            .search_page, {
                                search_info: this.search_info
                            })
                        .then((ret) => {
                            this.blog_list = []
                            this.blog_list = ret.data.results
                            this.search_page += 1
                        })

                } else {
                    axios.put('all_blog_list/?page_num=' + this
                            .search_page, {
                                search_info: this.search_info
                            })
                        .then((ret) => {
                            this.blog_list.push(...ret.data.results);
                            this.search_page += 1
                        })
                        .catch((err) => {
                            alert('到底啦！')
                        })
                }
                this.search_info = '';
            },
            // 搜索查找
            search_title: function () {
                window.scrollTo(0, 510)
                this.sort_status = false
                this.page = 1
                this.search_page = 1
                this.sort_page = 1
                this.blog_list = []
                if (this.search_info.length > 0) {
                    this.get_search_list()
                } else {
                    this.get_blog_list()
                }
            },

            // 分类查找
            check_sort_list: function (tmp_type) {
                // window.scrollTo(0, 510)
                this.sort_status = true
                if (this.check_type != tmp_type) {
                    this.sort_page = 1
                }
                this.check_type = tmp_type
                if (this.sort_page <= 1) {
                    axios.post('all_blog_list/?page_num=' + this
                            .sort_page, {
                                check_sort: this.check_type
                            })
                        .then((ret) => {
                            this.blog_list = []
                            this.blog_list = ret.data.results
                            this.sort_page += 1
                        })
                } else {
                    axios.post('all_blog_list/?page_num=' + this
                            .sort_page, {
                                check_sort: this.check_type
                            })
                        .then((ret) => {
                            this.blog_list.push(...ret.data.results)
                            this.sort_page += 1
                        })
                        .catch((err) => {
                            alert('到底啦！')
                        })
                }
            },
            contact_us: function () {
                alert('管理员微信:LuxyLuxy6661')
            }
        },
        mounted: function () {
            axios.defaults.baseURL = this.baseURL;
            this.get_blog_list()
            window.addEventListener("scroll", this.scrollFn);
            this.get_statistic()


        },
        // 销毁监听
        destroyed() {
            window.removeEventListener('scroll', this.scrollFn);

        }
    })
    var nav_btns = document.querySelectorAll('.nav-link')
    nav_btns.forEach((value) => {
        value.addEventListener('click', function () {
            for (var i = 0; i < nav_btns.length; i++) {
                nav_btns[i].classList.remove('active')
            }
            value.classList.add('active')
        })
    })
    $(function(){
        $('#myCarousel').carousel({
            interval:4000
        });
    });

}