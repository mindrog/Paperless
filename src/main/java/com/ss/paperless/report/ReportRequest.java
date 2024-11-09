package com.ss.paperless.report;

import com.ss.paperless.employee.EmployeeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReportRequest {
    private Long reportId;
    private String reportTitle;
    private String reportContent;
    private String reportDate;
    private String repoStartTime;
    private String repoEndTime;
    private String reportStatus;
    private List<EmployeeDTO> selectedApprovers;
    private List<EmployeeDTO> selectedReferences;
    private List<EmployeeDTO> selectedReceivers;
}
