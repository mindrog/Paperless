import React, { useEffect, useState } from 'react';
import { Table, Button, Form,Row,Col} from 'react-bootstrap';
import Menubar from '../layout/menubar';
import axios from 'axios';

function SystemAdminMember () {
    const [adminMember, setAdminMember] = useState([]);
    
    useEffect(() => {
        const fetchAdminMember = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    
                    console.error("토큰이 없습니다.");
                    return;
                }
                const adminMemberResponse = await axios.get('http://localhost:8080/api/getadminusers', {
                    headers: {
                        'Authorization': token
                    }
                });
                
                setAdminMember(adminMemberResponse.data);
                console.log(adminMemberResponse.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        console.log()
        fetchAdminMember(adminMember);
    }, []);
    return (
    
        <div className="container-xl">
            <Menubar />

            <h2 s>직원 관리</h2>
            <div>
                
                
                
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>회사명</th>
                        <th>업종</th>
                        <th>담당자</th>
                        <th>이메일</th>
                        <th>연락처</th>
                        <th>인원수</th>
                    </tr>
                </thead>
                <tbody>
                {adminMember.map((company, index) => (
                        <tr key={company.comp_no}>
                            <td>{index + 1}</td>
                            <td>{company.comp_name}</td>
                            <td>{company.comp_industry}</td>
                            <td>{company.comp_requester}</td>
                            <td>{company.comp_email}</td>
                            <td>{company.comp_phone}</td>
                            <td>{company.comp_headcount}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
          
        </div>
    );
}

export default SystemAdminMember;