// CompanyUserEmail.js

import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/company/company_email.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Pagination from '../component/Pagination';
import ComposeButton from '../component/ComposeButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faPaperclip, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function CompanyUserEmail() {

    // 상태 관리
    const [emails, setEmails] = useState([]); // 이메일 목록
    const navigate = useNavigate(); // 라우팅
    const [selectedEmails, setSelectedEmails] = useState([]); // 선택된 이메일 ID 목록
    const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const emailsPerPage = 10; // 페이지당 이메일 수
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    // 검색 입력 상태
    const [searchInput, setSearchInput] = useState(''); // 기본 검색어 입력
    const [searchTerm, setSearchTerm] = useState(''); // 실제 검색에 사용되는 검색어

    // 상세 검색 상태
    const [showDetailSearch, setShowDetailSearch] = useState(false); // 상세 검색 창 표시 여부
    const [detailSearchInput, setDetailSearchInput] = useState({
        sender: '',
        recipient: '',
        content: '',
        periodOption: '전체 기간',
        startDate: '',
        endDate: '',
        hasAttachment: false,
    });
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

    // 폴더 상태: "inbox" 또는 "trash"
    const [folder, setFolder] = useState("inbox");

    // 백엔드 서버 주소 설정
    const backendUrl = 'http://localhost:8080';

    // 이메일 데이터 가져오기 함수 정의
    const fetchEmails = () => {
        if (!recipientId) {
            console.error('로그인 정보가 없습니다.');
            navigate('/login');
            return;
        }

        const queryParams = new URLSearchParams();

        // 기본 검색어가 있을 경우 추가
        if (searchTerm) {
            queryParams.append('subject', searchTerm);
        }

        // 상세 검색 필터가 있을 경우 추가
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

        // 폴더 파라미터 추가
        queryParams.append('folder', folder);

        // 페이지네이션 파라미터 추가
        queryParams.append('page', currentPage - 1);
        queryParams.append('size', emailsPerPage);

        console.log('emails params:', queryParams.toString());

        fetch(`${backendUrl}/api/emails/list/${recipientId}?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
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
    };

    // 폴더 변경 핸들러
    const handleFolderChange = (selectedFolder) => {
        setFolder(selectedFolder);
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedEmails([]);

    };

    // useEffect에서 fetchEmails 호출
    useEffect(() => {
        fetchEmails();
    }, [currentPage, searchTerm, detailSearch, recipientId, folder, navigate]);

    // 기본 검색 버튼 클릭 핸들러
    const handleBasicSearch = () => {
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedEmails([]);
        setSearchTerm(searchInput); // 기본 검색어 설정
    };

    // 상세 검색 버튼 클릭 핸들러
    const handleDetailSearch = () => {
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedEmails([]);
        setDetailSearch(detailSearchInput); // 상세 검색 필터 설정
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
        navigate('/Company/user/email/detail', { state: { emailNo: email.emailNo } });
        console.log(email.emailNo);
    };

    // 삭제 버튼 클릭 (휴지통으로 이동)
    const handleDelete = () => {
        if (selectedEmails.length === 0) return;

        fetch(`${backendUrl}/api/emails/delete`, {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailIds: selectedEmails }),
        })
            .then(async response => {
                if (response.ok) {
                    // 삭제 성공 시 이메일 목록 재조회
                    setSelectedEmails([]);
                    setSelectAll(false);
                    setCurrentPage(1);
                    fetchEmails();
                    alert('선택한 이메일이 휴지통으로 이동되었습니다.');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            })
            .catch(error => {
                console.error('이메일 삭제 중 오류 발생:', error);
                alert('이메일을 삭제하는 중 오류가 발생했습니다: ' + error.message);
            });
    };

    // 영구 삭제 버튼 클릭 (Trash 폴더에서만 활성화)
    const handlePermanentDelete = () => {
        if (selectedEmails.length === 0) return;

        if (!window.confirm("선택한 이메일을 영구 삭제하시겠습니까?")) {
            return;
        }

        fetch(`${backendUrl}/api/emails/permanent-delete`, {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailIds: selectedEmails }),
        })
            .then(async response => {
                if (response.ok) {
                    // 영구 삭제 성공 시 이메일 목록 재조회
                    setSelectedEmails([]);
                    setSelectAll(false);
                    setCurrentPage(1);
                    fetchEmails();
                    alert('선택한 이메일이 영구 삭제되었습니다.');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            })
            .catch(error => {
                console.error('이메일 영구 삭제 중 오류 발생:', error);
                alert('이메일을 영구 삭제하는 중 오류가 발생했습니다: ' + error.message);
            });
    };

    const handleRestore = () => {
        if (selectedEmails.length === 0) return;

        if (!window.confirm("선택한 이메일을 복구하시겠습니까?")) {
            return;
        }

        fetch(`${backendUrl}/api/emails/restore`, { // 백엔드 API 엔드포인트 확인 필요
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailIds: selectedEmails }),
        })
            .then(async response => {
                if (response.ok) {
                    // 복구 성공 시 이메일 목록 재조회
                    setSelectedEmails([]);
                    setSelectAll(false);
                    setCurrentPage(1);
                    fetchEmails();
                    alert('선택한 이메일이 복구되었습니다.');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            })
            .catch(error => {
                console.error('이메일 복구 중 오류 발생:', error);
                alert('이메일을 복구하는 중 오류가 발생했습니다: ' + error.message);
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
        setDetailSearchInput((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // 기간 옵션 변경 핸들러
    const handlePeriodOptionChange = (e) => {
        const value = e.target.value;
        setDetailSearchInput((prev) => ({
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
            setDetailSearchInput((prev) => ({
                ...prev,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            }));
        } else {
            setDetailSearchInput((prev) => ({
                ...prev,
                startDate: '',
                endDate: '',
            }));
        }
    };

    // 날짜 입력 변경 시 기간 옵션을 '직접입력'으로 변경
    const handleDateInputChange = (e) => {
        const { name, value } = e.target;
        setDetailSearchInput((prev) => ({
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
                    {/* 폴더에 따라 다른 버튼 표시 */}
                    {folder === "inbox" ? (
                        <>
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
                            <button
                                className={`${styles['btn']} ${folder === "trash"}`}
                                onClick={() => handleFolderChange("trash")}
                                disabled={folder === "trash"}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={styles['btn']}
                                onClick={handleRestore}
                                disabled={selectedEmails.length === 0}
                            >
                                복구
                            </button>
                            <button
                                className={styles['btn']}
                                onClick={handlePermanentDelete}
                                disabled={selectedEmails.length === 0}
                            >
                                영구 삭제
                            </button>
                            <button
                                className={`${styles['btn']} ${folder === "inbox"}`}
                                onClick={() => handleFolderChange("inbox")}
                                disabled={folder === "inbox"}
                            >
                                <FontAwesomeIcon icon={faEnvelope} />
                            </button>
                        </>
                    )}

                    {/* 폴더 선택 버튼 */}


                </div>
                {/* 검색 바 및 버튼 추가 */}
                <div className={styles['search-bar']}>
                    {/* 기본 검색 입력 필드 */}
                    <input
                        type="text"
                        placeholder="검색"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className={styles['search-input']}
                    />
                    {/* 기본 검색 버튼 */}
                    <button className={styles['search-button']} onClick={handleBasicSearch}>
                        검색
                    </button>
                    {/* 상세 검색 토글 버튼 */}
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
                            value={detailSearchInput.sender}
                            onChange={handleDetailInputChange}
                        />
                    </div>
                    <div className={styles['detail-field']}>
                        <label>받는 사람</label>
                        <input
                            type="text"
                            name="recipient"
                            value={detailSearchInput.recipient}
                            onChange={handleDetailInputChange}
                        />
                    </div>
                    <div className={styles['detail-field']}>
                        <label>내용</label>
                        <input
                            type="text"
                            name="content"
                            value={detailSearchInput.content}
                            onChange={handleDetailInputChange}
                        />
                    </div>
                    <div className={styles['detail-field']}>
                        <label>기간</label>
                        <select
                            name="periodOption"
                            value={detailSearchInput.periodOption}
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
                            value={detailSearchInput.startDate}
                            onChange={handleDateInputChange}
                        />
                        ~
                        <input
                            style={{ width: '110px' }}
                            type="date"
                            name="endDate"
                            value={detailSearchInput.endDate}
                            onChange={handleDateInputChange}
                        />
                    </div>
                    <div className={styles['detail-field']}>
                        <label style={{ width: '120px' }}>
                            <input
                                type="checkbox"
                                name="hasAttachment"
                                checked={detailSearchInput.hasAttachment}
                                onChange={handleDetailInputChange}
                            />
                            첨부파일 있음
                        </label>
                    </div>
                    <div className={styles['detail-actions']}>
                        {/* 상세 검색 적용 버튼 */}
                        <button className={styles['search-button']} onClick={handleDetailSearch}>
                            상세 검색
                        </button>
                    </div>
                </div>
            )}
            {/* 이메일 목록 테이블 */}
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
                        <th style={{ width: '5%' }}></th>
                        <th style={{ width: '5%' }}></th>
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
                            <td onClick={() => handleEmailClick(email)} style={{ cursor: 'pointer' }}>
                                {email.status === 'unread' ? (
                                    <FontAwesomeIcon icon={faEnvelope} style={{ color: 'skyblue' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faEnvelopeOpen} style={{ color: 'skyblue' }} />
                                )}
                            </td>
                            <td>
                                {email.hasAttachment && (
                                    <FontAwesomeIcon icon={faPaperclip} style={{ color: 'skyblue' }} />
                                )}
                            </td>
                            <td onClick={() => handleEmailClick(email)} style={{ cursor: 'pointer' }}>{email.writerDisplayInfo}</td>
                            <td onClick={() => handleEmailClick(email)} style={{ cursor: 'pointer' }}>{email.title}</td>
                            <td onClick={() => handleEmailClick(email)} style={{ cursor: 'pointer' }}>{email.sendDate.replace('T', ' ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* 하단 푸터: 페이지네이션 및 메일 작성 버튼 */}
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