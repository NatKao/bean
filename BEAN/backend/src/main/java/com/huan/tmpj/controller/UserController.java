package com.huan.tmpj.controller;

import com.huan.tmpj.entity.User;
import com.huan.tmpj.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users") // 前端呼叫的網址前綴
public class UserController {

    @Autowired
    private UserMapper userMapper;

    // 1. 查詢所有使用者
    // URL: GET http://localhost:8080/api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userMapper.selectList(null);
    }

    // 2. 新增使用者
    // URL: POST http://localhost:8080/api/users
    @PostMapping
    public String addUser(@RequestBody User user) {
        userMapper.insert(user);
        return "新增成功";
    }
}