<?php
/**
 * Created by PhpStorm.
 * User: 王 朋
 * Date: 2018/6/7
 * Time: 17:17
 */
namespace creatingValue;

use app\index\model\User;
use think\Config;
use think\Request;
use think\Session;

/**
 * 权限验证类
 * Class Auth
 * @package creatingValue
 */
class Auth
{

    /**
     * @var object 对象实例
     */
    protected static $instance;
    protected $logined = false; // 登录状态

    /**
     * 当前请求实例
     * @var Request
     */
    protected $request;

    /**
     * 类构造函数
     * Auth constructor.
     */
    public function __construct()
    {
        // 初始化request
        $this->request = Request::instance();
    }

    /**
     * 初始化  获取本类实例
     * @return Auth
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * 判断当前操作名是否在传递过来的数组中
     * @param array $arr
     * @return bool
     */
    public function match($arr = []) {
        $arr = is_array($arr) ? $arr : explode(',', $arr);
        if (! $arr) {
            return false;
        }

        $arr = array_map('strtolower', $arr);
        // 匹配到
        if (in_array(strtolower($this->request->action()), $arr) || in_array('*', $arr)) {
            return true;
        }

        // 未匹配到
        return false;
    }

    /**
     * 检测是否登录
     * @return bool
     */
    public function isLogin() {
        if ($this->logined) {
            return true;
        }
        $user = Session::get('user');
        if (! $user) {
            return false;
        }
        // 判断是否同一时间同一账号只能在一个地方登录
        if (Config::get('creatingValue.login_unique')) {
            $my = User::get($user['id']);
            if (! $my || $my['token'] != $user['token']) {
                return false;
            }
        }
        $this->logined = true;
        return true;
    }

    public function login($userName, $password, $keepLogin = 0) {
        $user = User::get('user_name', $userName);
        if (! $user) {
            return false;
        }
        if (Config::get('creatingValue.login_failure_retry') && $user->loginFailure > 10 && time() - $user->updateTime < 1800) {
            return json_encode(array('code' => 0, 'msg' => 'failure times too more'));
        }
        if ($user->password != md5($password.microtime(true))) {
            $user->loginFailure++;
            $user->save();
            return json_encode(array('code' => 0, 'msg' => 'password is incorrect'));
        }
        $user->loginFailure = 0;
        $user->loginTime = time();
        $user->token = Random::uuid();
        $user->save();
        Session::set('user', $user->toArray());

    }
}