package com.ss.paperless.todolist;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TodolistMapper {

	TodolistDTO getTodoList(String emp_code);

	int updateTodoList(TodolistDTO todoList);
	
}
