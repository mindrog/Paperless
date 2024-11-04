package com.ss.paperless.todolist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class TodoListController {
	@Autowired
	TodolistService todoService;

	@GetMapping("/todolist")
	public TodolistDTO getTodoList() {
		System.out.println("getTodoList");
		String emp_code = SecurityContextHolder.getContext().getAuthentication().getName();
		TodolistDTO todoList = todoService.getTodoList(emp_code);
		System.out.println("todoList: " + todoList);
		return todoList;
	}

	// PUT 요청을 처리하는 메서드 추가
	@PutMapping("/todolist")
	public ResponseEntity<?> updateTodoList(@RequestBody TodolistDTO todoList) {
		try {

			System.out.println("updateTodoList");
			System.out.println("updateTodoList의 todoList: " + todoList);
			
			// 현재 사용자 정보
			String emp_code = SecurityContextHolder.getContext().getAuthentication().getName();
			
			TodolistDTO updatedTodoList = todoService.updateTodoList(todoList, emp_code);
			System.out.println("Updated todoList: " + updatedTodoList);
			
			// 성공 시 200 OK와 업데이트된 데이터 반환
			return ResponseEntity.ok(updatedTodoList); 
		} catch (Exception e) {
			System.err.println("TodoList 업데이트 중 오류 발생: " + e.getMessage());
			e.printStackTrace();

			// 오류 발생 시 500 Internal Server Error와 메시지 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업데이트 중 오류가 발생했습니다.");
		}
	}
}
