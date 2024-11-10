package com.ss.paperless.report;

import com.amazonaws.services.dynamodbv2.xspec.S;
import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.EmployeeService;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
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

    @Autowired
    private EmployeeService employeeService;

    private final String uploadDir = "uploads/"; // 파일 저장 디렉토리 경로
    @Autowired
    private ReportMapper reportMapper;

    // 사용자 정보 조회
    @GetMapping("/getUserInfo")
    public EmployeeDTO getUserInfo() {
        // 현재 인증된 사용자의 emp_code를 가져옴
        String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
        // 서비스에서 사용자 정보 조회
        EmployeeDTO userInfo = reportService.getUserInfo(empCode);
        System.out.println("userInfo : " + userInfo);
        return userInfo;
    }

    // 보고서 임시 저장 엔드포인트
    @PostMapping("/saveasdraft")
    public ResponseEntity<?> saveAsDraftReport(@RequestPart("reportData") String reportDataJson,
                                               @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ReportRequest reportRequest = objectMapper.readValue(reportDataJson, ReportRequest.class);

            // reportId 조회
            Long reportId = reportRequest.getReportId();
            System.out.println("saveasdraft controller reportId : " + reportId);

            // DateTimeFormatter 설정
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy. MM. dd. a hh:mm", Locale.KOREAN);
            DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            String reportDateStr = reportRequest.getReportDate();
            LocalDateTime reportDateTime = LocalDateTime.parse(reportDateStr, inputFormatter);
            String formattedDate = reportDateTime.format(outputFormatter);
            System.out.println("formattedDate : " + formattedDate);

            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 조회
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
            int repoEmpNo = reportService.getUserEmpNo(empCode);

            // 다른 데이터 설정
            Map<String, Object> reportData = new HashMap<>();
            reportData.put("repoEmpNo", repoEmpNo);
            reportData.put("reportDate", formattedDate);
            reportData.put("repoStartTime",reportRequest.getRepoStartTime());
            reportData.put("repoEndTime",reportRequest.getRepoEndTime());
            reportData.put("reportTitle", reportRequest.getReportTitle());
            reportData.put("reportContent", reportRequest.getReportContent());

            Map<String, List<EmployeeDTO>> selectData = new HashMap<>();
            selectData.put("approvers",reportRequest.getSelectedApprovers());
            selectData.put("receivers",reportRequest.getSelectedReceivers());
            selectData.put("references",reportRequest.getSelectedReferences());

            System.out.println("selectData : " + selectData);

            // 서비스 호출
            Long report_Id = reportService.addSaveAsDraftReportData(reportData, selectData);

            return ResponseEntity.ok(Map.of("message", "Draft saved successfully", "reportId", report_Id));
        } catch (Exception e) {
            log.error("Error saving draft report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving draft: " + e.getMessage());
        }
    }

    // 보고서 결재 상신 엔드포인트
    @PostMapping("/submitApproval/{reportId}")
    public ResponseEntity<?> submitApproval(@PathVariable Long reportId) {
        try {
            reportService.UpdateReportStatus(reportId);

            return ResponseEntity.ok(Map.of("message", "Report successfully submitted"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit report", "message", e.getMessage()));
        }
    }

//    @PostMapping(value = "/saveworkreport/{reportId}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
//    public ResponseEntity<?> submitWorkReport(
//            @RequestPart("reportData") String reportDataJson, // JSON 데이터를 포함한 DTO
//            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
//
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            ReportRequest reportRequest = objectMapper.readValue(reportDataJson, ReportRequest.class);
//
//            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy. MM. dd. a hh:mm", Locale.KOREAN);
//            DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//
//            String reportDateStr = reportRequest.getReportDate();
//            LocalDateTime reportDateTime = LocalDateTime.parse(reportDateStr, inputFormatter);
//            String formattedDate = reportDateTime.format(outputFormatter);
//            System.out.println("formattedDate : " + formattedDate);
//
//            // reportId 조회
//            Long reportId = reportRequest.getReportId();
//            System.out.println("controller reportId : " + reportId);
//
//            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 조회
//            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();
//            int repoEmpNo = reportService.getUserEmpNo(empCode);
//
//            // 데이터 저장을 위한 Map 생성
//            Map<String, Object> reportData = new HashMap<>();
//            reportData.put("repoEmpNo", repoEmpNo);
//            reportData.put("reportTitle", reportRequest.getReportTitle());
//            reportData.put("reportContent", reportRequest.getReportContent());
//            reportData.put("reportDate", formattedDate);
//            reportData.put("repoStartTime", reportRequest.getRepoStartTime());
//            reportData.put("repoEndTime", reportRequest.getRepoEndTime());
//            reportData.put("reportId", reportId);
//            reportData.put("repo_status", "submitted");
//            reportData.put("approvers", reportRequest.getSelectedApprovers());
//            reportData.put("references", reportRequest.getSelectedReferences());
//            reportData.put("receivers", reportRequest.getSelectedReceivers());
//
//            Map<String, List<EmployeeDTO>> selectData = new HashMap<>();
//            selectData.put("approvers",reportRequest.getSelectedApprovers());
//            selectData.put("receivers",reportRequest.getSelectedReceivers());
//            selectData.put("references",reportRequest.getSelectedReferences());
//
//            System.out.println("selectData : " + selectData);
//
//            // 결재 상신을 위한 서비스 호출
//            reportService.submitReportForApproval(reportData, selectData);
//
//            // JSON 형식으로 응답을 반환
//            return ResponseEntity.ok(Map.of("message", "Report submitted successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Failed to submit report", "message", e.getMessage()));
//        }
//    }

    // 보고서 내용 조회
    @GetMapping("/reportform/{reportId}")
    public ResponseEntity<ReportDTO> getReportForm(@PathVariable Long reportId) {
        System.out.println("getReport reportId : " + reportId);

        ReportDTO selectReport = reportService.selectReportFormById(reportId);
        System.out.println("selectReport : " + selectReport);

        if (selectReport != null) {
            return ResponseEntity.ok(selectReport);  // 200 OK와 JSON 데이터 반환
        } else {
            return ResponseEntity.notFound().build();  // 404 Not Found 반환
        }
    }


    // 보고서 전체 목록
    @GetMapping("/getreportlist")
    public Map<Long, ReportDTO> getReportList() {

        // 현재 인증된 사용자의 emp_code를 가져옴
        String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

        // 서비스에서 사용자 정보 조회
        EmployeeDTO userInfo = reportService.getUserInfo(empCode);
        Long dept_no = userInfo.getEmp_dept_no();

        Map<Long, ReportDTO> reportsMap = reportService.selectReportListByDeptNo(dept_no);
        System.out.println("reportsMap : " + reportsMap);

        return reportsMap;
    }

    // 임시 저장함 목록
    @GetMapping("/getdraftassavelist")
    public Map<Long, ReportDTO> getDraftAsSaveList() {
        String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

        EmployeeDTO userInfo = reportService.getUserInfo(empCode);
        Long dept_no = userInfo.getEmp_dept_no();
        Long emp_no = userInfo.getEmp_no();

        Map<Long, ReportDTO> reportsMap = reportService.selectDraftAsSaveDocList(dept_no, emp_no);
        System.out.println("DraftAsSave ReportsMap : " + reportsMap);

        return reportsMap;
    }

    // 결재 대기함 목록
    @GetMapping("/getpendingdoclist")
    public Map<Long, ReportDTO> getPendingDocList() {
        String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

        EmployeeDTO userInfo = reportService.getUserInfo(empCode);
        Long dept_no = userInfo.getEmp_dept_no();
        Long emp_no = userInfo.getEmp_no();

        Map<Long, ReportDTO> reportsMap = reportService.selectPendingDocList(dept_no, emp_no);
        System.out.println("PendingDoc ReportsMap : " + reportsMap);

        return reportsMap;
    }

    // 내 문서함 목록
    @GetMapping("/getmydoclist")
    public Map<Long, ReportDTO> getMyDocList() {
        String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

        EmployeeDTO userInfo = reportService.getUserInfo(empCode);
        Long emp_no = userInfo.getEmp_no();

        Map<Long, ReportDTO> reportsMap = reportService.selectMyDocList(emp_no);
        System.out.println("MyDoc ReportsMap : " + reportsMap);

        return reportsMap;
    }


    // 보고서 상세 페이지
    @GetMapping("/report/{reportId}")
    public ReportDTO getReport(@PathVariable Long reportId) {

        ReportDTO report = reportService.selectReportById(reportId);
        System.out.println("controller reportId : " + reportId);
        System.out.println("getReport report : " + report);

        return report;
    }

    // 보고서 상세 페이지 작성자 정보
    @GetMapping("/apprsinfo/{reportId}")
    public ReportDTO getReportInfo(@PathVariable Long reportId) {
        ReportDTO report = reportService.selectReportApprsInfoById(reportId);
        return report;
    }

    // 상신 취소
    @PostMapping("/cancel/{reportId}")
    public ResponseEntity<?> cancelSubmission(@PathVariable Long reportId) {
        try {
            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 확인
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

            // 상신 취소를 위한 서비스 호출
            boolean success = reportService.cancelSubmission(reportId, empCode);

            if (success) {
                System.out.println("상신 취소 success");
                return ResponseEntity.ok("Submission canceled successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to cancel this submission.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to cancel submission: " + e.getMessage());
        }
    }

    // 회수
    @PostMapping("/retrieve/{reportId}")
    public ResponseEntity<?> retrieveReport(@PathVariable Long reportId) {
        try {
            // 현재 인증된 사용자의 emp_code로 보고서 작성자 ID 확인
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

            // 회수를 위한 서비스 호출
            boolean success = reportService.cancelSubmission(reportId, empCode);

            if (success) {
                System.out.println("회수 success");
                return ResponseEntity.ok("Report retrieved successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to retrieve this report.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve report: " + e.getMessage());
        }
    }

    // 승인
    @PostMapping("/approve/{reportId}")
    public ResponseEntity<?> approveReport(@PathVariable Long reportId) {
        try {
            // 현재 인증된 사용자의 emp_code로 결재자 ID 확인
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

            reportService.approveReport(reportId, empCode);

            return ResponseEntity.ok("Report approved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to approve report: " + e.getMessage());
        }
    }

    // 반려
    @PostMapping("/reject/{reportId}")
    public ResponseEntity<?> rejectReport(@PathVariable Long reportId, @RequestBody Map<String, String> requestBody) {
        try {
            // 현재 인증된 사용자의 emp_code로 결재자 ID 확인
            String empCode = SecurityContextHolder.getContext().getAuthentication().getName();

            // 반려 사유 가져오기
            String rejectionReason = requestBody.get("reason");

            // 반려를 위한 서비스 호출
            boolean success = reportService.rejectReport(reportId, empCode, rejectionReason);

            if (success) {
                System.out.println("반려 success");
                return ResponseEntity.ok("Report rejected successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to reject this report.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to reject report: " + e.getMessage());
        }
    }
}
