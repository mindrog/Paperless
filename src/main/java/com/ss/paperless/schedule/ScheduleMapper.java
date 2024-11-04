package com.ss.paperless.schedule;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ScheduleMapper {

	public List<ScheduleDTO> getCompSchedule(String emp_comp_no) ;

	public List<ScheduleDTO> getDeptSchedule(String emp_comp_no, String emp_dept_no) ;

	public List<ScheduleDTO> getPrivateSchedule(String emp_no, String emp_comp_no, String emp_dept_no) ;

	public int ScheduleInsertComp(Long emp_no, Long comp_no, Long dept_no, String sche_title, String sche_start,
			String sche_end);

	public int ScheduleInsertDept(Long emp_no, Long comp_no, Long dept_no, String sche_title, String sche_start,
			String sche_end);

	public int ScheduleInsertPrivate(Long emp_no, Long comp_no, Long dept_no, String sche_title, String sche_start,
			String sche_end);
	

}
