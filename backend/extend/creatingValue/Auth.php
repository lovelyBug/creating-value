<?php
/**
 * Created by PhpStorm.
 * User: 王 朋
 * Date: 2018/6/7
 * Time: 17:17
 */
namespace creatingValue;

use app\index\model\User;
use PHPMailer\PHPMailer;
use PHPMailer\Exception;
use think\Config;
use think\Cookie;
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

    protected $cvConst = null;

    /**
     * 类构造函数
     * Auth constructor.
     */
    protected function __construct()
    {
        // 初始化request
        $this->request = Request::instance();
        // 初始化cvConst
        $this->cvConst = CvConst::instance();
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

    /**
     * 用户登录
     * @param $userName  string    用户名
     * @param $password   string    密码
     * @param int $keepTime  int   有效时长
     * @return bool|string
     */
    public function login($userName, $password, $keepTime = 0) {
        $user = User::get(['user_name' => $userName]);
        if (! $user) {
            return false;
        }
        if (Config::get('creatingValue.login_failure_retry') && $user->loginFailure > 10 && time() - $user->updateTime < 1800) {
            return $this->cvConst->MORE_LOGIN_FAILURE;
        }
        if ($user->user_password != md5($password)) {
            $user->loginFailure++;
            $user->save();
            return $this->cvConst->PASSWORD_FALSE;
        }
        $user->loginFailure = 0;
        $user->loginTime = time();
        $user->token = Random::uuid();
        $user->save();
        Session::set('user', $user->toArray());
        $this->keepLogin($keepTime, $user);
        return true;
    }

    /**
     * 刷新保持登录的cookie
     * @param int $keepTime  有效时长
     * @param $user  User   相关用户
     * @return bool
     */
    public function keepLogin($keepTime = 0, $user) {
        if ($keepTime) {
            $expireTime = time() + $keepTime;
            $key = md5(md5($user->id).md5($keepTime).md5($expireTime).$user->token);
            $data = [$user->id, $keepTime, $expireTime, $key];
            Cookie::set('keepLogin', implode('|', $data), $keepTime);
            return true;
        }
        return false;
    }

    /**
     * 自动登录
     * @return bool
     */
    public function autoLogin() {
        $keepLogin = Cookie::get('keepLogin');
        if (! $keepLogin) {
            return false;
        }
        list($id, $keepTime, $expireTime, $key) = explode('|', $keepLogin);
        if ($id && $keepTime && $expireTime && $key && $expireTime > time()) {
            $user = User::get($id);
            if (! $user || ! $user->token) {
                return false;
            }
            // token有变更
            if ($key != md5(md5($id).md5($keepTime).md5($expireTime).$user->token)) {
                return false;
            }
            Session::set('user', $user->toArray());
            $this->keepLogin($keepTime, $user);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 发送邮件
     * @param $subject
     * @param $body
     * @param $to
     * @param bool $isHTML
     * @return bool
     */
    public function sendEmail($subject, $body, $to, $isHTML = true) {
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'smtp.aliyun.com';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;
        $mail->SMTPAuth = true;
        $mail->Username = Config::get('email.user');
        $mail->Password = Config::get('email.password');
        $mail->From = Config::get('email.user');
        $mail->CharSet = 'UTF-8';
        $mail->isHTML($isHTML);
        if (is_string($to)) {
            $mail->addAddress($to);
        } else {
            foreach ($to as $item) {
                $mail->addAddress($item);
            }
        }
        $mail->Subject = $subject;
        $mail->Body = $body;
        $status = $mail->send();
        if ($status) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 用户注册
     * @param $userEmail
     * @param $userName
     * @param $password
     * @return bool
     */
    public function register($userEmail, $userName, $password) {
        $user = new User();
        $user->data([
            'user_email' => $userEmail,
            'user_name' => $userName,
            'user_password' => md5($password),
            'loginTime' => time(),
            'createTime' => time(),
            'updateTime' => time(),
            'token' => Random::uuid(),
        ]);
        $user->save();
        Session::set('user', $user->toArray());
        return true;
    }

    /**
     * 检查邮箱是否已被注册    邮箱已被注册返回true，否则返回false
     * @param $userEmail
     * @return bool
     */
    public function checkEmailRepeat($userEmail) {
        $user = User::get(['user_email' => $userEmail]);
        if ($user) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 检查用户名是否已存在   已存在返回true，否则返回false
     * @param $userName
     * @return bool
     */
    public function checkUserNameRepeat($userName) {
        $user = User::get(['user_name' => $userName]);
        if ($user) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 用户通过邮箱验证码登录
     * @param $userEmail
     * @return bool
     */
    public function checkEmailLogin($userEmail) {
        $user = User::get(['user_email' => $userEmail]);
        if ($user) {
            Session::set('user', $user->toArray());
            return true;
        } else {
            return false;
        }
    }
}