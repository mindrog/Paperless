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
  files,
  setIsSaved,
  setSaveDate,
  setShowAlert,
  onSaveSuccess,
  setReportId, // reportId 상태 업데이트 함수 추가
}, ref) => {
  const saveDraftToDB = async () => {
    const token = localStorage.getItem('jwt');

    console.log("HandleSaveAsDraft - Report ID:", reportId);

    try {
      // FormData를 사용하여 파일과 데이터를 함께 전송
      const formData = new FormData();
      if (reportId) {
        formData.append('reportId', reportId); // reportId가 존재하면 추가
      }
      formData.append('reportTitle', reportTitle);
      formData.append('reportContent', reportContent);
      formData.append('reportDate', reportDate);
      formData.append('repoStartTime', repoStartTime);
      formData.append('repoEndTime', repoEndTime);
      formData.append('reportStatus', reportStatus);

      // saveDraftDate 추가
      formData.append('saveDraftDate', new Date().toISOString());
      formData.append('selectedApprovers', JSON.stringify(selectedApprovers));
      formData.append('selectedReferences', JSON.stringify(selectedReferences));
      formData.append('selectedReceivers', JSON.stringify(selectedReceivers));

      // 파일 배열 추가
      files.forEach(file => formData.append('files', file));

      // API 호출
      const response = await fetch('/api/saveworkreport', {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit report');

      const result = await response.json();
      console.log("Save result:", result);

      // reportId가 처음 생성될 경우 업데이트
      if (!reportId && result.reportId) {
        setReportId(result.reportId);
      }

      // 저장 성공 시 상태 업데이트 및 성공 콜백 호출
      setIsSaved(true);
      setSaveDate(new Date().toLocaleDateString('ko-KR'));
      setShowAlert(true);

      // 저장 성공 시 호출할 함수 실행 (모달 표시 및 페이지 이동)
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setShowAlert(true);
      alert('결재 상신에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  useImperativeHandle(ref, () => saveDraftToDB);

  return null;
});

export default HandleSaveDraftWork;
