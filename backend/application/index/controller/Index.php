<?php
namespace app\index\controller;
use app\common\Backend;
use think\Validate;

class Index extends Backend
{
    public function index()
    {

    }

    public function login() {
        if ($this->request->isPost()) {
            $userName = $this->request->post('userName');
            $password = $this->request->post('password');
            $keepLogin = $this->request->post('keepLogin');
            $token = $this->request->post('token');
            $rule = [
                'userName' => 'require|length:3,30',
                'password' => 'require|length:6,30',
                'token' => 'token',
            ];
            $data = [
                'userName' => $userName,
                'password' => $password,
                'token' => $token,
            ];
            $validate = new Validate($rule);
            $result = $validate->check($data);
            if (! $result) {
                return json_encode(array('code' => 0, 'msg' => 'illegal params'));
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
}
