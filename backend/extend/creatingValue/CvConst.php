<?php
/**
 * Created by PhpStorm.
 * User: 王 朋
 * Date: 2018/6/10
 * Time: 10:23
 */

/**
 * 常量定义类
 * 包含系统中用到的常量，表示某种状态。
 */

namespace creatingValue;

class CvConst
{
    public $MORE_LOGIN_FAILURE = 'MORE_LOGIN_FAILURE';
    public $PASSWORD_FALSE = 'PASSWORD_FALSE';

    /**
     * 存放本类实例
     * @var CvConst
     */
    protected static $instance;

    protected function __construct()
    {

    }

    /**
     * 获取本类实例
     * @return CvConst
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }
}
