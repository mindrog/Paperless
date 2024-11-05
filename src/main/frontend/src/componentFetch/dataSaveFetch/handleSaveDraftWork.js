import React, { forwardRef, useImperativeHandle } from 'react';

const HandleSaveDraftWork = forwardRef(({
  reportId,
  reportTitle,
  reportContent,
  reportDate,
  repoStartTime,
  repoEndTime,
  reportStatus,
  selectedApprovers,
  selectedReferences,
  selectedReceivers,
  token,
  setIsSaved,
  setSaveDate,
  setShowAlert,
  setAlertMessage,
  setReportId
}, ref) => {
  const saveReportToDB = async (type = 'draft') => {
    console.log("HandleSaveReport - Report ID:", reportId);
    console.log("HandleSaveReport - type :", type);

    try {
      // JSON 데이터 구성
      const reportData = {
        reportId,
        reportTitle,
        reportContent,
        reportDate,
        repoStartTime,
        repoEndTime,
        reportStatus,
        selectedApprovers,
        selectedReferences,
        selectedReceivers
      };

      console.log("ReportData JSON contents:", reportData);

      const apiUrl = type === 'draft' ? '/api/saveasdraft' : '/api/saveworkreport';

      console.log("apiUrl : " + apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // JSON 형식으로 지정
          Authorization: `${token}`,     // JWT 토큰을 Bearer로 추가
        },
        body: JSON.stringify(reportData) // JSON 데이터를 문자열로 변환하여 전송
      });

      if (!response.ok) throw new Error(`Failed to ${type} report`);

      const result = await response.json();
      console.log(`${type === 'draft' ? 'Draft' : 'Submission'} result:`, result);

      if (result.reportId) {
        setReportId(result.reportId);
      }

      setIsSaved(true);
      setSaveDate(new Date().toLocaleDateString('ko-KR'));
      setShowAlert(true);
      setAlertMessage(`${type === 'draft' ? '임시 저장' : '결재 상신'}되었습니다.`);

      return result;
    } catch (error) {
      console.error(`Error ${type} report:`, error);
      setShowAlert(true);
      setAlertMessage(`${type === 'draft' ? '임시 저장' : '결재 상신'}에 실패했습니다.`);
      return null;
    }
  };

  useImperativeHandle(ref, () => saveReportToDB);

  return null;
});

export default HandleSaveDraftWork;
