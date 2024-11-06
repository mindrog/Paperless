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
    @PostMapping("/saveasdraft")
    public ResponseEntity<?> saveAsDraftReport(@RequestPart("reportData") String reportDataJson,
                                               @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            // JSON 문자열을 ReportRequest 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            ReportRequest reportRequest = objectMapper.readValue(reportDataJson, ReportRequest.class);

            // reportId 조회
            Long reportId = reportRequest.getReportId();
            System.out.println("controller reportId : " + reportId);

            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 조회
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
            int repoEmpNo = reportService.getUserEmpNo(empCode);

            // 데이터 저장을 위한 Map 생성
            Map<String, Object> reportData = new HashMap<>();
            reportData.put("repoEmpNo", repoEmpNo);
            reportData.put("reportTitle", reportRequest.getReportTitle());
            reportData.put("reportContent", reportRequest.getReportContent());
            reportData.put("reportDate", reportRequest.getReportDate());
            reportData.put("repoStartTime", reportRequest.getRepoStartTime());
            reportData.put("repoEndTime", reportRequest.getRepoEndTime());
            reportData.put("reportId", reportId);
            reportData.put("status", "saved");
            reportData.put("selectedApprovers", reportRequest.getSelectedApprovers());
            reportData.put("selectedReferences", reportRequest.getSelectedReferences());
            reportData.put("selectedReceivers", reportRequest.getSelectedReceivers());

//            if (files != null && !files.isEmpty()) {
//                reportService.saveFiles(reportId, files);
//            }

            // 서비스 호출로 임시 저장 및 reportId 반환
            Long report_Id = reportService.addSaveAsDraftReportData(reportData);

            return ResponseEntity.ok(Map.of("message", "Draft saved successfully", "reportId", report_Id));
        } catch (Exception e) {
            log.error("Error saving draft report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving draft: " + e.getMessage());
        }
    }

    // 보고서 결재 상신 엔드포인트
    @PostMapping(value = "/saveworkreport", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> submitWorkReport(
            @RequestPart("reportData") String reportDataJson, // JSON 데이터를 포함한 DTO
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ReportRequest reportRequest = objectMapper.readValue(reportDataJson, ReportRequest.class);

            // reportId 조회
            Long reportId = reportRequest.getReportId();
            System.out.println("controller reportId : " + reportId);

            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 조회
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
            int repoEmpNo = reportService.getUserEmpNo(empCode);

            // 데이터 저장을 위한 Map 생성
            Map<String, Object> reportData = new HashMap<>();
            reportData.put("repoEmpNo", repoEmpNo);
            reportData.put("reportTitle", reportRequest.getReportTitle());
            reportData.put("reportContent", reportRequest.getReportContent());
            reportData.put("reportDate", reportRequest.getReportDate());
            reportData.put("repoStartTime", reportRequest.getRepoStartTime());
            reportData.put("repoEndTime", reportRequest.getRepoEndTime());
            reportData.put("reportId", reportId);
            reportData.put("status", "submitted");
            reportData.put("selectedApprovers", reportRequest.getSelectedApprovers());
            reportData.put("selectedReferences", reportRequest.getSelectedReferences());
            reportData.put("selectedReceivers", reportRequest.getSelectedReceivers());

//            if (files != null && !files.isEmpty()) {
//                reportService.saveFiles(reportId, files);
//            }

            System.out.println("reportData 내용:");
            for (Map.Entry<String, Object> entry : reportData.entrySet()) {
                System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue() + ", Type: " + (entry.getValue() != null ? entry.getValue().getClass().getName() : "null"));
            }

            // 결재 상신을 위한 서비스 호출
            reportService.submitReportForApproval(reportData);

            return ResponseEntity.ok("Report submitted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit report: " + e.getMessage());
        }
    }

    // 보고서 상세 페이지
    @GetMapping("/report/{reportId}")
    public ReportDTO getReport(@PathVariable Long reportId) {

        ReportDTO report = reportService.selectReportById(reportId);
        System.out.println("controller reportId : " + reportId);
        System.out.println("getReport report : " + report);

        return report;
    }
}
