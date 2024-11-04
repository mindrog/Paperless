// CompanyUserMain.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/company/company_main.module.css';
import '../../styles/style.css';
import Menubar from '../layout/menubar';
import GraphChart from '../layout/GraphChart';
import axios from 'axios';

const reportData = [
    {
        id: 1,
        title: "프로젝트 계획서",
        writer: "배수지",
        created_at: "2024-10-17",
        approval_status: "승인 대기",
    },
    {
        id: 2,
        title: "예산 보고서",
        writer: "배수지",
        created_at: "2024-10-16",
        approval_status: "승인 완료",
    },
    {
        id: 3,
        title: "업무 진행 상황 보고",
        writer: "배수지",
        created_at: "2024-10-14",
        approval_status: "반려",
    },
    {
        id: 4,
        title: "연구 개발 계획서",
        writer: "배수지",
        created_at: "2024-10-14",
        approval_status: "승인 완료",
    },
    {
        id: 5,
        title: "회계 감사 보고서",
        writer: "배수지",
        created_at: "2024-10-10",
        approval_status: "반려",
    },
];



function CompanyUserMain() {
    const [mailboxData, setMailboxData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('jwt');
    const navigate = useNavigate();
    const [todoList, setTodoList] = useState('');
    const [todoContent, setTodoContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                // 사용자 정보 가져오기
                const userInfoResponse = await axios.get('/api/userinfo', {
                    headers: {
                        'Authorization': token
                    }
                });
                const userInfo = userInfoResponse.data;
                const recipientId = userInfo.emp_no;

                // 이메일 목록 가져오기 (가장 최근 5개)
                const emailsResponse = await axios.get(`/api/emails/list/${recipientId}`, {
                    headers: {
                        'Authorization': token
                    },
                    params: {
                        folder: 'inbox',
                        page: 0,
                        size: 5,
                        sortBy: 'sendDate',
                        sortDir: 'desc'
                    }
                });

                const emails = emailsResponse.data.content;
                setMailboxData(emails);
                setIsLoading(false);
            } catch (err) {
                console.error('이메일 데이터를 가져오는 중 오류 발생:', err);
                setError('이메일 데이터를 가져오는 중 오류가 발생했습니다.');
                setIsLoading(false);
            }
        };

        fetchEmails();
    }, [token]);

    useEffect(() => {
        const fetchTodoList = async () => {
            try {

                const token = localStorage.getItem('jwt');
                const todoListResponse = await axios.get('/api/todolist', {
                    headers: {
                        'Authorization': token
                    }
                });
                const todoList = todoListResponse.data;
                setTodoList(todoList); // 내용이 없으면 빈 문자열로 초기화
                setTodoContent(todoList.todo_content || '');
            } catch (error) {
                console.error('Todo 리스트를 가져오는 중 오류:', error);
                setError('Todo 리스트를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchTodoList();
    }, [token]);

    const handleEmailClick = (email) => {
        navigate('/Company/user/email/detail', { state: { emailNo: email.emailNo } });
        console.log(email.emailNo);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 편집 모드 활성화 함수
    const handleEdit = () => {
        setIsEditing(true);
        // 편집 모드 진입 시 인풋 포커스
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    // 내용 변경 처리 함수
    const handleChange = (e) => {
        setTodoContent(e.target.value);
        // textarea 높이를 자동으로 조절
        e.target.style.height = "auto"; // 먼저 높이를 초기화
        e.target.style.height = `${e.target.scrollHeight}px`; // 콘텐츠 높이에 맞춰 조절
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto"; // 높이 초기화
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // 내용에 맞게 높이 조절

            inputRef.current.focus();
        }
    }, [isEditing]);

    // 저장 함수
    const saveTodo = async () => {
        try {
            console.log('saveTodo 실행!');
            console.log('저장 전 todoContent:', todoContent);
            const token = localStorage.getItem('jwt');
            console.log('isEditing:', isEditing);
            setIsEditing(false);

            await axios.put('/api/todolist',
                { ...todoList, todo_content: todoContent },
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error('Todo 저장 중 오류 발생:', error);
            alert('저장하는 중 오류가 발생했습니다.');
        }
    };

    // 엔터키 혹은 다른 곳 클릭 시 저장
    const handleBlur = () => saveTodo();
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            // 줄 바꿈 유지
            setTodoContent(todoContent + '\n');
        } else if (e.key === 'Enter') {
            // Enter만 눌렀을 때는 저장
            e.preventDefault();
            saveTodo();
        }
    };

    return (
        <div className="container-xl conbox1">
            <Menubar />
            <div className={styles.back}>
                <div className="container text-center">
                    <div className={styles.mainbox}>
                        <div className={styles.gridContainer}>
                            {/* 메일함 섹션 */}
                            <div className={`${styles.gridItem} ${styles.gridItemMailbox}`}>
                                <h3 className={styles.colTitle}>메일함</h3>
                                {/* 로딩 상태 표시 */}
                                {isLoading ? (
                                    <p>로딩 중...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : (
                                    <table className={styles.table}>
                                        <thead className={styles.tablehead}>
                                            <tr>
                                                <th scope="col" className={styles.col}>no</th>
                                                <th scope="col" className={styles.col}>메일 제목</th>
                                                <th scope="col" className={styles.col}>발신자</th>
                                                <th scope="col" className={styles.col}>수신 일시</th>
                                            </tr>
                                        </thead>
                                        <tbody className={styles.tablebody}>
                                            {mailboxData.map((mail) => (
                                                <tr
                                                    key={mail.emailNo}
                                                    onClick={() => handleEmailClick(mail)}
                                                    style={{ cursor: 'pointer' }}
                                                    className={mail.status === 'unread' ? styles.unread : ''}
                                                >
                                                    <td>{mail.emailNo}</td>
                                                    <td>{mail.title}</td>
                                                    <td>{mail.writerDisplayInfo}</td>
                                                    <td>{formatDate(mail.sendDate)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* 최근 작성 보고서 섹션 */}
                            <div className={`${styles.gridItem} ${styles.gridItemApproval}`}>
                                <h3 className={styles.colTitle}>최근 작성 보고서</h3>
                                {/* <hr className={styles.titleBorderBar} /> */}
                                <table className={styles.table}>
                                    <thead className={styles.tablehead}>
                                        <tr>
                                            <th scope="col">no</th>
                                            <th scope="col">문서 제목</th>
                                            <th scope="col">작성자</th>
                                            <th scope="col">작성 날짜</th>
                                            <th scope="col">결재 현황</th>
                                        </tr>
                                    </thead>
                                    <tbody className={styles.tablebody}>
                                        {reportData.map((report) => (
                                            <tr key={report.id}>
                                                <td>{report.id}</td>
                                                <td>{report.title}</td>
                                                <td>{report.writer}</td>
                                                <td>{report.created_at}</td>
                                                <td>{report.approval_status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 기타 섹션들 */}
                            <div className={`${styles.gridItem} ${styles.gridItemTodoList}`}>
                                <h3 className={styles.colTitle}>to do list</h3>
                                <hr className={styles.titleBorderBar} />
                                <div className={styles.divTodoList}>
                                    {isEditing ? (
                                        <textarea ref={inputRef} value={todoContent} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} placeholder="메모를 입력하세요." className={styles.todoInput}
                                        style={{ width: "100%", resize: "none", overflow: "hidden", }} />
                                    ) : (
                                        <div onClick={handleEdit} className={styles.todoContent}>
                                            {todoContent || "메모를 입력하세요."}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`${styles.gridItem} ${styles.gridItemStatistics}`}>
                                <h3 className={styles.colTitle}>통계자료</h3>
                                <GraphChart />
                                {/* <hr className={styles.titleBorderBar} /> */}
                            </div>
                            <div className={`${styles.gridItem} ${styles.gridItemCalendar}`}>
                                <h3 className={styles.colTitle}>캘린더</h3>
                                {/* <hr className={styles.titleBorderBar} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyUserMain;
