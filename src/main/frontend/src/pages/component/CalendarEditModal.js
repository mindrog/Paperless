import React, { useState, useRef, useEffect } from 'react'
import Modal from 'react-modal';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { identity } from 'lodash';
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
    justify-content: end;
    width: 100%;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 8px 20px;
    font-size: 16px;
    margin : 0 0 0 0.5vw;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #2e3d86;
    color: white;

    &:hover {
        background-color: #0056b3;
    }
`;
const Button2 = styled.button`
    padding: 8px 20px;
    font-size: 16px;
    margin : 0 0 0 0.5vw;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #d1180b;
    color: white;

    &:hover {
        background-color: #f33f32;
    }
`;
const Button3 = styled.button`
    padding: 8px 20px;
    font-size: 16px;
    margin : 0 0.5vw 0 0.5vw;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #8a8a8a;
    color: white;

    &:hover {
        background-color: #9c9c9c;
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
    &:focus {
        border: 3px solid #2e3d86;
    }
`;

const Select = styled.select`
    padding: 6px;
    font-size: 16px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    &:focus {
        border: 3px solid #2e3d86;
    }
`;

const CalendarEditModal = ({ isOpen, onRequestClose, selectedEvent }) => {
    const userData = useSelector((state) => state.user.data);
    const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : '');
    const [id, setID] = useState(selectedEvent ? selectedEvent.id : ''); // 선택된 이벤트의 제목으로 초기화
    const [start, setStart] = useState(selectedEvent ? selectedEvent.start : ''); // 선택된 이벤트의 시작일로 초기화
    const [end, setEnd] = useState(selectedEvent ? selectedEvent.end : ''); // 선택된 이벤트의 종료일로 초기화
    const [result, setResult] = useState('');
    const [visibility, setVisibility] = useState('company-wide');
    console.log(selectedEvent);

    const handleEdit = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/scheduleedit`, {
                params: {
                    sche_no: id,
                    emp_no: userData.emp_no,
                    comp_no: userData.emp_comp_no,
                    dept_no: userData.emp_dept_no,
                    sche_title: title,
                    sche_start: start,
                    sche_end: end,
                    visibility: visibility
                },
            });
            // 검색 결과 처리
            setResult(response.data);
            console.log("일정추가 성공 : " + result.data);
            window.location.reload();
            onRequestClose();
        } catch (error) {
            console.error("일정 추가 실패:", error);
        }
        
    };
    const handleDelete = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/scheduledelete?sche_no=${id}`, {
            });
            // 검색 결과 처리
            setResult(response.data);
            console.log("일정삭제 성공 : " + result.data);
            window.location.reload();
            onRequestClose();
        } catch (error) {
            console.error("일정 삭제 실패:", error);
        }
    };
    useEffect(() => {
        if (selectedEvent) {
            const localStart = new Date(selectedEvent.start);
            const localEnd = selectedEvent.end ? new Date(selectedEvent.end) : localStart;
    
           setTitle(selectedEvent.title);
            const formatToLocalDate = (date) => date.toLocaleDateString('en-CA'); // 'en-CA'는 YYYY-MM-DD 형식
    
            setStart(formatToLocalDate(localStart));
            setID(selectedEvent.id);
            setEnd(formatToLocalDate(localEnd));
    
            console.log("selected start : " + selectedEvent.start);
            
        }
    }, [selectedEvent]);
    console.log("start : " + start);
    const options = visibility === "company-wide"
        ? [
            { value: "company-wide", label: "회사 전체" },
            { value: "department-wide", label: "부서 전체" },
            { value: "personal", label: "본인만" },
        ]
        : visibility === "department-wide"
            ? [
                { value: "department-wide", label: "부서 전체" },
                { value: "personal", label: "본인만" },
                { value: "company-wide", label: "회사 전체" },
            ]
            : [{ value: "personal", label: "본인만" },
            { value: "company-wide", label: "회사 전체" },
            { value: "department-wide", label: "부서 전체" },
            ];
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            selectedEvent={selectedEvent}
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
                <h2>일정 수정</h2>

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
                    <Button onClick={handleEdit}>수정</Button>
                    <Button2 onClick={handleDelete}>삭제</Button2>
                    <Button3 onClick={onRequestClose}>취소</Button3>
                </ButtonContainer>
            </ModalContainer>
        </Modal>
    );
};

export default CalendarEditModal;