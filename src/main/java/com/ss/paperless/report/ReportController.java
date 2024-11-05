package com.ss.paperless.report;

import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드에서 CORS 문제를 방지하기 위한 설정
public class ReportController {

    @Autowired
    private ReportService reportService;

    private final String uploadDir = "uploads/"; // 파일 저장 디렉토리 경로

    // 사용자 정보 조회
    @GetMapping("/getUserInfo")
    public ResponseEntity<EmployeeDTO> getUserInfo() {
        // 현재 인증된 사용자의 emp_code를 가져옴
        String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
        // 서비스에서 사용자 정보 조회
        EmployeeEntity userInfo = reportService.getUserInfo(empCode);

        // DTO에 조회된 정보를 담아 응답
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setEmp_code(userInfo.getEmpCode());
        employeeDTO.setEmp_name(userInfo.getEmpName());
        employeeDTO.setEmp_dept_no(userInfo.getEmpDeptNo());
        employeeDTO.setDept_name(userInfo.getDepartment().getDeptName());
        employeeDTO.setDept_team_name(userInfo.getDepartment().getDeptTeamName());

        return ResponseEntity.ok(employeeDTO);
    }

    // 보고서 임시 저장 엔드포인트
    @PostMapping(value = "/saveasdraft", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveAsDraftReport(
            @RequestPart(value = "reportId", required = false) Long reportId,
            @RequestPart("reportTitle") String reportTitle,
            @RequestPart("reportContent") String reportContent,
            @RequestPart("reportDate") String reportDate,
            @RequestPart("repoStartTime") String repoStartTime,
            @RequestPart("repoEndTime") String repoEndTime,
            @RequestPart("reportStatus") String reportStatus,
            @RequestPart("selectedApprovers") String selectedApproversJson,
            @RequestPart("selectedReferences") String selectedReferencesJson,
            @RequestPart("selectedReceivers") String selectedReceiversJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        try {
            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 조회
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
            int repoEmpNo = reportService.getUserEmpNo(empCode);

            // 데이터 저장을 위한 Map 생성
            Map<String, Object> reportData = reportService.prepareReportDataMap(
                    repoEmpNo, reportTitle, reportContent, reportDate, repoStartTime, repoEndTime, reportId,
                    "saved", selectedApproversJson, selectedReferencesJson, selectedReceiversJson, files);

            // 서비스 호출로 임시 저장 및 reportId 반환
            Long report_Id = reportService.addSaveAsDraftReportData(reportData);

            return ResponseEntity.ok(Map.of("message", "Draft saved successfully", "reportId", report_Id));

        } catch (Exception e) {
            log.error("Error saving draft report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving draft: " + e.getMessage());
        }
    }

    // 보고서 결재 상신 엔드포인트
    @PostMapping(value = "/saveworkreport", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitWorkReport(
            @RequestPart("reportTitle") String reportTitle,
            @RequestPart("reportContent") String reportContent,
            @RequestPart("reportDate") String reportDate,
            @RequestPart("repoStartTime") String repoStartTime,
            @RequestPart("repoEndTime") String repoEndTime,
            @RequestPart("reportId") Long reportId,
            @RequestPart("saveDraftDate") String saveDraftDate,
            @RequestPart("selectedApprovers") String selectedApproversJson,
            @RequestPart("selectedReferences") String selectedReferencesJson,
            @RequestPart("selectedReceivers") String selectedReceiversJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        try {
            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 조회
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
            int repoEmpNo = reportService.getUserEmpNo(empCode);

            // 데이터 저장을 위한 Map 생성
            Map<String, Object> reportData = reportService.prepareReportDataMap(
                    repoEmpNo, reportTitle, reportContent, reportDate, repoStartTime, repoEndTime, reportId,
                    "submitted", selectedApproversJson, selectedReferencesJson, selectedReceiversJson, files);

            // 결재 상신을 위한 서비스 호출
            reportService.submitReportForApproval(reportData);

            return ResponseEntity.ok("Report submitted successfully.");

        } catch (Exception e) {
            log.error("Error submitting work report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit report: " + e.getMessage());
        }
    }
}

    @PostMapping("/saveasdraft")
    public ResponseEntity<EmployeeDTO> saveAsDraftReport (@RequestBody ReportDTO reportDTO) {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("saveAsDraftReport - emp_code : " + emp_code);
        System.out.println("saveAsDraftReport - reportDTO : " + reportDTO);

        int res = reportService.AddSaveAsDraftReportData(reportDTO);

        return ResponseEntity.ok(new EmployeeDTO());
    }

