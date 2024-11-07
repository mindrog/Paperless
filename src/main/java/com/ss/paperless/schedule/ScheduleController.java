package com.ss.paperless.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.resource.transaction.internal.SynchronizationRegistryStandardImpl;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@ResponseBody
@RequestMapping("/api")
public class ScheduleController {
	@Autowired
	ScheduleService service;

	@PostMapping("/getscheduls")
	public @ResponseBody List<HashMap<String, Object>> getSchedule(@RequestParam String emp_no,
			@RequestParam String emp_comp_no, @RequestParam String emp_dept_no) {
		List<ScheduleDTO> listCompSchedule = service.getCompSchedule(emp_comp_no);
		List<ScheduleDTO> listDeptSchedule = service.getDeptSchedule(emp_comp_no, emp_dept_no);
		List<ScheduleDTO> listPrivateSchedule = service.getPrivateSchedule(emp_no, emp_comp_no, emp_dept_no);
		List<ScheduleDTO> listAll = new ArrayList<>();
		listAll.addAll(listCompSchedule);
		listAll.addAll(listDeptSchedule);
		listAll.addAll(listPrivateSchedule);
		System.out.println("listAll" + listAll);
		List<HashMap<String, Object>> scheduleList = new ArrayList<>();

		for (ScheduleDTO schedule : listAll) {
			HashMap<String, Object> hash = new HashMap<>();
			hash.put("id", schedule.getSche_no());
			hash.put("title", schedule.getSche_title());
			hash.put("start", schedule.getSche_start());
			hash.put("end", schedule.getSche_end());
			hash.put("color", schedule.getSche_color());

			// 필요한 경우 추가 필드를 포함합니다.
			// hash.put("time", schedule.getScheduleTime());

			scheduleList.add(hash);
		}
		System.out.println(scheduleList);
		return scheduleList;
	}
	@GetMapping("/scheduleinsert")
	 public int ScheduleInsert(
			 	@RequestParam Long emp_no,
			 	@RequestParam Long comp_no,
			 	@RequestParam Long dept_no,
	            @RequestParam String sche_title,
	            @RequestParam String sche_start, // LocalDate 대신 String으로 받음
	            @RequestParam String sche_end,   // LocalDate 대신 String으로 받음
	            @RequestParam String visibility) {
		
	        // 문자열을 LocalDate로 변환
	        LocalDate startDate = LocalDate.parse(sche_start);
	        LocalDate endDate = LocalDate.parse(sche_end);

	        if ("company-wide".equals(visibility)) {
	            return service.ScheduleInsertComp(emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	        } else if ("department-wide".equals(visibility)) {
	        	System.out.println("[ param : sche_title = " + sche_title + ", sche_start = " + startDate + ", sche_end = " + endDate + "visibility = " + visibility + " ]");
	            return service.ScheduleInsertDept(emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	        } else {
	        	System.out.println("[ param : sche_title = " + sche_title + ", sche_start = " + startDate + ", sche_end = " + endDate + "visibility = " + visibility + " ]");
	            return service.ScheduleInsertPrivate(emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
	        }
	    }
	@GetMapping("/scheduleedit")
	 public int ScheduleEdit(
			 	@RequestParam int sche_no,
			 	@RequestParam Long emp_no,
			 	@RequestParam Long comp_no,
			 	@RequestParam Long dept_no,
	            @RequestParam String sche_title,
	            @RequestParam String sche_start, // LocalDate 대신 String으로 받음
	            @RequestParam String sche_end,   // LocalDate 대신 String으로 받음
	            @RequestParam String visibility) {
		 LocalDate startDate = LocalDate.parse(sche_start);
	     LocalDate endDate = LocalDate.parse(sche_end);
	     
		if ("company-wide".equals(visibility)) {
            return service.ScheduleEditComp(sche_no,emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
        } else if ("department-wide".equals(visibility)) {
        	System.out.println("[ edit : sche_title = " + sche_title + ", sche_start = " + startDate + ", sche_end = " + endDate + "visibility = " + visibility + " ]");
            return service.ScheduleEditDept(sche_no,emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
        } else {
        	System.out.println("[ edit : sche_title = " + sche_title + ", sche_start = " + startDate + ", sche_end = " + endDate + "visibility = " + visibility + " ]");
            return service.ScheduleEditPrivate(sche_no,emp_no,comp_no,dept_no,sche_title,sche_start,sche_end);
        }
	}
	@GetMapping("/scheduledelete")
	 public int ScheduleDelete(@RequestParam int sche_no) {
		return service.ScheduleDelete(sche_no);
	}
}
