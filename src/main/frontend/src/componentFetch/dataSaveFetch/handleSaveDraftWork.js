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
  setIsSaved,
  setSaveDate,
  setShowAlert,
  setAlertMessage,
  setReportId,
  files
}, ref) => {
  const saveReportToDB = async (type = 'draft') => {
    console.log("HandleSaveReport - Report ID:", reportId);
    console.log("HandleSaveReport - type :", type);

    try {

      const formData = new FormData();

      // JSON 데이터 추가
      formData.append('reportData', new Blob([JSON.stringify({
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
      })], { type: 'application/json' }));

      // 파일이 있으면 추가
      if (files && files.length > 0) {
        files.forEach((file) => formData.append('files', file));
      }

      // FormData의 내용을 로그로 출력
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          // Blob 객체는 파일일 가능성이 높으므로 파일 정보만 표시
          console.log(`${key}: Blob - ${value.size} bytes`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // JSON 데이터 구성
      // const reportData = {
      //   reportId,
      //   reportTitle,
      //   reportContent,
      //   reportDate,
      //   repoStartTime,
      //   repoEndTime,
      //   reportStatus,
      //   selectedApprovers,
      //   selectedReferences,
      //   selectedReceivers
      // };

      // console.log("ReportData JSON contents:", reportData);

      const apiUrl = type === 'draft' ? '/api/saveasdraft' : '/api/saveworkreport';
      const token = localStorage.getItem('jwt');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `${token}`, 
        },
        body: formData,
      });

      // const response = await fetch(apiUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',  // JSON 형식으로 지정
      //     Authorization: `${token}`,     // JWT 토큰을 Bearer로 추가
      //   },
      //   body: JSON.stringify(reportData) // JSON 데이터를 문자열로 변환하여 전송
      // });

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
