import React from 'react';
import styles from '../../styles/company/company_main.module.css';
import '../../styles/style.css';
import Menubar from '../layout/menubar';

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
        writer: "박보영",
        created_at: "2024-10-18",
        approval_status: "승인 대기",
    },
    {
        id: 2,
        title: "예산 보고서",
        writer: "장원영",
        created_at: "2024-10-17",
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
        writer: "차은우",
        created_at: "2024-10-14",
        approval_status: "승인 완료",
    },
    {
        id: 5,
        title: "회계 감사 보고서",
        writer: "박보검",
        created_at: "2024-10-11",
        approval_status: "승인 완료",
    },
];


function CompanyAdminMain() {
    return (
        <div className="container-xl">
            <Menubar />
            <div className={styles.back}>
                <div className={styles.containerbox}>
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
                                <h3 className={styles.colTitle}>수신 보고서</h3>
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
                                <div className={styles.todolist_header}>
                                    <div className={styles.todolist_Insert}>
                                        <span class="material-symbols-outlined">
                                            add
                                        </span>
                                    </div>
                                    <div className={styles.todolist_Delete}>
                                        <span class="material-symbols-outlined">
                                            remove
                                        </span>
                                    </div>
                                </div>
                                <h3 className={styles.colTitle}>to do list</h3>
                                <hr className={styles.titleBorderBar} />
                                <table className={styles.tableTodoList}>
                                    <tbody className={styles.tablebody}>
                                        <tr>
                                            <td><input type="checkbox" /></td>
                                            <td>프로젝트 발표 준비</td>
                                        </tr>
                                    </tbody>
                                    <tr>
                                        <td><input type="checkbox" /></td>
                                        <td>메일 보내기</td>
                                    </tr>
                                </table>
                            </div>
                            <div className={`${styles.gridItem} ${styles.gridItemStatistics}`}>
                                <h3 className={styles.colTitle}>통계자료</h3>
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

export default CompanyAdminMain;