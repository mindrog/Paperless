package com.ss.paperless.schedule;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScheduleService {
	@Autowired
	ScheduleMapper mapper;
	
	public List<ScheduleDTO> getCompSchedule(String emp_comp_no) {
		// TODO Auto-generated method stub
		return mapper.getCompSchedule(emp_comp_no);
	}

	public List<ScheduleDTO> getDeptSchedule(String emp_comp_no, String emp_dept_no) {
		// TODO Auto-generated method stub
		return mapper.getDeptSchedule(emp_comp_no,emp_dept_no);
	}

	public List<ScheduleDTO> getPrivateSchedule(String emp_no, String emp_comp_no, String emp_dept_no) {
		// TODO Auto-generated method stub
		return mapper.getPrivateSchedule(emp_no,emp_comp_no,emp_dept_no);
	}

	public int ScheduleInsertComp(Long emp_no, Long comp_no, Long dept_no, String sche_title, String sche_start,
			String sche_end) {
		// TODO Auto-generated method stub
		return mapper.ScheduleInsertComp(emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	}

	public int ScheduleInsertDept(Long emp_no, Long comp_no, Long dept_no, String sche_title, String sche_start,
			String sche_end) {
		// TODO Auto-generated method stub
		return mapper.ScheduleInsertDept(emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	}

	public int ScheduleInsertPrivate(Long emp_no, Long comp_no, Long dept_no, String sche_title, String sche_start,
			String sche_end) {
		
		return mapper.ScheduleInsertPrivate(emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	}

	public int ScheduleEditComp(int sche_no, Long emp_no, Long comp_no, Long dept_no, String sche_title,
			String sche_start, String sche_end) {
		// TODO Auto-generated method stub
		return mapper.ScheduleEditComp(sche_no,emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	}

	public int ScheduleEditDept(int sche_no, Long emp_no, Long comp_no, Long dept_no, String sche_title,
			String sche_start, String sche_end) {
		// TODO Auto-generated method stub
		return mapper.ScheduleEditDept(sche_no,emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	}

	public int ScheduleEditPrivate(int sche_no, Long emp_no, Long comp_no, Long dept_no, String sche_title,
			String sche_start, String sche_end) {
		// TODO Auto-generated method stub
		return mapper.ScheduleEditPrivate(sche_no,emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	}

	public int ScheduleDelete(int sche_no) {
		// TODO Auto-generated method stub
		return mapper.ScheduleDelete(sche_no);
	}

	public List<ScheduleDTO> GetPersnalSchedules(int emp_no, int comp_no, int dept_no) {
		// TODO Auto-generated method stub
		return mapper.GetPersnalSchedules(emp_no,comp_no,dept_no);
	}

	public List<ScheduleDTO> GetDeptSchedules(int emp_no, int comp_no, int dept_no) {
		// TODO Auto-generated method stub
		return mapper.GetDeptSchedules(emp_no,comp_no,dept_no);
	}

	public List<ScheduleDTO> GetTeamSchedules(int emp_no, int comp_no, int dept_no) {
		// TODO Auto-generated method stub
		return mapper.GetTeamSchedules(emp_no,comp_no,dept_no);
	}

	

}
