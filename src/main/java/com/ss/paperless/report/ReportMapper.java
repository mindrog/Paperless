package com.ss.paperless.report;

import com.ss.paperless.employee.EmployeeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface ReportMapper {

    // Report 테이블에 보고서 데이터 추가
    void AddReportData(Map<String, Object> reportData);

    // WorkReport 테이블에 업무 보고서 데이터 추가
    void AddWorkReportData(Map<String, Object> reportData);

    // Approver 테이블에 결재자 데이터 추가
    void AddApproversData(Map<String, Object> approverDataMap);

    // Reference 테이블에 참조자 데이터 추가
    void AddReferencesData(Map<String, Object> referenceDataMap);

    // Recipient 테이블에 수신자 데이터 추가
    void AddReceiversData(Map<String, Object> recipientDataMap);

    // Attachment 테이블에 첨부파일 데이터 추가
    void AddAttachmentData(Map<Object, Object> attachmentData);

    // ReportAttachment 테이블에 보고서-첨부파일 관계 추가
    void AddReportAttachmentData(Map<String, Object> reportAttachmentData);

    // Report 테이블에서 보고서 상태 업데이트
    void UpdateReportStatus(Map<String, Object> updateData);

    // 결재 상신 시 결재자 상태 초기화
    void UpdateApproverStatusForSubmission(@Param("repoNo") Long repoNo);

    // 상신 취소 시 결재자 상태 초기화
    void ResetApproverStatus(@Param("repoNo") Long repoNo);

    // 회수 시 결재자 상태 중단
    void HaltApproverStatus(@Param("repoNo") Long repoNo);
}
