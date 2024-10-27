import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/company/company_email_detail.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import ComposeButton from '../component/ComposeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

function CompanyUserEmailDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // 검색 상태 및 핸들러
  const [searchTerm, setSearchTerm] = useState('');

  // 상세 검색 토글
  const [showDetailSearch, setShowDetailSearch] = useState(false);

  // 상세 검색 상태
  const [detailSearch, setDetailSearch] = useState({
    sender: '',
    recipient: '',
    content: '',
    periodOption: '전체 기간',
    startDate: '',
    endDate: '',
    hasAttachment: false,
  });

  // 상세 검색 바를 닫기 위해 외부 클릭 감지
  const detailSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        detailSearchRef.current &&
        !detailSearchRef.current.contains(event.target) &&
        !event.target.classList.contains(styles['detail-button'])
      ) {
        setShowDetailSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 이메일이 없으면 목록 페이지로 이동
  useEffect(() => {
    if (!email) {
      navigate('/Company/admin/email');
    }
  }, [email, navigate]);

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    alert('삭제 함수 실행 후 이메일 창으로 이동');
    navigate('/Company/admin/email');
  };

  // 답장 버튼 핸들러
  const handleReply = () => {
    navigate('/Company/admin/email/send', {
      state: { receiverEmail: email.sender },
    });
  };

  // 전달 버튼 핸들러
  const handleForward = () => {
    navigate('/Company/admin/email/send', {
      state: { emailToForward: email },
    });
  };

  // 메일 작성 버튼 핸들러
  const handleCompose = () => {
    navigate('/Company/admin/email/send');
  };

  const handleSearch = () => {
    navigate('/Company/admin/email', { state: { searchTerm } });
  };

  const toggleDetailSearch = () => {
    setShowDetailSearch(!showDetailSearch);
  };

  // 상세 검색 입력 핸들러
  const handleDetailInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetailSearch((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 기간 옵션 변경 핸들러
  const handlePeriodOptionChange = (e) => {
    const value = e.target.value;
    setDetailSearch((prev) => ({
      ...prev,
      periodOption: value,
    }));

    let startDate = '';
    let endDate = new Date();

    if (value === '전체 기간') {
      startDate = '';
      endDate = '';
    } else if (value === '1주일') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else if (value === '1개월') {
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
    } else if (value === '3개월') {
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 3);
    } else if (value === '6개월') {
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
    } else if (value === '1년') {
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
    } else if (value === '직접입력') {
      startDate = '';
      endDate = '';
    }

    if (value !== '전체 기간' && value !== '직접입력') {
      setDetailSearch((prev) => ({
        ...prev,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      }));
    } else {
      setDetailSearch((prev) => ({
        ...prev,
        startDate: '',
        endDate: '',
      }));
    }
  };

  // 날짜 입력 변경 시 기간 옵션을 '직접입력'으로 변경
  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    setDetailSearch((prev) => ({
      ...prev,
      [name]: value,
      periodOption: '직접입력',
    }));
  };

  // 검색 실행 함수
  const performSearch = () => {
    // 검색 조건을 메일 목록 페이지로 전달
    navigate('/Company/admin/email', { state: { detailSearch } });
  };

  // 첨부파일 클릭 핸들러
  const handleAttachmentClick = () => {
    alert('첨부파일 함수 실행');
  };

  // 이메일이 없으면 아무것도 렌더링하지 않음
  if (!email) {
    return null;
  }

  return (
    <div className={styles.Container}>
      {/* 상단의 버튼과 검색 바 */}
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
        {/* <div className={styles['search-bar']}>
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles['search-input']}
          />
          <button className={styles['search-button']} onClick={handleSearch}>
            검색
          </button>
          <button
            className={styles['detail-button']}
            onClick={toggleDetailSearch}
          >
            상세
          </button>
        </div> */}
      </div>

      {/* 상세 검색 영역 */}
      {/* {showDetailSearch && (
        <div className={styles['detail-search']} ref={detailSearchRef}>
          <div className={styles['detail-field']}>
            <label>보낸 사람</label>
            <input
              type="text"
              name="sender"
              value={detailSearch.sender}
              onChange={handleDetailInputChange}
            />
          </div>
          <div className={styles['detail-field']}>
            <label>받는 사람</label>
            <input
              type="text"
              name="recipient"
              value={detailSearch.recipient}
              onChange={handleDetailInputChange}
            />
          </div>
          <div className={styles['detail-field']}>
            <label>내용</label>
            <input
              type="text"
              name="content"
              value={detailSearch.content}
              onChange={handleDetailInputChange}
            />
          </div>
          <div className={styles['detail-field']}>
            <label>기간</label>

            <select
              name="periodOption"
              value={detailSearch.periodOption}
              onChange={handlePeriodOptionChange}
            >
              <option value="전체 기간">전체 기간</option>
              <option value="1주일">1주일</option>
              <option value="1개월">1개월</option>
              <option value="3개월">3개월</option>
              <option value="6개월">6개월</option>
              <option value="1년">1년</option>
              <option value="직접입력">직접입력</option>
            </select>

            <input
              style={{ width: '110px', margin: '0' }}
              type="date"
              name="startDate"
              value={detailSearch.startDate}
              onChange={handleDateInputChange}
            />
            ~
            <input
              style={{ width: '110px' }}
              type="date"
              name="endDate"
              value={detailSearch.endDate}
              onChange={handleDateInputChange}
            />

          </div>
          <div className={styles['detail-field']}>
            <label style={{ width: '120px' }}>
              <input
                type="checkbox"
                name="hasAttachment"
                checked={detailSearch.hasAttachment}
                onChange={handleDetailInputChange}
              />
              첨부파일 있음
            </label>
          </div>
          <div className={styles['detail-actions']}>
            <button className={styles['search-button']} onClick={performSearch}>
              검색
            </button>
          </div>
        </div>
      )} */}

      {/* 이메일 상세 내용 */}
      <div className={styles['email-detail']}>
        <div className={styles['email-header']}>
          {/* <button className={styles.btn} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button> */}
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
          <h2>{email.subject}</h2>
        </div>
        <p>
          <strong>보낸 사람:</strong> {email.sender}
        </p>
        <p>
          <strong>받는 사람:</strong> {email.recipient}
        </p>
        <p className={styles['received-time']}>{email.receivedAt}</p>
        <hr />
        {/* 첨부파일 섹션 */}
        {email.hasAttachment && (
          <div className={styles['attachment-section']}>
            <p>
              <strong>첨부파일:</strong>{' '}
              <span
                className={styles['attachment-link']}
                onClick={handleAttachmentClick}
              >
                testFile
              </span>
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
