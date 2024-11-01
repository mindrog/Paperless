package com.ss.paperless.report;

import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.employee.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeEntity getUserInfo(String empCode) {
        return employeeRepository.findByEmpCode(empCode);
    }

    public int AddSaveAsDraftReportData(ReportDTO report) {
        return reportMapper.AddSaveAsDraftReportData(report);
    }
}
