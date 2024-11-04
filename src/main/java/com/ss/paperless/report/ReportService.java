package com.ss.paperless.report;

import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.employee.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ResourceLoader resourceLoader;

    // 파일 저장 디렉토리 경로를 application.properties에서 불러옴
    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * 업로드 경로를 가져오고 존재하지 않으면 디렉토리를 생성합니다.
     * @return Path 업로드 경로
     */
    private Path getUploadPath() throws IOException {
        Resource resource = resourceLoader.getResource(uploadDir);
        Path path = Paths.get(resource.getURI());
        if (!Files.exists(path)) {
            Files.createDirectories(path); // 디렉토리 생성
        }
        return path;
    }

    /**
     * 사용자 정보 조회 메서드
     * @param empCode 사용자 코드
     * @return EmployeeEntity 사용자 엔티티 정보
     */
    public EmployeeEntity getUserInfo(String empCode) {
        return employeeRepository.findByEmpCode(empCode);
    }

    /**
     * 사용자 emp_no 조회 메서드
     * @param empCode 사용자 코드
     * @return int 사용자 emp_no
     */
    public int getUserEmpNo(String empCode) {
        return employeeRepository.findEmpNoByEmpCode(empCode);
    }

    /**
     * 보고서 데이터 준비 메서드
     * @param repoEmpNo 보고서 소유자 ID
     * @param reportTitle 보고서 제목
     * @param reportContent 보고서 내용
     * @param reportDate 보고서 작성 날짜
     * @param repoStartTime 시작 시간
     * @param repoEndTime 종료 시간
     * @param reportStatus 보고서 상태 ("saved" 또는 "submitted")
     * @param selectedApproversJson 결재자 목록 JSON
     * @param selectedReferencesJson 참조자 목록 JSON
     * @param selectedReceiversJson 수신자 목록 JSON
     * @param files 첨부 파일 목록
     * @return Map 보고서 데이터
     */
    public Map<String, Object> prepareReportDataMap(int repoEmpNo, String reportTitle, String reportContent, String reportDate,
                                                    String repoStartTime, String repoEndTime, Long reportId, String reportStatus,
                                                    String selectedApproversJson, String selectedReferencesJson, String selectedReceiversJson,
                                                    List<MultipartFile> files) {
        Map<String, Object> reportData = new HashMap<>();
        reportData.put("repo_emp_no", repoEmpNo);
        reportData.put("reportId", reportId);
        reportData.put("reportTitle", reportTitle);
        reportData.put("reportContent", reportContent);
        reportData.put("reportDate", reportDate);
        reportData.put("repoStartTime", repoStartTime);
        reportData.put("repoEndTime", repoEndTime);
        reportData.put("reportStatus", reportStatus);
        reportData.put("selectedApprovers", selectedApproversJson);
        reportData.put("selectedReferences", selectedReferencesJson);
        reportData.put("selectedReceivers", selectedReceiversJson);

        // 첨부 파일 저장 로직
        if (files != null && !files.isEmpty()) {
            List<Map<Object, Object>> attachments = saveAttachments(files);
            reportData.put("attachments", attachments);
        }

        return reportData;
    }

    /**
     * 보고서 임시 저장 메서드
     * @param reportData 보고서 데이터
     * @return Long 저장된 보고서 ID
     */
    public Long addSaveAsDraftReportData(Map<String, Object> reportData) {
        reportMapper.AddReportData(reportData);
        Long reportId = ((BigInteger) reportData.get("repo_no")).longValue(); // 생성된 repo_no 사용
        reportData.put("repo_no", reportId); // 다음 작업을 위해 ID를 다시 저장
        return reportId;
    }

    /**
     * 결재 상신 로직
     * @param reportData 결재 데이터
     */
    public void submitReportForApproval(Map<String, Object> reportData) {
        Long reportId = (Long) reportData.get("repo_no");
        String reportStatus = (String) reportData.get("reportStatus");

        System.out.println("reportId : " + reportId);
        System.out.println("reportStatus : " + reportStatus);

        reportMapper.updateReportStatus(reportId, "submitted");

        List<Map<String, Object>> approvers = reportMapper.getApproversByReportId(reportId);
        for (int i = 0; i < approvers.size(); i++) {
            String status = (i == 0) ? "pending" : "waiting"; // 첫 번째 결재자만 "pending" 설정
            approvers.get(i).put("appr_status", status);
            reportMapper.updateApproverStatus(approvers.get(i)); // 각 결재자의 상태 업데이트
        }
    }

    /**
     * 파일 첨부 저장 로직
     * @param files 첨부 파일 목록
     * @return List<Map<Object, Object>> 파일 정보 리스트
     */
    private List<Map<Object, Object>> saveAttachments(List<MultipartFile> files) {
        List<Map<Object, Object>> attachments = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Path filePath = getUploadPath().resolve(file.getOriginalFilename());
                Files.write(filePath, file.getBytes());

                Map<Object, Object> attachment = new HashMap<>();
                attachment.put("fileName", file.getOriginalFilename());
                attachment.put("filePath", filePath.toString());
                attachment.put("fileSize", file.getSize());
                attachments.add(attachment);
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to save attachment file", e);
            }
        }
        return attachments;
    }
}
