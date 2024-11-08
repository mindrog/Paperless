package com.ss.paperless.email;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmailMapper {

	int getUnreadCount(long emp_no);

}
