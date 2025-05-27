package com.boot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // @RestController만 남김

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class MainController {
    @RequestMapping("/list") // 또는 @GetMapping("/list")
    public String list() { // Model 매개변수는 더 이상 필요 없음
        log.info("@# list32()");
        return "lis23t"; // "list"라는 문자열이 직접 응답으로 전송됨
    }
}