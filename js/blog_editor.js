window.onload = function () {

    var vm = new Vue({
        el: '#app',

        data: {

            regulations: false,
            regular_submit: true,

            token: sessionStorage.getItem('token'),
            username: sessionStorage.getItem('username'),

            current_upload_pic: new Array(),
            final_upload_img: new Array(),

            editorConfig: {

                MENU_CONF: {},
                placeholder: '请输入博客正文内容',

            },
            toolbarConfig: {
                excludeKeys: [
                    // "blockquote",
                    // "|",
                    "group-video",
                    // "insertTable",
                    "todo",
                    "fullScreen",
                    // "undo",
                    // "redo",
                    "emotion"
                ]
            },

            uploadImageConfig: {

                server: 'http://127.0.0.1:8000/image_upload/',

                fieldName: 'image_upload',

                maxNumberOfFiles: 10,

                maxFileSize: 1 * 1024 * 1024,

                allowedFileTypes: [],

                timeout: 10 * 1000,

                base64LimitSize: 5 * 1024, // 5kb

                // 上传之前触发
                onBeforeUpload(file) {
                    // file 选中的文件，格式如 { key: file }
                    // console.log(file);
                    return file
                },

                // 上传进度的回调函数
                onProgress(progress) {
                    // progress 是 0-100 的数字
                    // console.log('progress', progress)
                },
                // 单个文件上传成功之后
                onSuccess(file, res) {
                    alert('上传成功')
                    // console.log(`${file.name} 上传成功`, res)
                },

                // 单个文件上传失败
                onFailed(file, res) {
                    alert('图片大小不得超过1M,仅接受png,jpg,jpeg格式图片')
                    // console.log(`${file.name} 上传失败`, res)
                },
                // 上传错误，或者触发 timeout 超时
                onError(file, err, res) {
                    alert('服务器错误')
                    // console.log(`${file.name} 上传出错`, err, res)
                },

            },

            blog_contentStr: '',
            blog_html: '',
            blog_title: '',
            blog_type: '',

            after_submit: false,
            submit_blog_title: '',
            submit_blog_user: '',
            submit_blog_date: '',
            submit_blog_type: 0,

            update_blog_id: 0,

            loading_status:false,

        },

        methods: {

            submit_article: function () {

                // this.update_article() ? this.update_blog_id > 0 : this.update_blog_id = 0
                axios.defaults.headers['Authorization'] = 'JWT ' + this.token

                var imageDelData = this.check_del_image()
                // console.log(imageDelData);
                // console.log(this.blog_title);
                // console.log(this.blog_contentStr);
                // console.log(this.blog_html);

                if (this.update_blog_id > 0) {

                    // this.update_article()
                    axios.put('http://127.0.0.1:8000/blog_upload/', {

                            del_image: Array.from(imageDelData),
                            nickname: this.username,
                            id: this.update_blog_id,
                            blog_title: this.blog_title,
                            blog_json_version: this.blog_contentStr,
                            blog_html_version: this.blog_html,
                            blog_type: this.submit_blog_type

                        })
                        .then((ret) => {
                            // 请求成功发起
                            console.log('正在更新....');
                            if (String(ret.status).substring(0, 2) == '20') {

                                this.after_submit = true;
                                this.submit_blog_title = ret.data.blog_title;
                                this.submit_blog_user = ret.data.nickname;
                                this.submit_blog_date = ret.data.submit_date;
                                window.sessionStorage.setItem('blog_id',ret.data.id)

                            } else {
                                alert('更新失败，请联系站长')
                            }
                        })
                        .catch((ret) => {
                            // 请求没有发起
                            alert('请求失败，请联系站点管理员')

                        })
                } else {
                    axios.post('http://127.0.0.1:8000/blog_upload/', {

                            del_image: Array.from(imageDelData),
                            nickname: this.username,
                            blog_title: this.blog_title,
                            blog_json_version: this.blog_contentStr,
                            blog_html_version: this.blog_html,
                            blog_type: this.submit_blog_type

                        })
                        .then((ret) => {
                            // 请求成功发起
                            console.log('正在提交....');
                            if (String(ret.status).substring(0, 2) == '20') {

                                this.after_submit = true;
                                this.submit_blog_title = ret.data.blog_title;
                                this.submit_blog_user = ret.data.nickname;
                                this.submit_blog_date = ret.data.submit_date;
                                window.sessionStorage.setItem('blog_id',ret.data.id)

                            } else {
                                alert('发布失败，请联系站长')
                            }

                        })
                        .catch((ret) => {
                            // 请求没有发起
                            alert('请求失败，请联系站点管理员')

                        })
                }

            },

            update_article: function () {
                alert(this.update_blog_id)
            },


            check_regulation: function () {
                if (this.blog_title.length > 0 && this.submit_blog_type > 0) {

                    this.regular_submit = this.regulations;

                } else {
                    this.regulations = false;
                    alert('填写标题或分类后重新勾选')
                }
            },

            check_del_image: function () {

                let newArray = []

                this.final_upload_img.forEach((value, index) => {
                    newArray.push(value.src)
                })

                let a = new Set(this.current_upload_pic)

                let b = new Set(newArray)

                let differenceABSet = new Set([...a].filter(x => !b.has(x))); // 对比照片是否还在blog内

                return differenceABSet;
            },


            clear_article: function () {
                location.reload();
            },

            check_blog_display: function () {
                window.location.href = './blog_display.html'

            },

            write_another_blog: function () {
                this.after_submit = false;
                location.reload()
            },
            jump_manage_blog: function () {
                window.location.href = './blog_manage_center.html'
            }



        },
        mounted: function () {

            

            if (this.token && this.username) {
                var {
                    createEditor,
                    createToolbar
                } = window.wangEditor;

                this.editorConfig.MENU_CONF['uploadImage'] = this.uploadImageConfig;
                this.editorConfig.MENU_CONF['uploadImage']['headers'] = {
                    "authorization": "JWT " + this.token
                };

                let that = this;
                this.editorConfig.MENU_CONF['insertImage'] = {

                    onInsertedImage(imageNode) {
                        if (imageNode == null) return

                        const {
                            src,
                            alt,
                            url,
                            href
                        } = imageNode
                        that.current_upload_pic.push(src)
                    },
                };

                this.editorConfig.onchangeTimeout = 500;

                this.editorConfig.onChange = () => {

                    const content = editor.children

                    this.blog_contentStr = JSON.stringify(content) // json

                    this.blog_html = editor.getHtml() // html

                    this.final_upload_img = editor.getElemsByType('image');

                };

                var editor = createEditor({
                    selector: '#editor-container',
                    config: this.editorConfig,
                    mode: 'default',
                });

                var toolbar = createToolbar({
                    editor,
                    config: this.toolbarConfig,
                    selector: '#toolbar-container',
                    mode: 'default'
                });

                axios.defaults.headers['Authorization'] = 'JWT ' + this.token

                // todo -> loading 效果
                axios.interceptors.request.use(function(config){
                    this.loading_status = true;
                    return config
                })

                axios.interceptors.response.use(function(res){
                    this.loading_status = false;
                    return res
                })

                async function get_type(){
                    var res = await axios.get('http://127.0.0.1:8000/blog_type/')
                    return res.data
                }
                let res = get_type()
                res.then((data) =>{
                    that.blog_type = data;
                    function get_type_num(type_name){
                        let tmp = ''
                        that.blog_type.some((value,index) =>{
                            if(value.blog_type_name === type_name){
                                tmp = index
                            }
                        })
                        return tmp
                    };
                    var modify_blog = localStorage.getItem('modify_blog')
                    if (modify_blog) {
                        axios.put('http://127.0.0.1:8000/user_blog_filter/', {
                                search_title: localStorage.getItem('modify_blog')
                            })
                            .then((ret) => {
                                editor.dangerouslyInsertHtml(ret.data.data[0].blog_html_version)
                                this.blog_title = ret.data.data[0].blog_title;
                                this.submit_blog_type = get_type_num(ret.data.data[0].blog_type)
                                this.update_blog_id = ret.data.data[0].id;
                                localStorage.removeItem('modify_blog')
                            })
                    }
                })

            } else {
                alert('请先登陆')
                window.location.href = './blog_index.html'

            }
        },
        destroyed: function () {
            editor.destroyed();
            window.localStorage.removeItem('tmp_blog')
        }

    })
}