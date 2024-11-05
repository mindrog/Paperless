import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import axios from 'axios';
Modal.setAppElement('#root'); // React 18 기준, 루트 엘리먼트를 지정
const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
`;


const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;

    &:hover {
        background-color: #0056b3;
    }
`;
const Label = styled.label`
    font-size: 16px;
    margin-right: 10px;
    display: inline-block;
    vertical-align: baseline; // baseline으로 정렬
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: baseline; // baseline으로 정렬하여 Label과 Input 정렬 맞춤
    margin: 10px 0;
`;

const Input = styled.input`
    padding: 8px;
    font-size: 16px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Select = styled.select`
    padding: 8px;
    font-size: 16px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
`;
const ScheduleModal = ({ isOpen, onRequestClose, onSave }) => {
    const userData = useSelector((state) => state.user.data);
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const[result, setResult] =useState('');
    const [visibility, setVisibility] = useState('company-wide');

    const handleSave = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/scheduleinsert`, {
                params: {
                    emp_no : userData.emp_no,
                    comp_no: userData.emp_comp_no,
                    dept_no: userData.emp_dept_no,
                    sche_title: title,
                    sche_start: start,
                    sche_end:end,
                    visibility : visibility
                },
            });
            // 검색 결과 처리
            setResult(response.data);
            console.log("일정추가 성공 : " + result.data);
        } catch (error) {
            console.error("일정 추가 실패:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="일정 추가"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000, // overlay의 z-index 설정
                    

                },
                content: {
                    width: '30%', // 넓이 설정
                    height: '55vh', // 높이 설정
                    margin: 'auto',  // 화면 중앙 정렬
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-75%, -50%)', // 정확한 중앙 정렬
                    zIndex: 1001
                    // content의 z-index 설정
                }
            }}
        >
            <ModalContainer>
                <h2>일정 추가</h2>

                <InputContainer>
                    <Label>일정 제목</Label>
                    <Input
                        type="text"
                        placeholder="일정 제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </InputContainer>

                <InputContainer>
                    <Label>시작일</Label>
                    <Input
                        type="date"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                </InputContainer>

                <InputContainer>
                    <Label>종료일</Label>
                    <Input
                        type="date"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                    />
                </InputContainer>

                <InputContainer>
                    <Label>공개범위</Label>
                    <Select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="company-wide">회사 전체</option>
                        <option value="department-wide">부서 전체</option>
                        <option value="personal">본인만</option>
                    </Select>
                </InputContainer>

                <ButtonContainer>
                    <Button onClick={handleSave}>저장</Button>
                    <Button onClick={onRequestClose}>취소</Button>
                </ButtonContainer>
            </ModalContainer>
        </Modal>
    );
};

export default ScheduleModal;