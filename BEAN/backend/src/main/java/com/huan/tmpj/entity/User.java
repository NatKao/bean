package com.huan.tmpj.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data // Lombok 自動產生 Getter/Setter
@TableName("users") // 必須對應你 pgAdmin 裡面的 Table 名稱
public class User {

    // 對應資料庫的 id (BigSerial)
    @TableId(type = IdType.AUTO) 
    private Long id;

    private String username;
    private String email;
     private LocalDateTime createTime; 
}