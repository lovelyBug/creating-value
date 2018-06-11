<?php
namespace app\index\controller;

header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

use app\common\controller\Backend;
use app\index\model\User;
use creatingValue\Random;
use think\Session;
use think\Validate;

class Index extends Backend
{
    public function index()
    {

    }

    /**
     * 用户通过用户名密码登录
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
            if (empty($userName) || empty($password) || empty($keepLogin)) {
                return json_encode(array('code' => 0, 'msg' => 'params are not full'));
            }
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
            $result = $this->auth->login($userName, $password, $keepLogin == 'yes' ? 86400 : 0);
            if ($result === true) {
                return json_encode(array('code' => 1, 'msg' => 'login success'));
            } else if ($result === false) {
                return json_encode(array('code' => 0, 'msg' => 'user does not exist'));
            } else if ($result === $this->cvConst->MORE_LOGIN_FAILURE) {
                return json_encode(array('code' => 0, 'msg' => 'failure times too more'));
            } else {
                return json_encode(array('code' => 0, 'msg' => 'password is incorrect'));
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
     * 用户通过邮箱验证码登录
     * @return string
     */
    public function checkEmailLogin() {
        if (! $vCode = Session::get('vCode')) {
            return json_encode(array('code' => 0, 'msg' => 'please reCode'));
        }
        if ($this->request->isPost()) {
            $email = $this->request->post('userEmail');
            $code = $this->request->post('vCode');
            if (empty($email) || empty($code)) {
                return json_encode(array('code' => 0, 'msg' => 'params are not full'));
            }
            if ($code == $vCode) {
                $result = $this->auth->checkEmailLogin($email);
                if ($result) {
                    return json_encode(array('code' => 1, 'msg' => 'login success'));
                } else {
                    return json_encode(array('code' => 0, 'msg' => 'user not exists'));
                }
            } else {
                return json_encode(array('code' => 0, 'msg' => 'code is false'));
            }
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
            $confirm = $this->request->post('confirm');
            $vCodePa = $this->request->post('vCode');
            if (empty($userName) || empty($userEmail) || empty($password) || empty($confirm) || empty($vCodePa)) {
                return json_encode(array('code' => 0, 'msg' => 'params are not full'));
            }
            if ($vCodePa != $vCode) {
                return json_encode(array('code' => 0, 'msg' => 'code is false'));
            }
            if ($this->auth->checkEmailRepeat($userEmail)) {
                return json_encode(array('code' => 0, 'msg' => 'this email has been registered'));
            }
            if ($this->auth->checkUserNameRepeat($userName)) {
                return json_encode(array('code' => 0, 'msg' => 'this name has been existed'));
            }
            if ($password != $confirm) {
                return json_encode(array('code' => 0, 'msg' => 'password does not equals confirm'));
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
                return json_encode(array('code' => 0, 'msg' => 'illegal params'));
            }
            $this->auth->register($userEmail, $userName, $password);
            return json_encode(array('code' => 1, 'msg' => 'register success'));
        } else {
            return 'not access';
        }
    }

    /**
     * 发送验证码
     * @return string
     */
    public function sendCode() {
        $to = $this->request->post('to');
        if (empty($to)) {
            return json_encode(array('code' => 0, 'msg' => 'params are not full'));
        }
        $subject = '创造你的价值';
        $code = Random::getVerificationCode();
        $body = '<h3>您的验证码是：' . $code . '</h3>';
        if ($this->auth->sendEmail($subject, $body, $to)) {
            Session::set('vCode', $code);
            return json_encode(array('code' => 1, 'msg' => 'send success', 'data' => $code));
        } else {
            return json_encode(array('code' => 0, 'msg' => 'send failed'));
        }
    }
}
