package com.huan.tmpj.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.huan.tmpj.entity.User;
import org.apache.ibatis.annotations.Mapper;

// 加上 @Mapper 註解，Spring 才會掃描到它，那個警告就會消失
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 不需要寫任何程式碼，繼承 BaseMapper 就自動擁有 CRUD 功能了
}