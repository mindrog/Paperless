package com.ss.paperless.report;

import com.ss.paperless.employee.EmployeeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface ReportMapper {

    int AddSaveAsDraftReportData(ReportDTO report);
}
