package com.ss.paperless.report;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproverDTO {

    private int emp_no;
    private int appr_no;
    private int appr_repo_no;
    private int appr_emp_no;
    private int appr_order;
    private String appr_status;
    private int appr_delegate;

    @JsonProperty("approvalType")
    private String approval_type;    // 결재 유형(전결, 결재 등)
}
