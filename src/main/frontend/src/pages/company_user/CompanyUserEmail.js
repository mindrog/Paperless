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

function CompanyUserEmail() {

    // 이메일 생성 함수
    const generateEmails = () => {
        const emailList = [];
        for (let i = 1; i <= 30; i++) {
            emailList.push({
                id: i,
                sender: `test${i}@paperless.pl`,
                recipient: `recipient${i}@paperless.pl`,
                subject: `테스트 이메일 ${i}`,
                content: `이것은 이메일 내용 ${i}입니다.`,
                receivedAt: `2024-10-${String(i).padStart(2, '0')} 10:00`,
                hasAttachment: i % 2 === 0, // 짝수 번호 이메일은 첨부파일이 있다고 가정
                isRead: i === 1,
            });
        }
        return emailList;
    };

    const [emails, setEmails] = useState(generateEmails());
    const navigate = useNavigate();
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const emailsPerPage = 10;

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

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
        setSelectAll(false);
        setSelectedEmails([]);
        performSearch();
    };

    // 검색 실행 함수
    const performSearch = () => {
        // 상세 검색 조건에 따라 필터링
        let filtered = emails.filter((email) => {
            // 기본 검색어로 제목과 발신자 검색
            const matchesSearchTerm =
                email.sender.includes(searchTerm) || email.subject.includes(searchTerm);

            // 상세 검색 조건 적용
            const matchesSender = detailSearch.sender
                ? email.sender.includes(detailSearch.sender)
                : true;
            const matchesRecipient = detailSearch.recipient
                ? email.recipient.includes(detailSearch.recipient)
                : true;
            const matchesContent = detailSearch.content
                ? email.content.includes(detailSearch.content)
                : true;

            // 기간 필터링
            let matchesPeriod = true;
            if (detailSearch.startDate && detailSearch.endDate) {
                const emailDate = new Date(email.receivedAt);
                const startDate = new Date(detailSearch.startDate);
                const endDate = new Date(detailSearch.endDate);
                matchesPeriod = emailDate >= startDate && emailDate <= endDate;
            }

            // 첨부파일 유무 필터링
            const matchesAttachment = detailSearch.hasAttachment
                ? email.hasAttachment
                : true;

            return (
                matchesSearchTerm &&
                matchesSender &&
                matchesRecipient &&
                matchesContent &&
                matchesPeriod &&
                matchesAttachment
            );
        });

        setFilteredEmails(filtered);
    };

    // 검색된 이메일 상태
    const [filteredEmails, setFilteredEmails] = useState(emails);

    // 검색어 또는 상세 검색 조건 변경 시 검색 결과 업데이트
    useEffect(() => {
        performSearch();
    }, [emails]);

    // 현재 페이지의 이메일 가져오기
    const indexOfLastEmail = currentPage * emailsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
    const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);

    // 총 페이지 수 재계산
    const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

    // 페이지 번호 생성
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectAll(false);
        setSelectedEmails([]);
    };

    // 이메일 클릭 시 읽음 상태로 변경하고 상세 페이지로 이동
    const handleEmailClick = (email) => {
        setEmails(
            emails.map((e) =>
                e.id === email.id ? { ...e, isRead: true } : e
            )
        );
        navigate('/Company/user/email/detail', { state: { email } });
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
            setSelectedEmails(currentEmails.map((email) => email.id));
        }
        setSelectAll(!selectAll);
    };

    // 삭제 버튼 클릭
    const handleDelete = () => {
        setEmails(emails.filter((email) => !selectedEmails.includes(email.id)));
        setSelectedEmails([]);
        setSelectAll(false);
    };

    // 답장 버튼 클릭
    const handleReply = () => {
        if (selectedEmails.length === 1) {
            const email = emails.find((email) => email.id === selectedEmails[0]);
            navigate('/Company/user/email/send', { state: { receiverEmail: email.sender } });
        }
    };

    // 전달 버튼 클릭
    const handleForward = () => {
        if (selectedEmails.length === 1) {
            const email = emails.find((email) => email.id === selectedEmails[0]);
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
                    {currentEmails.map((email) => (
                        <tr
                            key={email.id}
                            className={`${email.isRead ? '' : styles.unread} ${selectedEmails.includes(email.id) ? styles.selected : ''
                                }`}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedEmails.includes(email.id)}
                                    onChange={() => handleCheckboxChange(email.id)}
                                />
                            </td>
                            <td onClick={() => handleEmailClick(email)}>
                                {email.isRead ? (
                                    <FontAwesomeIcon icon={faEnvelopeOpen} />
                                ) : (
                                    <FontAwesomeIcon icon={faEnvelope} style={{ color: 'skyblue' }} />
                                )}
                            </td>
                            <td onClick={() => handleEmailClick(email)}>{email.sender}</td>
                            <td onClick={() => handleEmailClick(email)}>{email.subject}</td>
                            <td onClick={() => handleEmailClick(email)}>{email.receivedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.footer}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                    className={styles.pagination}

                />
                <ComposeButton onClick={handleCompose} className={styles.composeButton} />
            </div>

        </div>
    );
}

export default CompanyUserEmail;
