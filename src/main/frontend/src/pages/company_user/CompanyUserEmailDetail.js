import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/company/company_email_detail.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import ComposeButton from '../component/ComposeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function CompanyUserEmailDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailNo = location.state?.emailNo; // 이메일 번호를 받아옴

  const [email, setEmail] = useState(null); // 이메일 상세 정보를 저장
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux에서 사용자 정보 가져오기
  const user = useSelector((state) => state.user.data);

  // JWT 토큰 가져오기
  const getToken = () => {
    return localStorage.getItem('jwt');
  };

  useEffect(() => {
    if (!emailNo) {
      alert('이메일 정보를 가져올 수 없습니다.');
      navigate('/Company/user/email');
      return;
    }

    // 이메일 상세 정보 가져오기
    fetch(`/api/emails/${emailNo}`, {
      method: 'GET',
      headers: {
        'Authorization': `${getToken()}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return response.json();
      })
      .then((data) => {
        setEmail(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('이메일 데이터를 가져오는 중 오류 발생:', error);
        setError('이메일 데이터를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      });
  }, [emailNo, navigate]);

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    // 삭제 API 호출
    fetch(`/api/emails/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailIds: [emailNo] }),
    })
      .then(response => {
        if (response.ok) {
          alert('이메일이 삭제되었습니다.');
          navigate('/Company/user/email');
        } else {
          alert('이메일 삭제 중 오류가 발생했습니다.');
        }
      })
      .catch(error => {
        console.error('이메일 삭제 중 오류 발생:', error);
        alert('이메일 삭제 중 오류가 발생했습니다.');
      });
  };

  // 답장 버튼 핸들러
  const handleReply = () => {
    navigate('/Company/user/email/send', {
      state: { receiverEmail: email.writerEmail },
    });
  };

  // 전달 버튼 핸들러
  const handleForward = () => {
    navigate('/Company/user/email/send', {
      state: { emailToForward: email },
    });
  };

  // 메일 작성 버튼 핸들러
  const handleCompose = () => {
    navigate('/Company/user/email/send');
  };

  // 이메일이 없으면 로딩 상태 또는 에러 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!email) {
    return null;
  }

  return (
    <div className={styles.Container}>
      {/* 상단의 버튼 */}
      <div className={styles.toolbar}>
        <div className={styles['left-buttons']}>
          <button className={styles.btn} onClick={handleDelete}>
            삭제
          </button>
          <button className={styles.btn} onClick={handleReply}>
            답장
          </button>
          <button className={styles.btn} onClick={handleForward}>
            전달
          </button>
        </div>
      </div>

      {/* 이메일 상세 내용 */}
      <div className={styles['email-detail']}>
        <div className={styles['email-header']}>
          <span
            className={styles.backIcon}
            onClick={() => navigate(-1)}
            tabIndex="0"
            role="button"
            aria-label="뒤로 가기"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(-1);
              }
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </span>
          <h2>{email.title}</h2>
        </div>
        <p>
          <strong>보낸 사람:</strong> {email.writerDisplayInfo} &lt;{email.writerEmail}&gt;
        </p>
        <p>
          <strong>받는 사람:</strong> {email.recipientEmail}
        </p>
        {email.ccEmail && (
          <p>
            <strong>참조:</strong> {email.ccEmail}
          </p>
        )}
        <p className={styles['received-time']}>{email.sendDate.replace('T', ' ')}</p>
        <hr />
        {/* 첨부파일 섹션 */}
        {email.hasAttachment && (
          <div className={styles['attachment-section']}>
            <p>
              <strong>첨부파일:</strong>{' '}
              {email.attachments.map((attachment, index) => (
                <span key={index}>
                  <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                    {attachment.fileName}
                  </a>
                  {index < email.attachments.length - 1 && ', '}
                </span>
              ))}
            </p>
            <hr />
          </div>
        )}

        <div className={styles['email-content']}>{email.content}</div>
      </div>

      {/* 메일 작성 버튼 */}
      <div className={styles.footer}>
        <ComposeButton onClick={handleCompose} className={styles.composeButton} />
      </div>
    </div>
  );
}

export default CompanyUserEmailDetail;
