import React from 'react';
import styles from '../../styles/company/company_main.module.css'; 
import '../../styles/style.css';
import Menubar from '../layout/menubar';


function Company_admin_main() {
    return (
        <div className="container-xl conbox1">
            <Menubar />
            <div className={styles.back}>
                <div className="container text-center">
                    <div className={styles.mainbox}>
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                <h3 className='coltitle'>메일함</h3>
                                <hr style={{ border: '1px solid #2e3d86', width: '15%', marginBottom: '30px', marginTop: '0px' }} />
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
                                <hr style={{ border: '1px solid #2e3d86', width: '15%', marginBottom: '30px', marginTop: '0px' }} />
                                <table  className={styles.table}>
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
                            <div className={styles.gridItem}>
                                <h3 className='coltitle'>통계자료</h3>
                                <hr style={{ border: '1px solid #2e3d86', width: '15%', marginBottom: '30px', marginTop: '0px' }} />
                            </div>
                            <div className={styles.gridItem}>
                                <h3 className='coltitle'>캘린더</h3>
                                <hr style={{ border: '1px solid #2e3d86', width: '15%', marginBottom: '30px', marginTop: '0px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Company_admin_main ;