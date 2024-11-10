import React, { useState, useEffect } from 'react';
import styles from '../../styles/company/company_email_detail.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import ComposeButton from '../component/ComposeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { triggerUnreadCountUpdate } from '../../store/emailSlice';
import axios from 'axios';
import { setUnreadCount } from '../../store/emailSlice';
import { useParams } from 'react-router-dom';


function CompanyUserEmailDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { emailId } = useParams();// 이메일 번호를 받아옴
  const emailNo = parseInt(emailId, 10);
  const [email, setEmail] = useState(null); // 이메일 상세 정보를 저장
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux에 저장
  const dispatch = useDispatch();
  const emailUnreadCountState = useSelector((state) => state.email.emailUnreadCountState);

  // Redux에서 사용자 정보 가져오기
  const user = useSelector((state) => state.user.data);

  // JWT 토큰 가져오기
  const getToken = () => {
    return localStorage.getItem('jwt');
  };

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:8080/api/emails/${emailNo}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      // 이메일 데이터를 상태에 저장
      setEmail(data);
      setLoading(false);
      console.log(data);

      // 읽지 않은 메일 수 다시 가져오기
      const unreadResponse = await axios.get('http://localhost:8080/api/emails/unreadcount', {
        headers: { Authorization: token },
      });
      dispatch(setUnreadCount(unreadResponse.data));
    } catch (error) {
      console.error('이메일 데이터를 가져오는 중 오류 발생:', error);
      setError('이메일 데이터를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmail();
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
          <strong>받는 사람:</strong> {email.recipientDisplayInfo} &lt;{email.recipientEmail}&gt;
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
                  <a href={attachment.attaUrl} target="_blank" rel="noopener noreferrer">
                    {attachment.attaOriginalName}
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
