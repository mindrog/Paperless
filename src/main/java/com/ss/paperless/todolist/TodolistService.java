package com.ss.paperless.todolist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodolistService {
	@Autowired
	private TodolistMapper mapper;

	public TodolistDTO getTodoList(String emp_code) {
		return mapper.getTodoList(emp_code);
	}

	public TodolistDTO updateTodoList(TodolistDTO todoList, String emp_code) {
		// emp_code 설정
		todoList.setEmp_code(emp_code);
		
		int updateTodoList = mapper.updateTodoList(todoList);
		if (updateTodoList == 0) {
			throw new RuntimeException("Todo not found or access denied");
		}
		
		// 업데이트된 데이터 다시 조회한 후 반환하기
		return mapper.getTodoList(emp_code);
	}
}