import React from 'react'

function handleSaveAsDraft() {
    const saveDraftToDB = async () => {
        try {
          const payload = {
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
          };
    
          const response = await fetch('/api/saveDraft', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
    
          if (!response.ok) throw new Error('Failed to save draft');
          
          const result = await response.json();
          console.log("Save result:", result);
          setIsSaved(true);
          setSaveDate(new Date().toLocaleDateString('ko-KR'));
          setShowAlert(true);
        } catch (error) {
          console.error('Error saving draft:', error);
          alert('저장에 실패했습니다.');
        }
      };
    
      // 임시 저장 클릭 시 호출
      const handleSaveAsDraftClick = () => {
        saveDraftToDB();
        setTimeout(() => setShowAlert(false), 5000);
      };
    
      return (
        <div className="container">
          {/* ... 기존 JSX 코드 ... */}
        </div>
      );
    };


export default handleSaveAsDraft;