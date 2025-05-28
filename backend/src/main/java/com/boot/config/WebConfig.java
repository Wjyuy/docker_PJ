// src/main/java/com/boot/config/WebConfig.java (새로 생성하는 파일)
package com.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 경로에 대해
                .allowedOrigins("http://localhost:3001") // 개발 중 : 로컬 서버 3001번 프론트 포트
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 자격 증명(쿠키, 인증 헤더 등) 허용
                .maxAge(3600); // Pre-flight 요청 결과 캐싱 시간 (초)
    }
}