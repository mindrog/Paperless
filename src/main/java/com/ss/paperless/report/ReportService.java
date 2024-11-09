package com.ss.paperless.report;

import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.employee.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;
import java.util.Date;

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
    public EmployeeDTO getUserInfo(String empCode) {
        return reportMapper.findByEmpCode(empCode);
    }

    /**
     * 사용자 emp_no 조회 메서드
     * @param empCode 사용자 코드
     * @return int 사용자 emp_no
     */
    public Integer getUserEmpNo(String empCode) {
        Integer res = employeeRepository.findEmpNoByEmpCode(empCode);
        System.out.println("res : " + res);
        return res;
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
        System.out.println("reportId : " + reportId);
        System.out.println("reportData : " + reportData);
        reportMapper.AddWorkReportData(reportData); // workReport
        return reportId;
    }

    /**
     * 보고서 파일 임시 저장 메서드
     * @param reportId 보고서 데이터
     * @param files 파일 데이터
     */
    public void saveFiles(Long reportId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        for (MultipartFile file : files) {
            try {
                // 파일 이름과 경로 설정
                String originalFilename = file.getOriginalFilename();
                Path uploadPath = getUploadPath();

                // 경로가 없으면 디렉토리 생성
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(originalFilename);

                // 파일을 디렉토리에 저장
                file.transferTo(filePath.toFile());

                // 파일 정보를 AttachmentDTO에 설정
                AttachmentDTO attachment = new AttachmentDTO();
                attachment.setAttaKey(originalFilename);
                attachment.setAttaUrl(filePath.toAbsolutePath().toString());
                attachment.setAttaOriginalName(originalFilename);
                attachment.setAttaSize(file.getSize());

                // Attachment 테이블에 삽입
                reportMapper.insertAttachment(attachment);

                // ReportAttachment 테이블에 삽입 (reportId와 연관된 파일)
                reportMapper.insertReportAttachment(reportId, attachment.getAttaNo());

            } catch (IOException e) {
                throw new RuntimeException("Failed to store file " + file.getOriginalFilename() + " at path: "
//                        +  file.getuploadPath,
                        , e);
            }
        }
    }

    // 파일 저장 경로를 설정하는 메서드
//    private Path getUploadPath() {
//        try {
//            // resources 디렉토리 아래에 경로 생성
//            Path path = Paths.get("src/main/resources/upload/directory");
//
//            // 디렉토리가 없으면 생성
//            if (!Files.exists(path)) {
//                Files.createDirectories(path);
//            }
//            return path;
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to get or create upload path", e);
//        }
//    }

    /**
     * 문서 코드 생성 메서드.
     * @param reportId 보고서 ID
     * @param type 문서 유형 (예: "TYPE")
     * @return 생성된 문서 코드 (형식: TYPE-YYYYMMDD-####)
     */
    public static String generateDocumentCode(Long reportId, String type) {
        String datePart = new SimpleDateFormat("yyyyMMdd").format(new Date()); // YYYYMMDD 형식의 날짜
        String idPart = String.format("%04d", reportId % 10000); // 일련번호 (ID의 마지막 네 자리, 필요에 따라 변경 가능)

        return type + "-" + datePart + "-" + idPart;
    }

    /**
     * 결재 상신 로직
     * @param reportData 결재 데이터
     */
    public void submitReportForApproval(Map<String, Object> reportData) {
        try {
            // 1. Report ID 가져오기 및 상태 설정
            Long reportId = (Long) reportData.get("reportId");
            reportData.put("repo_no", reportId);

            System.out.println("Starting approval process for reportId: " + reportId);

            // 2. 문서 코드 생성 및 추가
            String reportType = reportMapper.getReportTypeById(reportId);
            String documentCode = generateDocumentCode(reportId, reportType);
            reportData.put("documentCode", documentCode);

            System.out.println("Starting approval process for reportId: " + reportId + ", documentCode: " + documentCode);

            // 3. 결재 데이터 저장
            reportMapper.AddReportData(reportData);
            System.out.println("AddReportData mapper method 실행");
            reportMapper.AddWorkReportData(reportData);
            System.out.println("AddWorkReportData mapper method 실행");
            System.out.println("Work report data added for reportId: " + reportId);

            // 4. 보고서 상태를 'submitted'로 업데이트
            Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", "submitted");

            reportMapper.updateReportStatus(params);

            System.out.println("Report status updated to 'submitted' for reportId: " + reportId);

            // 5. 결재자, 참조자, 수신자 목록을 Map으로 변환하여 처리

            // 결재자 목록 변환
            List<EmployeeDTO> approversList = (List<EmployeeDTO>) reportData.get("selectedApprovers");
            List<Map<String, Object>> approversMapList = new ArrayList<>();
            for (EmployeeDTO approver : approversList) {
                Map<String, Object> approverMap = new HashMap<>();
                approverMap.put("appr_emp_no", approver.getEmp_no());
                approverMap.put("appr_dept_no", approver.getEmp_dept_no());
                approverMap.put("appr_delegate", approver.getAppr_delegate());
                approversMapList.add(approverMap);
            }
            saveApprovers(reportId, approversMapList);

            // 참조자 목록 변환
            List<EmployeeDTO> referencesList = (List<EmployeeDTO>) reportData.get("selectedReferences");
            List<Map<String, Object>> referencesMapList = new ArrayList<>();
            for (EmployeeDTO reference : referencesList) {
                Map<String, Object> referenceMap = new HashMap<>();
                referenceMap.put("refe_emp_no", reference.getEmp_no());
                referenceMap.put("refe_dept_no", reference.getEmp_dept_no());
                referencesMapList.add(referenceMap);
            }
            saveReferences(reportId, referencesMapList);

            // 수신자 목록 변환
            List<EmployeeDTO> receiversList = (List<EmployeeDTO>) reportData.get("selectedReceivers");
            List<Map<String, Object>> receiversMapList = new ArrayList<>();
            for (EmployeeDTO receiver : receiversList) {
                Map<String, Object> receiverMap = new HashMap<>();
                receiverMap.put("reci_emp_no", receiver.getEmp_no());
                receiverMap.put("reci_dept_no", receiver.getEmp_dept_no());
                receiversMapList.add(receiverMap);
            }
            saveRecipients(reportId, receiversMapList);

            System.out.println("Approval process completed for reportId: " + reportId);

        } catch (Exception e) {
            System.err.println("Error during report approval process: " + e.getMessage());
            e.printStackTrace();
        }
    }



    // 결재자(saveApprovers) 데이터 저장 로직
        private void saveApprovers(Long reportId, List<Map<String, Object>> approvers) {
            for (int i = 0; i < approvers.size(); i++) {
                Map<String, Object> approverData = approvers.get(i);
                approverData.put("appr_repo_no", reportId);
                approverData.put("appr_order", i + 1);
                approverData.put("appr_status", i == 0 ? "pending" : "waiting"); // 첫 번째 결재자는 "pending", 나머지는 "waiting"
                reportMapper.insertApprover(approverData);
            }
        }

        // 참조자(saveReferences) 데이터 저장 로직
        private void saveReferences(Long reportId, List<Map<String, Object>> references) {
            for (Map<String, Object> referenceData : references) {
                referenceData.put("refe_repo_no", reportId);
                reportMapper.insertReference(referenceData);
            }
        }

        // 수신자(saveRecipients) 데이터 저장
        private void saveRecipients(Long reportId, List<Map<String, Object>> recipients) {
            for (Map<String, Object> recipientData : recipients) {
                recipientData.put("reci_repo_no", reportId);
                reportMapper.insertRecipient(recipientData);
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

    /**
     * 상세 페이지 조회
     * @param reportId
     * @return ReportDTO
     */
    public ReportDTO selectReportById(Long reportId) {
        return reportMapper.selectReportById(reportId);
    }

    public Map<Long, ReportDTO> selectReportListByDeptNo(Long deptNo) {

        Map<Long, ReportDTO> reportsMap = new HashMap<>();

        List<ReportDTO> workReports = reportMapper.selectWorkReports(deptNo);
        workReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> attendanceReports  = reportMapper.selectAttenReports(deptNo);
        attendanceReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> purchaseReports  = reportMapper.selectPurcReports(deptNo);
        purchaseReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        return reportsMap;
    }

    // 상세 보고서 내에 결재자, 수신자, 참조자 정보 조회
    public ReportDTO selectReportApprsInfoById(Long reportId) {
        // ReportDTO 객체 생성
        ReportDTO reportDTO = new ReportDTO();

        // Mapper를 통해 결재자, 수신자, 참조자 정보를 가져옴
        List<ApproverDTO> approverInfo = reportMapper.selectReportApprsInfoById(reportId);
        List<RecipientDTO> reciInfo = reportMapper.selectReportRecisInfoById(reportId);
        List<ReferenceDTO> refeInfo = reportMapper.selectReportRefesInfoById(reportId);

        // ReportDTO에 reportId와 각 정보를 설정
        reportDTO.setRepo_no(Math.toIntExact(reportId));
        reportDTO.setApproverInfo(approverInfo);
        reportDTO.setRecipientInfo(reciInfo);
        reportDTO.setReferenceInfo(refeInfo);

        return reportDTO;
    }


    // 상신 취소
    public boolean cancelSubmission(Long reportId, String empCode) {
        // 작성자 확인 및 상태 확인
        Integer repoEmpNo = reportMapper.getReportEmpNo(reportId);
        if (repoEmpNo != null && repoEmpNo.equals(reportMapper.getEmpNoByCode(empCode))) {
            // 상신 취소 처리

            Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", "canceled");

            int updated = reportMapper.updateReportStatus(params);

            return updated > 0;
        }
        return false;
    }

    // 회수
    public boolean retrieveReport(Long reportId, String empCode) {
        // 작성자 확인 및 상태 확인
        Integer repoEmpNo = reportMapper.getReportEmpNo(reportId);
        if (repoEmpNo != null && repoEmpNo.equals(reportMapper.getEmpNoByCode(empCode))) {
            // 회수 처리
            Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", "retrieved");

            int updated = reportMapper.updateReportStatus(params);
            return updated > 0;
        }
        return false;
    }

    // 승인
    public boolean approveReport(Long reportId, String empCode) {
        // 결재자 확인 및 상태 확인
        Integer approverEmpNo = reportMapper.getApproverEmpNo(reportId);
        if (approverEmpNo != null && approverEmpNo.equals(reportMapper.getEmpNoByCode(empCode))) {
            // 승인 처리
            Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", "approved");

            int updated = reportMapper.updateReportStatus(params);
            return updated > 0;
        }
        return false;
    }

    // 반려
    public boolean rejectReport(Long reportId, String empCode, String rejectionReason) {
        // 결재자 확인 및 상태 확인
        Integer approverEmpNo = reportMapper.getApproverEmpNo(reportId);
        if (approverEmpNo != null && approverEmpNo.equals(reportMapper.getEmpNoByCode(empCode))) {
            // 반려 처리
            Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", "rejected");
            params.put("rejectionReason", rejectionReason);

            int updated = reportMapper.rejectReport(params);
            return updated > 0;
        }
        return false;
    }

    // 임시 저장함
    public Map<Long, ReportDTO> selectDraftAsSaveDocList(Long deptNo, Long empNo) {

        // 변수 넘기기
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("deptNo", deptNo);
        param.put("empNo", empNo);

        // 리스트 저장할 map
        Map<Long, ReportDTO> reportsMap = new HashMap<>();

        List<ReportDTO> workReports = reportMapper.selectDraftAsSaveWorkReports(param);
        workReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> attendanceReports  = reportMapper.selectDraftAsSaveAttenReports(param);
        attendanceReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> purchaseReports  = reportMapper.selectDraftAsSavePurcReports(param);
        purchaseReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        return reportsMap;
    }

    // 결재 대기함
    public Map<Long, ReportDTO> selectPendingDocList(Long deptNo, Long empNo) {

        // 변수 넘기기
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("deptNo", deptNo);
        param.put("empNo", empNo);

        // 리스트 저장할 map
        Map<Long, ReportDTO> reportsMap = new HashMap<>();

        List<ReportDTO> workReports = reportMapper.selectPendingDocWorkReports(param);
        workReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> attendanceReports  = reportMapper.selectPendingDocAttenReports(param);
        attendanceReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> purchaseReports  = reportMapper.selectPendingDocPurcReports(param);
        purchaseReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        return reportsMap;
    }

    // 내 문서함
    public Map<Long, ReportDTO> selectMyDocList(Long empNo) {

        // 리스트 저장할 map
        Map<Long, ReportDTO> reportsMap = new HashMap<>();

        List<ReportDTO> workReports = reportMapper.selectMyDocWorkReports(empNo);
        workReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> attendanceReports  = reportMapper.selectMyDocAttenReports(empNo);
        attendanceReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> purchaseReports  = reportMapper.selectMyDocPurcReports(empNo);
        purchaseReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        return reportsMap;
    }
}
