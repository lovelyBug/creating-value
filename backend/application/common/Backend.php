<?php
/**
 * Created by PhpStorm.
 * User: 王 朋
 * Date: 2018/6/7
 * Time: 16:47
 */
namespace app\common;
use creatingValue\Auth;
use think\Controller;

/**
 * 基础公共类
 * Class Backend
 * @package app\common
 */
class Backend extends Controller
{

    /**
     * 无需登录的方法
     * @var array
     */
    protected $noNeedLogin = [];

    /**
     * 权限控制类
     * @var Auth
     */
    protected $auth = null;

    public function _initialize()
    {
        $this->auth = Auth::instance();
        // 检测是否需要验证登录
        if (! $this->auth->match($this->noNeedLogin)) {
            // 检测是否登录
            if (! $this->auth->isLogin()) {
                return json_encode(array('code' => 0, 'msg' => 'NOT_LOGIN'));
            }
        }
    }
}