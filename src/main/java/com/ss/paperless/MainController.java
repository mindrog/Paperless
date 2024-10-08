package com.ss.paperless;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
	@Value("${kakao-API-key}")
	private String kakao;
	@GetMapping("/api/hello")
	public String test() {
		
		System.out.println(kakao);
		return "Hello, world!";

	}
}
