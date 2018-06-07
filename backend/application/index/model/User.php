<?php
/**
 * Created by PhpStorm.
 * User: 王 朋
 * Date: 2018/6/7
 * Time: 19:19
 */
namespace app\index\model;

use think\Model;

class User extends Model
{

    // 定义时间戳字段名
    protected $createTime = 'createTime';
    protected $updateTime = 'updateTime';
}