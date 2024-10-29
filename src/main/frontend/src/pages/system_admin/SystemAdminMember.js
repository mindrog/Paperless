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

            <div>직원 관리</div>
            <div>
                <Form inline>
                    <Button variant="primary">Primary</Button>
                    <Button variant="primary">Primary</Button>
                </Form>
                <Form inline>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                className=" mr-sm-2"
                            />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Submit</Button>
                        </Col>
                    </Row>
                </Form>
                
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>ID</th>
                        <th>회사명</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>연락처</th>
                        <th>등록일</th>
                        <th>인원수</th>
                    </tr>
                </thead>
                <tbody>
                {adminMember.map((member, index) => (
                        <tr key={member.emp_no}>
                            <td>{index + 1}</td>
                            <td>{member.emp_code}</td>
                            <td>{member.comp_name}</td>
                            <td>{member.emp_name}</td>
                            <td>{member.comp_email}</td>
                            <td>{member.comp_phone}</td>
                            <td>{member.emp_enroll_date}</td>
                            <td>{member.comp_headcount}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
          
        </div>
    );
}

export default SystemAdminMember;