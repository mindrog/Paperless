package com.ss.paperless.company;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ss.paperless.employee.EmployeeController;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {
	@Autowired
	CompanyService service;
	@GetMapping("/getcompinfo")
	public CompanyDTO GetCompInfo(@RequestParam int comp_no) {
		CompanyDTO returnComp = service.GetCompInfo(comp_no);
		returnComp.setComp_headcount(service.GetCompHeadcount(comp_no));
		System.out.println(returnComp);
		return returnComp;
	}
}
