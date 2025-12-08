package com.huan.tmpj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. 關閉 CSRF (開發階段必須關閉，否則 Post 會被擋)
            .csrf(csrf -> csrf.disable())
            
            // 2. 核心關鍵：開啟 CORS 並指定設定來源
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 3. 權限設定
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // 暫時允許所有請求
            );

        return http.build();
    }

    // 定義 CORS 規則
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 【重要】這裡必須填寫你前端的網址，根據你的錯誤訊息是 8100
        configuration.setAllowedOrigins(List.of("http://localhost:8100")); 
        
        // 允許的方法
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 允許的 Header
        configuration.setAllowedHeaders(List.of("*"));
        
        // 是否允許攜帶認證資訊 (Cookie/Session)
        // 因為你的 baseAxios.js 裡面有寫 withCredentials: true，所以這裡一定要是 true
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}