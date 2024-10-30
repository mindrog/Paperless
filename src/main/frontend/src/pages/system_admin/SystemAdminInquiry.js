import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import Menubar from '../layout/menubar';
import axios from 'axios';
import '../../styles/layout/adminInquiry.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function SystemAdminInquiry() {
    const [adminInquiry, setAdminInquiry] = useState([]);
    const [adminRequest, setAdminRequest] = useState([]);
    const token = localStorage.getItem('jwt');
    useEffect(() => {
        const fetchAdminInquiry = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {

                    console.error("토큰이 없습니다.");
                    return;
                }
                const adminInquiryResponse = await axios.get('http://localhost:8080/api/getinquiry', {
                    headers: {
                        'Authorization': token
                    }
                });

                setAdminInquiry(adminInquiryResponse.data);
                console.log(adminInquiryResponse.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        console.log()
        fetchAdminInquiry(adminInquiry);
    }, []);
    const sendInquiryByIndex = async (inquiry, index, token) => {
        try {
            const response = await axios.post('http://localhost:8080/api/approveinquiry', inquiry, {
                headers: {
                    'Authorization': token
                }
            });
            console.log(`Index ${index}에 대한 응답:`, response.data);
        } catch (error) {
            console.error(`Index ${index} 호출 실패:`, error);
        }
    };
    useEffect(() => {
        const fetchAdminRequest = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {

                    console.error("토큰이 없습니다.");
                    return;
                }
                const adminRequestResponse = await axios.get('http://localhost:8080/api/getrequest', {
                    headers: {
                        'Authorization': token
                    }
                });

                setAdminRequest(adminRequestResponse.data);
                console.log("data : " + adminRequestResponse.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        console.log()
        fetchAdminRequest(adminRequest);
    }, []);
    return (
        <div className='adminInquiryPage'>
            <div className='tableContainer'>
            <div className='inquiryTable'>
                <div className='inquirytitle'>도입 문의</div>
                <div>

                    <Form inline>
                        <Row>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    className=" mb-sm-2"
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

                            <th>회사명</th>
                            <th>업종</th>
                            <th>인원수</th>
                            <th>등록일</th>
                            <th>승인</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminInquiry.map((inquiry, index) => (
                            <tr key={inquiry.inqu_no}>
                                <td>{index + 1}</td>

                                <td>{inquiry.inqu_compName}</td>
                                <td>{inquiry.inqu_compType}</td>
                                <td>{inquiry.inqu_numberOfPeople}</td>
                                <td>{new Date(inquiry.inqu_enroll).toLocaleString("ko-KR", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</td>
                                <td><button type='button' onClick={() => sendInquiryByIndex(inquiry, index, token)}>승인</button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className='RuqestTable'>
                <div className='inquirytitle'>문의</div>
                <div>
                    
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
                            <th>제목</th>
                            <th>작성자</th>
                            <th>이메일</th>
                            <th>등록일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminRequest.map((request, index) => (
                            <tr key={request.requ_no}>
                                <td>{index + 1}</td>
                                <td>{request.requ_title}</td>
                                <td>{request.requ_writer}</td>
                                <td>{request.requ_email}</td>
                                <td>{new Date(request.requ_enroll).toLocaleString("ko-KR", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            </div>
        </div>
    );
}

export default SystemAdminInquiry;