package com.ss.paperless.report;

import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RequestPart;

import com.ss.paperless.employee.EmployeeDTO;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

//    @Value("${file.upload-dir}")
    private String uploadDir; // 파일 저장 디렉토리 경로

    @GetMapping("/getUserInfo")
    public ResponseEntity<EmployeeDTO> getUserInfo() {
        String emp_code =  SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("emp_code : " + emp_code);

        EmployeeEntity userInfo = reportService.getUserInfo(emp_code);

        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setEmp_code(userInfo.getEmpCode());
        employeeDTO.setEmp_name(userInfo.getEmpName());
        employeeDTO.setEmp_dept_no(userInfo.getEmpDeptNo());
        employeeDTO.setDept_name(userInfo.getDepartment().getDeptName());
        employeeDTO.setDept_team_name(userInfo.getDepartment().getDeptTeamName());

        System.out.println("ResponseEntity content: " + employeeDTO.toString());

        return ResponseEntity.ok(employeeDTO);
    }

    // 임시 저장
    @PostMapping(value = "/saveasdraft", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveAsDraftReport(
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
            // JSON 파싱용 ObjectMapper
            ObjectMapper objectMapper = new ObjectMapper();
            List<EmployeeDTO> approvers = objectMapper.readValue(selectedApproversJson, new TypeReference<>() {});

            // Map에 모든 데이터를 저장
            Map<String, Object> reportData = new HashMap<>();
            reportData.put("reportTitle", reportTitle);
            reportData.put("reportContent", reportContent);
            reportData.put("reportDate", reportDate);
            reportData.put("repoStartTime", repoStartTime);
            reportData.put("repoEndTime", repoEndTime);
            reportData.put("reportStatus", reportStatus);
            reportData.put("selectedApprovers", approvers);
            reportData.put("selectedReferences", selectedReferencesJson);
            reportData.put("selectedReceivers", selectedReceiversJson);

            // 파일 저장 및 파일 정보 리스트 생성
            List<Map<Object, Object>> attachments = new ArrayList<>();
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    Path filePath = Paths.get(uploadDir, file.getOriginalFilename());
                    Files.write(filePath, file.getBytes());

                    Map<Object, Object> attachment = new HashMap<>();
                    attachment.put("fileName", file.getOriginalFilename());
                    attachment.put("filePath", filePath.toString());
                    attachment.put("fileSize", file.getSize());
                    attachments.add(attachment);
                }
            }
            reportData.put("attachments", attachments);

            // 서비스 호출: 임시 저장 및 reportId 반환
            Long reportId = reportService.AddSaveAsDraftReportData(reportData);

            return ResponseEntity.ok(Map.of("message", "Draft saved successfully", "reportId", reportId));

        } catch (Exception e) {
            log.error("Error saving draft report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving draft: " + e.getMessage());
        }
    }

    // 결재 상신
    @PostMapping(value = "/saveworkreport", consumes = {"multipart/form-data"})
    public ResponseEntity<?> saveWorkReport(
            @RequestPart("reportTitle") String reportTitle,
            @RequestPart("reportContent") String reportContent,
            @RequestPart("reportDate") String reportDate,
            @RequestPart("repoStartTime") String repoStartTime,
            @RequestPart("repoEndTime") String repoEndTime,
            @RequestPart("reportStatus") String reportStatus,
            @RequestPart("saveDraftDate") String saveDraftDate,
            @RequestPart("selectedApprovers") String selectedApproversJson,
            @RequestPart("selectedReferences") String selectedReferencesJson,
            @RequestPart("selectedReceivers") String selectedReceiversJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        try {

            Map<String, Object> reportData = new HashMap<String, Object>();

            reportData.put("reportTitle", reportTitle);
            reportData.put("reportContent", reportContent);
            reportData.put("reportDate", reportDate);
            reportData.put("repoStartTime", repoStartTime);
            reportData.put("repoEndTime", repoEndTime);
            reportData.put("reportStatus", reportStatus);
            reportData.put("saveDraftDate", saveDraftDate);
            reportData.put("selectedApprovers", selectedApproversJson);
            reportData.put("selectedReferences", selectedReferencesJson);
            reportData.put("selectedReceivers", selectedReceiversJson);
            reportData.put("files", files);


            // 서비스 계층으로 데이터 전달
            reportService.saveWorkReport(reportData);

            // 저장 성공 시 응답
            return ResponseEntity.ok("Report saved successfully.");

        } catch (Exception e) {
            // 예외 발생 시 에러 응답
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to save report: " + e.getMessage());
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


}
