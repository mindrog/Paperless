import React, { forwardRef, useImperativeHandle } from 'react';

const HandleSaveDraftWork = forwardRef(({
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
  token,
  setIsSaved,
  setSaveDate,
  setShowAlert,
  onSaveSuccess
}, ref) => {
  const saveDraftToDB = async () => {
    try {
      // FormData를 사용하여 파일과 데이터를 함께 전송
      const formData = new FormData();
      formData.append('reportTitle', reportTitle);
      formData.append('reportContent', reportContent);
      formData.append('reportDate', reportDate);
      formData.append('repoStartTime', repoStartTime);
      formData.append('repoEndTime', repoEndTime);
      formData.append('reportStatus', reportStatus);
      formData.append('saveDraftDate', setSaveDate);
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

      if (response.status === 200) {
        const result = await response.json();
        console.log("Save result:", result);
        setIsSaved(true);
        setSaveDate(setSaveDate);
        setShowAlert(true);
      }

      const result = await response.json();
      console.log("Save result:", result);

      // 저장 성공 시 상태 업데이트 및 성공 콜백 호출
      setIsSaved(true);
      setSaveDate(new Date().toLocaleDateString('ko-KR'));
      setShowAlert(true);

      // 저장 성공 시 호출할 함수 실행 (모달 표시 및 페이지 이동)
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setShowAlert(true);
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  useImperativeHandle(ref, () => saveDraftToDB);

  return null;
});

export default HandleSaveDraftWork;
