package com.ss.paperless.report;

import com.ss.paperless.attachment.AttachmentDTO;
import com.ss.paperless.employee.entity.EmployeeEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReportMapper {

    // Report 테이블에 새로운 보고서 데이터 추가
    // reportData 맵은 보고서의 제목, 내용, 작성자 정보, 상태 등 보고서에 필요한 데이터를 포함
    void AddReportData(Map<String, Object> reportData);

    // WorkReport 테이블에 업무 보고서 관련 데이터 추가
    // reportData 맵은 업무 보고서의 시작 시간, 종료 시간 등 특정 업무 보고서 데이터 포함
    void AddWorkReportData(Map<String, Object> reportData);

    // Approver 테이블에 결재자 데이터를 추가
    // approverDataMap 맵은 각 결재자의 정보와 보고서 ID, 결재 순서, 상태, 권한 등의 결재자 데이터를 포함
    void AddApproversData(Map<String, Object> approverDataMap);

    // Reference 테이블에 참조자 데이터를 추가
    // referenceDataMap 맵은 참조자 ID, 부서 ID 등의 참조자 관련 데이터를 포함
    void AddReferencesData(Map<String, Object> referenceDataMap);

    // Recipient 테이블에 수신자 데이터를 추가
    // recipientDataMap 맵은 수신자의 ID, 부서 ID 등의 수신자 관련 데이터를 포함
    void AddReceiversData(Map<String, Object> recipientDataMap);

    // Attachment 테이블에 첨부 파일 데이터를 추가
    // attachmentData 맵은 파일의 키, URL, 원본 이름, 파일 크기 등의 첨부 파일 정보 포함
    void AddAttachmentData(Map<Object, Object> attachmentData);

    // ReportAttachment 테이블에 보고서와 첨부 파일 간의 관계 데이터를 추가
    // reportAttachmentData 맵은 보고서 ID와 첨부 파일 ID로 이 관계를 저장
    void AddReportAttachmentData(Map<String, Object> reportAttachmentData);

    // Report 테이블에서 보고서의 상태를 업데이트
    // updateData 맵은 보고서 ID와 새로 업데이트할 상태 데이터를 포함
    void UpdateReportStatus(Map<String, Object> updateData);

    // 결재 상신 시 모든 결재자의 상태를 초기화하여 결재 프로세스를 시작
    // repoNo는 초기화할 결재가 있는 보고서의 ID
    void UpdateApproverStatusForSubmission(@Param("repoNo") Long repoNo);

    // 결재 상신 취소 시 결재자들의 상태를 초기화
    // repoNo는 초기화할 보고서의 ID
    void ResetApproverStatus(@Param("repoNo") Long repoNo);

    // 회수 시 결재자 상태를 중단으로 업데이트
    // repoNo는 중단할 결재 상태가 있는 보고서의 ID
    void HaltApproverStatus(@Param("repoNo") Long repoNo);

    // 보고서 ID를 기반으로 결재자 목록을 가져옴
    // reportId는 결재자 목록을 검색할 대상 보고서의 ID
    List<Map<String, Object>> getApproversByReportId(Long reportId);

    // 특정 결재자의 상태를 업데이트
    // approverData 맵은 결재자의 ID와 새로운 결재 상태를 포함
    void updateApproverStatus(Map<String, Object> approverData);

    // 보고서 ID와 상태를 기반으로 보고서의 상태를 업데이트
    // reportId는 상태 업데이트할 보고서의 ID, submitted는 업데이트할 상태
//    void updateReportStatus(Long reportId, String reportStatus);

    // 문서 코드 생성 시 문서 타입 조회
    String getReportTypeById(Long reportId);

    // 보고서 첨부 파일 데이터 삽입 메서드 추가
    void insertAttachment(AttachmentDTO attachment);
    void insertReportAttachment(Long reportId, Long attaNo);

    // 결재자, 참조자, 수신자 데이터 삽입 메서드 추가
    void insertApprover(Map<String, Object> approverData);
    void insertReference(Map<String, Object> referenceData);
    void insertRecipient(Map<String, Object> recipientData);

    ReportDTO selectReportById(Long reportId);

    ReportDTO selectReportListByDeptNo(Long deptNo);
    
    // 각 유형의 보고서 조회
    List<ReportDTO> selectWorkReports(Long deptNo);
    List<ReportDTO> selectAttenReports(Long deptNo);
    List<ReportDTO> selectPurcReports(Long deptNo);

    // 결재 로직 ----------------------

    // 보고서 상태 업데이트
    @Update("UPDATE report SET status = #{status} WHERE repo_no = #{reportId}")
    int updateReportStatus(@Param("reportId") Long reportId, @Param("status") String status);

    // 반려 사유와 함께 상태 업데이트
    @Update("UPDATE report SET status = #{status}, rejection_reason = #{rejectionReason} WHERE repo_no = #{reportId}")
    int rejectReport(@Param("reportId") Long reportId, @Param("status") String status, @Param("rejectionReason") String rejectionReason);

    // 보고서 작성자 번호 가져오기
    @Select("SELECT repo_emp_no FROM report WHERE repo_no = #{reportId}")
    Integer getReportEmpNo(@Param("reportId") Long reportId);

    // 결재자 사원 번호 가져오기 (여러 결재자 중 현재 사용자가 결재자인지 확인)
    @Select("SELECT appr_emp_no FROM approver WHERE appr_repo_no = #{reportId} AND appr_status = 'pending'")
    Integer getApproverEmpNo(@Param("reportId") Long reportId);

    // 사원 번호 가져오기 (empCode로 조회)
    @Select("SELECT emp_no FROM employee WHERE emp_code = #{empCode}")
    Integer getEmpNoByCode(@Param("empCode") String empCode);

    // 사원 정보 가져오기 (empCode로 조회)
    @Select("SELECT * FROM employee WHERE emp_code = #{empCode}")
    EmployeeEntity findEmployeeByCode(@Param("empCode") String empCode);
}
