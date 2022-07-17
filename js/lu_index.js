function main() {

    $('.login').click(function (e) {
        $('.register_menu').fadeOut();
        $('.login_menu').fadeIn();
        e.preventDefault()
        return false
    });

    $('#login_close').click(function () {
        $('.login_menu').fadeOut();
    });

    uuid = ''

    $('.register').click(function (e) {
        $('.login_menu').fadeOut();
        $('.register_menu').fadeIn();
        uuid = getVerifyCode();
        e.preventDefault()
        return false
    });

    $('#register_close').click(function () {
        $('.register_menu').fadeOut();
    });

    function after_login() {
        var username = sessionStorage.getItem('username')
        if (username) {
            $('.login').fadeOut();
            $('.register').fadeOut();
            $('.user_login_info').html(username).show()
            $('#logout').fadeIn()
        } else {
            return true
        }
    };
    after_login()

    // 用户登陆
    $('#user_login').click(function () {
        var username = $('#username').val()
        var password = $('#password').val()
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:8000/login/',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                alert('登陆成功')
                $('.login_menu').fadeOut();
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', data.username)
                after_login()
            },
            error: function () {
                alert('登陆失败')
            },
        })

    });

    $('.user_fgt_pwd').click(function () {
        alert('联系网管:LuxyLuxy666')
    });

    // 用户注册
    // "data:image/jpeg;base64,(base64编码的jpeg图片数据)"
    function getVerifyCode() {
        var uuid
        $.ajax({
            type: 'get',
            url: 'http://127.0.0.1:8000/ImageCode/',
            async: false,
            xhrFields: {
                withCredentials: true // 这里设置了withCredentials
            },
            success: function (data) {

                var res = JSON.parse(data);

                $('.verify_code_pic').attr('src', "data:image/jpeg;base64," + res.img);

                uuid = res.uuid_tmp

            },
            error: function (data) {
                console.log('请求失败');
            },
        });

        return uuid

    };

    function check_data(...source) {

        if (source.length != 3) {

            alert('请填写完整信息')

        }

        res_user = source[0].match(/^[a-zA-Z0-9._-]{4,12}$/g) + ''
        res_password = source[1].match(/^[a-zA-Z0-9._-]{6,18}$/g) + ''

        if (res_user && res_password) {

            return true

        } else {

            return false

        }
    };


    $('#user_register').click(function () {

        username = $('#register_username').val();
        password = $('#register_password').val();
        re_password = $('#register_re_password').val();
        verify_code = $('#verify_code').val();
        uuid_num = uuid

        if (check_data(username, password, re_password)) {

            $.ajax({
                type: 'post',
                url: 'http://127.0.0.1:8000/register/',
                data: {
                    username: username,
                    password: password,
                    re_password: re_password,
                    uuid: verify_code,
                    uuid_num: uuid_num
                },
                success: function (data) {
                    if (String(data.status).startsWith('2')) {
                        alert(data.info);
                        location.reload();
                        $('.login_menu').fadeIn();
                    } else if (String(data.status).startsWith('4')) {
                        alert(data.info);
                        location.reload();
                        $('.register_menu').fadeIn();
                    };
                },
                error: function (data) {
                    alert('注册失败');
                    location.reload();
                    $('.register_menu').fadeIn();
                }
            })

        } else {

            alert('账号密码不合规')

        }
    });

    $('#refresh_code').click(function () {
        uuid = getVerifyCode()
    })

    // 退出登录
    $('#logout').click(function () {

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');

        location.reload()
    })

    // 撰写博客
    $('#write_blog').click(function () {

        window.location.href = './blog_editor.html'
    })

    // 管理博客
    $('#manage_blog').click(function () {

        window.location.href = './blog_manage_center.html'
    })

    // 博客大厅
    $('#blog_center').click(function () {

        window.location.href = './blog_center.html'
    })

    // 联系站长
    $('#contact_operator').click(function () {

        $('.cnt_operator').fadeIn()
    })
    $('.close_cnt').click(function () {

        $('.cnt_operator').fadeOut()
    })

    // 意见箱提交
    $('.message_sbt').click(function () {

        var client_name = $('#name').val()
        var client_email = $('#email').val()
        var client_message = $('#message').val()

        if (client_email && client_email && client_message && client_name.length < 5) {

            $.ajax({
                type: 'post',
                url: 'http://127.0.0.1:8000/clientMessage/',
                data: {
                    nickname: client_name,
                    email: client_email,
                    client_content: client_message
                },
                success: function (data) {

                    alert(data.info)


                },
                error: function (data) {

                    alert('提交失败，检查输入格式')

                },
            })

        } else {
            alert('请填写正确信息')
        }

    });

    VANTA.CELLS({
        el: "#intro-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        color1: 0x122020,
        size: 1.20
    });

    $(function () {

        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('iPhone') > -1 || u.indexOf(
                'Windows Phone') > -1 || navigator.userAgent.indexOf("iPad") > -1) {
            $(".hover-bg .hover-text").css({
                'opacity': '1'
            });

            $(".hover-bg .hover-text>h4").css({
                'opacity': '1',
                '-webkit-transform': 'translateY(0)',
                'transform': 'translateY(0)'
            });

            $(".hover-bg .hover-text>i").css({
                'opacity': '1'
            });
        }
    });

    $('.achivement-box').click(function(){
        alert(1)
    })
}
main()