import React from 'react';
import styles from '../../styles/company/company_main.module.css';
import '../../styles/style.css';
import Menubar from '../layout/menubar';
import GraphChart from '../layout/GraphChart';
import axios from 'axios';
const mailboxData = [
    {
        id: 1,
        title: "Project Update",
        writer: "Mark",
        received_at: "2024-10-16",
    },
    {
        id: 2,
        title: "Meeting Schedule",
        writer: "John",
        received_at: "2024-10-11",
    },
    {
        id: 3,
        title: "Invoice Submission",
        writer: "Jane",
        received_at: "2024-10-11",
    },
    {
        id: 4,
        title: "Meeting Project",
        writer: "Mark",
        received_at: "2024-10-09",
    },
    {
        id: 5,
        title: "Invoice Submission Update",
        writer: "Jane",
        received_at: "2024-10-03",
    }
];

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
    const token = localStorage.getItem('jwt');
    
    axios.get('http://localhost:8080/api/userinfo', {
        headers: {
            'Authorization': token // 발급받은 토큰
        }
    })
    .then(response => console.log(response.data))
    .catch(error => console.error('Error:', error));
    
    return (
        <div className="container-xl conbox1">
            <Menubar />
            <div className={styles.back}>
                <div className="container text-center">
                    <div className={styles.mainbox}>
                        <div className={styles.gridContainer}>
                            <div className={`${styles.gridItem} ${styles.gridItemMailbox}`}>
                                <h3 className={styles.colTitle}>메일함</h3>
                                {/* <hr className={styles.titleBorderBar} /> */}
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
                                            <tr key={mail.id}>
                                                <td>{mail.id}</td>
                                                <td>{mail.title}</td>
                                                <td>{mail.writer}</td>
                                                <td>{mail.received_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                            <div className={`${styles.gridItem} ${styles.gridItemTodoList}`}>
                                <h3 className={styles.colTitle}>to do list</h3>
                                <hr className={styles.titleBorderBar} />
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