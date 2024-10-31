import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/company/company_email.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Pagination from '../component/Pagination';
import ComposeButton from '../component/ComposeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';

function CompanyUserEmail() {

    const [emails, setEmails] = useState([]);
    const navigate = useNavigate();
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const emailsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);

    // 검색 상태 및 핸들러 추가
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailSearch, setShowDetailSearch] = useState(false);

    const location = useLocation();

    useEffect(() => {
        console.log('Current pathname:', location.pathname);
    }, [location.pathname]);

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

    // JWT 토큰 가져오기
    const getToken = () => {
        return localStorage.getItem('jwt');
    };

    // Redux에서 사용자 정보 가져오기
    const user = useSelector((state) => state.user.data);
    console.log('User from Redux:', user);

    // 로그인한 사용자 ID 가져오기
    const recipientId = user ? user.emp_no : null;
    // 이메일 데이터 가져오기
    useEffect(() => {
        if (!recipientId) {
            console.error('로그인 정보가 없습니다.');
            navigate('/login');
            return;
        }

        const queryParams = new URLSearchParams();

        if (searchTerm) {
            queryParams.append('subject', searchTerm);
        }

        if (detailSearch.sender) {
            queryParams.append('sender', detailSearch.sender);
        }
        if (detailSearch.recipient) {
            queryParams.append('recipient', detailSearch.recipient);
        }
        if (detailSearch.content) {
            queryParams.append('content', detailSearch.content);
        }
        if (detailSearch.startDate) {
            queryParams.append('startDate', detailSearch.startDate);
        }
        if (detailSearch.endDate) {
            queryParams.append('endDate', detailSearch.endDate);
        }
        if (detailSearch.hasAttachment) {
            queryParams.append('hasAttachment', detailSearch.hasAttachment);
        }

        queryParams.append('page', currentPage - 1);
        queryParams.append('size', emailsPerPage);

        fetch(`/api/emails/list/${recipientId}?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `${getToken()}`,
                'Content-Type': 'application/json',
            },
        })
            .then(async response => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                return response.json();
            })
            .then(data => {
                setEmails(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(error => {
                console.error('이메일 데이터를 가져오는 중 오류 발생:', error);
                alert('이메일 데이터를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            });
    }, [currentPage, searchTerm, detailSearch, recipientId]);

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedEmails([]);
    };

    // 개별 이메일 선택/해제
    const handleCheckboxChange = (id) => {
        if (selectedEmails.includes(id)) {
            setSelectedEmails(selectedEmails.filter((emailId) => emailId !== id));
        } else {
            setSelectedEmails([...selectedEmails, id]);
        }
    };

    // 전체 선택/해제
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedEmails([]);
        } else {
            setSelectedEmails(emails.map((email) => email.emailNo));
        }
        setSelectAll(!selectAll);
    };

    // 이메일 클릭 시 상세 페이지로 이동
    const handleEmailClick = (email) => {
        navigate('/Company/user/email/detail', {state: { emailNo: email.emailNo }});
        console.log(email.emailNo);
    };

    // 삭제 버튼 클릭 (백엔드 API 호출 필요)
    const handleDelete = () => {
        if (selectedEmails.length === 0) return;

        fetch(`/api/emails/delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailIds: selectedEmails }),
        })
            .then(response => {
                if (response.ok) {
                    // 삭제 성공 시 이메일 목록 재조회
                    setSelectedEmails([]);
                    setSelectAll(false);
                    setCurrentPage(1);
                } else {
                    console.error('이메일 삭제 중 오류 발생');
                }
            })
            .catch(error => {
                console.error('이메일 삭제 중 오류 발생:', error);
            });
    };

    // 답장 버튼 클릭
    const handleReply = () => {
        if (selectedEmails.length === 1) {
            const email = emails.find((email) => email.emailNo === selectedEmails[0]);
            navigate('/Company/user/email/send', { state: { receiverEmail: email.writerEmail } });
        }
    };

    // 전달 버튼 클릭
    const handleForward = () => {
        if (selectedEmails.length === 1) {
            const email = emails.find((email) => email.emailNo === selectedEmails[0]);
            navigate('/Company/user/email/send', { state: { emailToForward: email } });
        }
    };

    // 메일 작성 버튼 클릭
    const handleCompose = () => {
        navigate('/Company/user/email/send');
    };

    // 상세 검색 토글
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

    return (
        <div className={styles.Container}>
            <div className={styles['toolbar']}>
                <div className={styles['left-buttons']}>
                    <button
                        className={styles['btn']}
                        onClick={handleDelete}
                        disabled={selectedEmails.length === 0}
                    >
                        삭제
                    </button>
                    <button
                        className={styles['btn']}
                        onClick={handleReply}
                        disabled={selectedEmails.length !== 1}
                    >
                        답장
                    </button>
                    <button
                        className={styles['btn']}
                        onClick={handleForward}
                        disabled={selectedEmails.length !== 1}
                    >
                        전달
                    </button>
                </div>
                {/* 검색 바 및 버튼 추가 */}
                <div className={styles['search-bar']}>
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
                    <button className={styles['detail-button']} onClick={toggleDetailSearch}>
                        상세
                    </button>
                </div>
            </div>
            {/* 상세 검색 영역 */}
            {showDetailSearch && (
                <div
                    className={styles['detail-search']}
                    ref={detailSearchRef}
                >
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
                        <button className={styles['search-button']} onClick={handleSearch}>
                            검색
                        </button>
                    </div>
                </div>
            )}
            <table className={styles['email-table']}>
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </th>
                        <th style={{ width: '10%' }}></th>
                        <th style={{ width: '20%' }}>보낸 사람</th>
                        <th style={{ width: '30%' }}>제목</th>
                        <th style={{ width: '30%' }}>받은 시간</th>
                    </tr>
                </thead>
                <tbody>
                    {emails.map((email) => (
                        <tr
                            key={email.emailNo}
                            className={`${email.status === 'unread' ? styles.unread : ''} ${selectedEmails.includes(email.emailNo) ? styles.selected : ''
                                }`}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedEmails.includes(email.emailNo)}
                                    onChange={() => handleCheckboxChange(email.emailNo)}
                                />
                            </td>
                            <td onClick={() => handleEmailClick(email)}>
                                {email.status === 'unread' ? (
                                    <FontAwesomeIcon icon={faEnvelope} style={{ color: 'skyblue' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faEnvelopeOpen} />
                                )}
                            </td>
                            <td onClick={() => handleEmailClick(email)}>{email.writerDisplayInfo}</td>
                            <td onClick={() => handleEmailClick(email)}>{email.title}</td>
                            <td onClick={() => handleEmailClick(email)}>{email.sendDate.replace('T', ' ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.footer}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className={styles.pagination}
                />
                <ComposeButton onClick={handleCompose} className={styles.composeButton} />
            </div>

        </div>
    );
}

export default CompanyUserEmail;
