package com.ss.paperless.report;

import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.EmployeeMapper;
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
import java.time.LocalDateTime;
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
    private EmployeeMapper employeemapper;


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
    public Long addSaveAsDraftReportData(Map<String, Object> reportData, Map<String, List<EmployeeDTO>> selectData) {

        // 임시 저장 타입
        reportData.put("repo_status", "saved");

        // 보고서 데이터 저장
        reportMapper.AddReportData(reportData);

        // 생성된 repo_no를 사용하여 reportId 설정
        Long reportId = ((BigInteger) reportData.get("repo_no")).longValue();
        reportData.put("repo_no", reportId);

        System.out.println("reportId : " + reportId);
        System.out.println("reportData : " + reportData);

        // 작업 보고서 데이터 저장
        reportMapper.AddWorkReportData(reportData);

        System.out.println("selectData : " + selectData);

        // 결재자 저장
        Map<String, Object> selectApprovers = new HashMap<>();
        selectApprovers.put("reportId" , reportId);
        selectApprovers.put("approvers" , selectData.get("approvers"));

        // 결재 type 확인
        List<EmployeeDTO> approvers = (List<EmployeeDTO>) selectData.get("approvers");

        // 순차적으로 appr_status 값을 설정
        for (int i = 0; i < approvers.size(); i++) {

            String approvalType = approvers.get(i).getApprovalType(); // approvalType 필드 값 추출

            Map<String, Object> params = new HashMap<>();
            params.put("reportId" , reportId);
            params.put("emp_no" , approvers.get(i).getEmp_no());
            params.put("emp_dept_no" , approvers.get(i).getEmp_dept_no());
            params.put("appr_order" , i+1);

            if(approvalType.equals("전결")) {
                params.put("appr_delegate" , 1);
            } else {
                params.put("appr_delegate" , 0);
            }

            if(i == 0) {
                params.put("appr_status" , "pending");
            } else {
                params.put("appr_status" , "waiting");
            }

            // 결재자 데이터 추가
            reportMapper.AddApproversData(params);
        }

        // 참조자 저장
        Map<String, Object> selectReferences = new HashMap<>();
        selectReferences.put("reportId" , reportId);

        // 부서코드 확인
        List<EmployeeDTO> references = (List<EmployeeDTO>) selectData.get("references");

        for (EmployeeDTO reference : references) {
            if (reference.getDeptName() != null) {

                String deptName = reference.getDeptName();
                String teamName = reference.getTeamName();

                Map<String, Object> parms = new HashMap<String, Object>();
                parms.put("deptName", deptName);
                parms.put("teamName", teamName);

                // 부서명과 팀명에 대응하는 dept_no 조회
                Long deptNo = employeemapper.findDeptNoByDeptAndTeamName(parms);
                reference.setDeptCode(deptNo); // 조회한 dept_no를 EmployeeDTO에 설정
            }

            System.out.println("Receiver emp_no: " + reference.getEmp_no());
            System.out.println("Receiver deptCode: " + reference.getDeptCode());
        }

        selectReferences.put("references" , selectData.get("references"));

        reportMapper.AddReferencesData(selectReferences);

        // 수신자 저장
        Map<String, Object> selectReceivers = new HashMap<>();
        selectReceivers.put("reportId" , reportId);

        // 부서코드 확인
        List<EmployeeDTO> receivers = (List<EmployeeDTO>) selectData.get("receivers");

        for (EmployeeDTO receiver : receivers) {
            if (receiver.getDeptName() != null) {

                String deptName = receiver.getDeptName();
                String teamName = receiver.getTeamName();

                Map<String, Object> parms = new HashMap<String, Object>();
                parms.put("deptName", deptName);
                parms.put("teamName", teamName);

                // 부서명과 팀명에 대응하는 dept_no 조회
                Long deptNo = employeemapper.findDeptNoByDeptAndTeamName(parms);
                receiver.setDeptCode(deptNo);
            }

            System.out.println("Receiver emp_no: " + receiver.getEmp_no());
            System.out.println("Receiver deptCode: " + receiver.getDeptCode());
        }

        selectReceivers.put("receivers" , selectData.get("receivers"));
        reportMapper.AddReceiversData(selectReceivers);

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
//     * @param reportData 결재 데이터
     * @param reportId 결재 데이터
     */
    public void UpdateReportStatus(Long reportId) {

        // 상태 업데이트
        Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", "submitted");
            params.put("submission_date", LocalDateTime.now());

        reportMapper.updateReportStatus(params);

        // 업데이트한 문서 다시 조회
        ReportDTO getReport = reportMapper.selectReportFormById(reportId);
        System.out.println("getReport : " + getReport);

    }
//    public void submitReportForApproval(Map<String, Object> reportData, Map<String, List<EmployeeDTO>> selectData) {
//        try {
//            // 1. Report ID 가져오기 및 상태 설정
//            Long reportId = (Long) reportData.get("reportId");
//            reportData.put("repo_no", reportId);
//
//            System.out.println("Starting approval process for reportId: " + reportId);
//
//            // 2. 결재 데이터 저장
//            reportMapper.AddReportData(reportData);
//            System.out.println("AddReportData mapper method 실행");
//            reportMapper.AddWorkReportData(reportData);
//            System.out.println("AddWorkReportData mapper method 실행");
//            System.out.println("Work report data added for reportId: " + reportId);
//
//            // 4. 보고서 상태를 'submitted'로 업데이트
//            Map<String, Object> params = new HashMap<>();
//            params.put("reportId", reportId);
//            params.put("status", "submitted");
//
//            reportMapper.updateReportStatus(params);
//
//            System.out.println("Report status updated to 'submitted' for reportId: " + reportId);
//
//            // 5. 결재자, 참조자, 수신자 목록을 Map으로 변환하여 처리
//            // 결재자 저장
//            Map<String, Object> selectApprovers = new HashMap<>();
//            selectApprovers.put("reportId" , reportId);
//            selectApprovers.put("approvers" , selectData.get("approvers"));
//
//            // 결재 type 확인
//            List<EmployeeDTO> approvers = (List<EmployeeDTO>) selectData.get("approvers");
//
//            // 순차적으로 appr_status 값을 설정
//            for (int i = 0; i < approvers.size(); i++) {
//                approvers.get(i).setAppr_order(i + 1); // 1부터 시작하도록 설정
//            }
//
//            for (EmployeeDTO approver : approvers) {
//                String approvalType = approver.getApprovalType(); // approvalType 필드 값 추출
//                System.out.println("Approval Type: " + approvalType);
//
//                if(approvalType.equals("전결")) {
//                    selectApprovers.put("appr_delegate" , 1);
//                } else {
//                    selectApprovers.put("appr_delegate" , 0);
//                }
//            }
//            reportMapper.AddApproversData(selectApprovers);
//
//            // 참조자 저장
//            Map<String, Object> selectReferences = new HashMap<>();
//            selectReferences.put("reportId" , reportId);
//
//            // 부서코드 확인
//            List<EmployeeDTO> references = (List<EmployeeDTO>) selectData.get("references");
//
//            for (EmployeeDTO reference : references) {
//                if (reference.getDeptName() != null) {
//
//                    String deptName = reference.getDeptName();
//                    String teamName = reference.getTeamName();
//
//                    Map<String, Object> parms = new HashMap<String, Object>();
//                    parms.put("deptName", deptName);
//                    parms.put("teamName", teamName);
//
//                    // 부서명과 팀명에 대응하는 dept_no 조회
//                    Long deptNo = employeemapper.findDeptNoByDeptAndTeamName(parms);
//                    reference.setDeptCode(deptNo); // 조회한 dept_no를 EmployeeDTO에 설정
//                }
//
//                System.out.println("Receiver emp_no: " + reference.getEmp_no());
//                System.out.println("Receiver deptCode: " + reference.getDeptCode());
//            }
//
//            selectReferences.put("references" , selectData.get("references"));
//
//            reportMapper.AddReferencesData(selectReferences);
//
//            // 수신자 저장
//            Map<String, Object> selectReceivers = new HashMap<>();
//            selectReceivers.put("reportId" , reportId);
//
//            // 부서코드 확인
//            List<EmployeeDTO> receivers = (List<EmployeeDTO>) selectData.get("receivers");
//
//            for (EmployeeDTO receiver : receivers) {
//                if (receiver.getDeptName() != null) {
//
//                    String deptName = receiver.getDeptName();
//                    String teamName = receiver.getTeamName();
//
//                    Map<String, Object> parms = new HashMap<String, Object>();
//                    parms.put("deptName", deptName);
//                    parms.put("teamName", teamName);
//
//                    // 부서명과 팀명에 대응하는 dept_no 조회
//                    Long deptNo = employeemapper.findDeptNoByDeptAndTeamName(parms);
//                    receiver.setDeptCode(deptNo);
//                }
//
//                System.out.println("Receiver emp_no: " + receiver.getEmp_no());
//                System.out.println("Receiver deptCode: " + receiver.getDeptCode());
//            }
//
//            selectReceivers.put("receivers" , selectData.get("receivers"));
//            reportMapper.AddReceiversData(selectReceivers);
//
//        } catch (Exception e) {
//            System.err.println("Error during report approval process: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }


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

        System.out.println("selectReportApprsInfoById reportId : " + reportId);

        // ReportDTO 객체 생성
        ReportDTO reportDTO = new ReportDTO();

        // Mapper를 통해 결재자, 수신자, 참조자 정보를 가져옴
        List<ApproverDTO> approverInfo = reportMapper.selectReportApprsInfoById(reportId);
        List<RecipientDTO> reciInfo = reportMapper.selectReportRecisInfoById(reportId);
        List<ReferenceDTO> refeInfo = reportMapper.selectReportRefesInfoById(reportId);

        System.out.println("approverInfo : " + approverInfo);
        System.out.println("reciInfo : " + reciInfo);
        System.out.println("refeInfo : " + refeInfo);

        // ReportDTO에 reportId와 각 정보를 설정
        reportDTO.setRepo_no(Math.toIntExact(reportId));
        reportDTO.setApproverInfo(approverInfo);
        reportDTO.setRecipientInfo(reciInfo);
        reportDTO.setReferenceInfo(refeInfo);

        return reportDTO;
    }

    // 상신 취소
    public boolean cancelSubmission(Long reportId, String empCode) {

        // 해당 문서에 결재한 사람이 있는지 확인
        List<ApproverDTO> appr_result = reportMapper.getApproversByReportId(reportId);

        for (ApproverDTO approver : appr_result) {
            if(approver.getAppr_status().equals("rejected") || approver.getAppr_status().equals("approved")) {
                return false;
            }
        }

        Map<String, Object> params = new HashMap<>();
        params.put("reportId", reportId);
        params.put("status", "canceled");

        int updated = reportMapper.updateReportStatus(params);

        return updated > 0;
    }

    // 회수
    public boolean retrieveReport(Long reportId, String empCode) {
        // 해당 문서에 결재한 사람이 있는지 확인
        List<ApproverDTO> appr_result = reportMapper.getApproversByReportId(reportId);

        for (ApproverDTO approver : appr_result) {
            if(approver.getAppr_status().equals("rejected") || approver.getAppr_status().equals("approved")) {
                return false;
            }
        }

        Map<String, Object> params = new HashMap<>();
        params.put("reportId", reportId);
        params.put("status", "canceled");

        int updated = reportMapper.updateReportStatus(params);

        return updated > 0;
    }

    // 승인
    public boolean approveReport(Long reportId, String empCode) {

        // 결재자 정보 조회
//        Integer repoEmpNo = reportMapper.getReportEmpNo(reportId);
        EmployeeDTO empDto = reportMapper.findByEmpCode(empCode);
        Long repoEmpNo = empDto.getEmp_no();

        // 결재자 정보 조회
        List<ApproverDTO> apprInfo =  reportMapper.getSelectApproverInfo(reportId);

        if(apprInfo == null || apprInfo.isEmpty()) {
            return false;
        }
//        System.out.println("apprInfo : " + apprInfo);

        // 결재자 수 확인
        int apprCount = reportMapper.getSelectApproverCount(reportId);

        for (int i = 0; i < apprInfo.size(); i++) {

            if (repoEmpNo == apprInfo.get(i).getAppr_emp_no() && apprInfo.get(i).getAppr_status().equals("pending")) {

                Map<String, Object> params = new HashMap<>();
                params.put("reportId", reportId);
                params.put("empNo", repoEmpNo);
                params.put("appr_status", "approved");

                // 결재 상태 업데이트
                boolean updateRes = reportMapper.updateApproverStatus(params);

                if (updateRes) {
                    if (apprCount > apprInfo.get(i).getAppr_order()) {

                        // 다음 결재자 'pending'으로 업데이트
                        Map<String, Object> nextParams = new HashMap<>();
                        nextParams.put("reportId", reportId);
                        nextParams.put("empNo", apprInfo.get(i + 1).getAppr_emp_no());
                        nextParams.put("appr_status", "pending");

                        reportMapper.updateApproverStatus(nextParams);

                    } else if (apprCount == apprInfo.get(i).getAppr_order()) {

                        Map<String, Object> reportParam = new HashMap<>();
                        reportParam.put("reportId", reportId);
                        reportParam.put("status", "approved");

                        reportMapper.updateReportStatus(reportParam);

                        return true;
                    }
                }
            return updateRes;
            }

        }
        return false;
    }

    // 반려
    public boolean rejectReport(Long reportId, String empCode, String rejectionReason) {
        // 결재자 확인 및 상태 확인
        Integer approverEmpNo = reportMapper.getApproverEmpNo(reportId);
        if (approverEmpNo != null && approverEmpNo.equals(reportMapper.getEmpNoByCode(empCode))) {

            // 결재 상태 반려 처리
            Map<String, Object> apprvParams = new HashMap<>();
            apprvParams.put("reportId", reportId);
            apprvParams.put("empNo", approverEmpNo);
            apprvParams.put("appr_status", "rejected");

            // 결재 상태 업데이트
            boolean updateRes = reportMapper.updateApproverStatus(apprvParams);

            // 문서 반려 처리
            Map<String, Object> repoParams = new HashMap<>();
            repoParams.put("reportId", reportId);
            repoParams.put("status", "rejected");
            repoParams.put("rejectionReason", "반려 처리");

            int updated = reportMapper.updateReportStatus(repoParams);
            System.out.println("반려 처리 updated : " + updated);

            return updated > 0 && updateRes;
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
//        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!workReports : " +  workReports);

        List<ReportDTO> attendanceReports  = reportMapper.selectMyDocAttenReports(empNo);
        attendanceReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        List<ReportDTO> purchaseReports  = reportMapper.selectMyDocPurcReports(empNo);
        purchaseReports.forEach(report -> reportsMap.put((long) report.getRepo_no(), report));

        return reportsMap;
    }

    public ReportDTO selectReportFormById(long reportId) {

        ReportDTO reportData = reportMapper.selectReportFormById(reportId);

        String repoCode = generateDocumentCode(reportId, reportData.getRepo_type());

        Map<String, Object> param = new HashMap<>();
        param.put("reportId", reportId);
        param.put("repoCode", repoCode);

        reportMapper.updateReportCode(param);

        ReportDTO result = reportMapper.selectReportFormById(reportId);

        System.out.println("selectReportFormById-result : " + result);
        return result;
    }



}
