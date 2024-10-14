import React from 'react';
import styles from '../../styles/company/company_main.module.css'; 
import '../../styles/style.css';

function Company_admin_main() {
    return (
        <div className="container-xl conbox1">
            <div className={styles.back}>
                <div className="container text-center">
                    <div className={styles.mainbox}>
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                <h3 className='coltitle'>메일함</h3>
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
                                <h3 className='coltitle'>최신 결재 보고서</h3>
                                <table className="table">
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
                            <div className={styles.gridItem}>통계자료</div>
                            <div className={styles.gridItem}>캘린더</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Company_admin_main ;