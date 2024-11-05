package com.ss.paperless.report;

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
    private List<ApproverDTO> selectedApprovers;
    private List<ReferenceDTO> selectedReferences;
    private List<ReferenceDTO> selectedReceivers;
}
