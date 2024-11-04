package com.ss.paperless.report;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ss.paperless.employee.EmployeeDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import com.ss.paperless.employee.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeEntity getUserInfo(String empCode) {
        return employeeRepository.findByEmpCode(empCode);
    }


    // emp_no 찾기
    public int getUserEmpNo(String empCode) {
        BigInteger empNoBigInt = BigInteger.valueOf(employeeRepository.findEmpNoByEmpCode(empCode));
        return empNoBigInt.intValue();
    }

    // 임시 저장 로직
    @Transactional
    public Long AddSaveAsDraftReportData(Map<String, Object> reportData) {
        try {
            // 1. Report 테이블에 데이터 저장 및 reportId 생성
            reportMapper.AddReportData(reportData);
            Long reportId = (Long) reportData.get("repo_no"); // 생성된 reportId 가져오기
            reportData.put("repo_no", reportId); // 다른 테이블에 저장할 때 사용할 수 있도록 reportId 추가

            // 2. WorkReport 테이블에 데이터 저장
            saveWorkReport(reportData);

            // 3. Approver, Reference, Receiver 데이터 저장
            saveApprovers(reportId, (List<EmployeeDTO>) reportData.get("selectedApprovers"));
            saveReferences(reportId, (String) reportData.get("selectedReferences"));
            saveReceivers(reportId, (String) reportData.get("selectedReceivers"));

            // 4. 첨부 파일 데이터가 있을 경우 저장
            List<Map<Object, Object>> attachments = (List<Map<Object, Object>>) reportData.get("attachments");
            if (attachments != null && !attachments.isEmpty()) {
                saveAttachments(reportId, attachments);
            }

            return reportId; // 생성된 reportId 반환

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error saving draft report", e);
        }
    }

    Long saveWorkReport(Map<String, Object> reportData) {
        // 문서번호 생성 로직 (예: UUID 기반)
        String docNo = "DOC-" + UUID.randomUUID().toString();
        reportData.put("doc_no", docNo);

        // 보고서 데이터 저장
        reportMapper.AddReportData(reportData);

        // 생성된 repo_no 반환
        return (Long) reportData.get("repo_no");
    }

    private void saveApprovers(Long reportId, List<EmployeeDTO> approvers) {
        List<Map<Object, Object>> approverDataList = new ArrayList<>();
        for (int i = 0; i < approvers.size(); i++) {
            EmployeeDTO approver = approvers.get(i);
            Map<Object, Object> approverMap = new HashMap<>();
            approverMap.put("repo_no", reportId);
            approverMap.put("appr_emp_no", approver.getEmp_no());
            approverMap.put("appr_order", i + 1);
            approverMap.put("appr_status", "pending");
            approverMap.put("appr_delegate", approver.getApprovalType().equals("전결") ? 1 : 0);
            approverDataList.add(approverMap);
        }
        reportMapper.AddApproversData(Map.of("approvers", approverDataList, "repo_no", reportId));
    }

    private void saveReferences(Long reportId, String referencesJson) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<EmployeeDTO> references = objectMapper.readValue(referencesJson, new TypeReference<>() {});

        List<Map<Object, Object>> referenceDataList = new ArrayList<>();
        for (EmployeeDTO reference : references) {
            Map<Object, Object> referenceMap = new HashMap<>();
            referenceMap.put("repo_no", reportId);
            referenceMap.put("refe_emp_no", reference.getEmp_no());
            referenceDataList.add(referenceMap);
        }
        reportMapper.AddReferencesData(Map.of("references", referenceDataList, "repo_no", reportId));
    }

    private void saveReceivers(Long reportId, String receiversJson) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<EmployeeDTO> receivers = objectMapper.readValue(receiversJson, new TypeReference<>() {});

        List<Map<Object, Object>> receiverDataList = new ArrayList<>();
        for (EmployeeDTO receiver : receivers) {
            Map<Object, Object> receiverMap = new HashMap<>();
            receiverMap.put("repo_no", reportId);
            receiverMap.put("rece_emp_no", receiver.getEmp_no());
            receiverDataList.add(receiverMap);
        }
        reportMapper.AddReceiversData(Map.of("receivers", receiverDataList, "repo_no", reportId));
    }

    private void saveAttachments(Long reportId, List<Map<Object, Object>> attachments) {
        for (Map<Object, Object> attachmentData : attachments) {
            reportMapper.AddAttachmentData(attachmentData);
            Long attaNo = (Long) attachmentData.get("atta_no");

            // ReportAttachment 테이블에 첨부 파일 관계 저장
            Map<String, Object> reportAttachmentData = new HashMap<>();
            reportAttachmentData.put("repo_no", reportId);
            reportAttachmentData.put("atta_no", attaNo);
            reportMapper.AddReportAttachmentData(reportAttachmentData);
        }
    }

    // 결재 승인 로직

    // 반려 로직
}
