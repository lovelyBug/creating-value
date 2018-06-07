<?php
/**
 * Created by PhpStorm.
 * User: 王 朋
 * Date: 2018/6/7
 * Time: 19:40
 */
namespace creatingValue;

class Random
{

    /**
     * 获取唯一标识
     * @return string
     */
    public static function uuid() {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000, mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}