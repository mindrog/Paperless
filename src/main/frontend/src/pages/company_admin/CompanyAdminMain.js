import React from 'react';
import styles from '../../styles/company/company_main.module.css';
import '../../styles/style.css';
import Menubar from '../layout/menubar';


function CompanyAdminMain() {
    return (
        <div className="container-xl">
            <Menubar />
            <div className={styles.back}>
                <div className={styles.containerbox}>
                    <div className={styles.mainbox}>
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                <h3 className={styles.colTitle}>메일함</h3>
                                <hr className={styles.titleBorderBar} />
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th scope="col" className={styles.col}>no</th>
                                            <th scope="col" className={styles.col}>title</th>
                                            <th scope="col" className={styles.col}>writer</th>
                                            <th scope="col" className={styles.col}>received_at</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.gridItem}>
                                <h3 className={styles.colTitle}>최신 결재 보고서</h3>
                                <hr className={styles.titleBorderBar} />
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th scope="col">no</th>
                                            <th scope="col">First</th>
                                            <th scope="col">Last</th>
                                            <th scope="col">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={`${styles.gridItem} ${styles.gridItemRight}`}>
                                <h3 className={styles.colTitle}>to do list</h3>
                                <hr className={styles.titleBorderBar} />
                            </div>
                            <div className={styles.gridItem}>
                                <h3 className={styles.colTitle}>통계자료</h3>
                                <hr className={styles.titleBorderBar} />
                            </div>
                            <div className={styles.gridItem}>
                                <h3 className={styles.colTitle}>캘린더</h3>
                                <hr className={styles.titleBorderBar} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyAdminMain;