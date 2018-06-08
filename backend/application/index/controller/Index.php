<?php
namespace app\index\controller;
use app\common\controller\Backend;
use creatingValue\Random;
use think\Session;
use think\Validate;

class Index extends Backend
{
    public function index()
    {

    }

    /**
     * 用户登录
     * @return string
     */
    public function login() {
        if ($this->auth->isLogin()) {
            return json_encode(array('code' => 1, 'msg' => 'has logined'));
        }
        if ($this->request->isPost()) {
            $userName = $this->request->post('userName');
            $password = $this->request->post('password');
            $keepLogin = $this->request->post('keepLogin');
            //$token = $this->request->post('token');
            $rule = [
                'userName' => 'require|length:3,30',
                'password' => 'require|length:6,30',
            //    'token' => 'token',
            ];
            $data = [
                'userName' => $userName,
                'password' => $password,
            //    'token' => $token,
            ];
            $validate = new Validate($rule);
            $result = $validate->check($data);
            if (! $result) {
                return json_encode(array('code' => 0, 'msg' => 'illegal params'));
            }
            $result = $this->auth->login($userName, $password, $keepLogin ? 86400 : 0);
            if ($result === true) {
                return json_encode(array('code' => 1, 'msg' => 'login success'));
            } else {
                return json_encode(array('code' => 0, 'msg' => 'login failed'));
            }
        }

        // 根据客户端的cookie，判断是否可以自动登录
        if ($this->auth->autoLogin()) {
            return json_encode(array('code' => 1, 'msg' => 'autoLogin success'));
        } else {
            return json_encode(array('code' => 0, 'msg' => 'must reconfirm'));
        }
    }

    /**
     * 检查用户是否已经登录
     * @return string
     */
    public function isLogin() {
        if ($this->auth->isLogin()) {
            return json_encode(array('code' => 1, 'msg' => 'LOGINED'));
        } else {
            return json_encode(array('code' => 0, 'msg' => 'NOT_LOGIN'));
        }
    }

    /**
     * 用户注册
     * @return string
     */
    public function register() {
        if (! $vCode = Session::get('vCode')) {
            return json_encode(array('code' => 0, 'msg' => 'please reCode'));
        }
        if ($this->request->isPost()) {
            $userEmail = $this->request->post('userEmail');
            $userName = $this->request->post('userName');
            $password = $this->request->post('password');
            $confirm = $this->request->post('conform');
            if ($this->auth->checkEmailRepeat($userEmail)) {
                return json_encode(array('code' => 0, 'msg' => 'this email has been registered'));
            }
            if ($password != $confirm) {
                return json_encode(array('code' => 0, 'msg' => ''));
            }
            $rule = [
                'userEmail' => 'require|email',
                'userName' => 'require|length:3,30',
                'password' => 'require|length:6,30',
                'confirm' => 'require|length:6,30',
            ];
            $data = [
                'userEmail' => $userEmail,
                'userName' => $userName,
                'password' => $password,
                'confirm' => $confirm,
            ];
            $validate = new Validate($rule);
            if (! $validate->check($data)) {
                return json_encode(array('code' => 0, 'msg' => ''));
            }
            $this->auth->register($userEmail, $userName, $password);
            return json_encode(array('code' => 0, 'msg' => 'register success'));
        } else {
            return 'not access';
        }
    }

    /**
     * 发送验证码
     * @param $to string|array   接收者
     * @return string
     */
    public function sendCode($to) {
        $subject = '创造你的价值';
        $code = Random::getVerificationCode();
        $body = '<h3>您的验证码是：' . $code . '</h3>';
        if ($this->auth->sendEmail($subject, $body, $to)) {
            Session::set('vCode', $code);
            return json_encode(array('code' => 1, 'msg' => 'send success'));
        } else {
            return json_encode(array('code' => 0, 'msg' => 'send failed'));
        }
    }
}
