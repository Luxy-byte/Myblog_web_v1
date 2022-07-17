window.onload = function () {

    Vue.config.Devtools = true;

    var vm = new Vue({

        el: '#app',

        data: {
            token: sessionStorage.getItem('token'),
            username: sessionStorage.getItem('username'),
            user_info_data: '',

            user_update_data: {},

            alertMessage: '',
            alertshow: false,

            real_name: '',
            user_email: '',
            user_phone: '',
            user_wx: '',
            tmp_remark: '',
        },
        methods: {

            // 提交信息
            submit_info: function () {
                if (this.comparisonData(this.user_info_data, this.user_update_data)) {
                    alert('请勿提交无效信息')
                } else {

                    axios.defaults.headers['Authorization'] = 'JWT ' + this.token
                    axios.put('http://127.0.0.1:8000/user_info_update/' + this.username, this
                            .user_update_data)
                        .then((res) => {

                            console.log(res.status);

                            if(res.status == 200){

                                alert('正在认证 请等待')

                                location.reload();

                            }else{

                                alert('后台审核失败，请严格填写')

                                location.reload();
                            }

                        })
                        .catch((res) => {

                            alert('提交失败，请严格填写信息');

                        })
                }
            },

            comparisonData: function isObjectChanged(source, comparison) {
                const _source = JSON.stringify(source)
                const _comparison = JSON.stringify({
                    ...source,
                    ...comparison
                })
                return _source === _comparison
            },

            // 显示提示框
            check_status: function (res) {
                if (res == null) {
                    this.alertMessage = '请输入有效信息';
                    this.alertshow = true;
                    return false
                } else {
                    this.alertshow = false;
                    return true;
                }
            },

            //对象拷贝
            objCopy: function (newobj, oldobj) {
                for (var k in oldobj) {
                    var item = oldobj[k];
                    if (item instanceof Array) { // 数组也属于对象， 所以要先判断数组
                        newobj[k] = []
                        deep(newobj[k], item)
                    } else if (item instanceof Object) {
                        newobj[k] = {}
                        deep(newobj[k], item)
                    } else {
                        newobj[k] = item;
                    }
                }
            },

        },
        watch: {

            // 检查用户名
            real_name: function (val) {

                res = val.match(/^[\u4e00-\u9fa5]{2,5}$/);

                if (this.check_status(res)) {

                    this.user_update_data.real_name = val;

                } else {

                    this.real_name = this.user_info_data.real_name

                    this.user_update_data.real_name = ''
                }

            },

            // 检查邮箱
            user_email: function (val) {

                res = val.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+$/)

                if (this.check_status(res)) {

                    this.user_update_data.email = val;

                } else {

                    this.user_email = this.user_info_data.email

                    this.user_update_data.email = ''
                }

            },

            // 检查手机号
            user_phone: function (val) {

                res = val.match(
                    /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
                );

                if (this.check_status(res)) {

                    this.user_update_data.phone = val;

                } else {

                    this.user_phone = this.user_info_data.phone

                    this.user_update_data.phone = ''
                }
            },

            // 检查微信号
            user_wx: function (val) {

                res = val.match(/^[a-zA-Z0-9_-]+$/)

                if (this.check_status(res)) {

                    this.user_update_data.wx_num = val;

                } else {

                    this.user_wx = this.user_info_data.wx_num

                    this.user_update_data.wx_num = ''

                }

            },

            tmp_remark: function (val) {

                res = val

                if (this.check_status(res)) {

                    this.user_update_data.user_remark = res;

                } else {

                    this.tmp_remark = this.user_info_data.wx_num
                    this.user_update_data.user_remark = ''
                }
            }

        },
        mounted: function () {
            if (this.token) {
                axios.defaults.headers['Authorization'] = 'JWT ' + this.token
                axios.get('http://127.0.0.1:8000/user_info_update/' + this.username)
                    .then((ret) => {

                        this.user_info_data = ret.data;
                        this.objCopy(this.user_update_data, this.user_info_data);

                    })
                    .catch((ret) => {
                        alert('加载个人信息失败')
                    })
            } else {
                alert('请先登陆')
                window.location.href = './blog_index.html'
            }
        },

    });
}