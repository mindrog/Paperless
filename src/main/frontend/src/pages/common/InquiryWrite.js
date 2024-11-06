import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/layout/inquiryWrite.css';

function InquiryWrite() {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const formData = new FormData();
        formData.append('requ_title', e.target.requ_title.value);
        formData.append('requ_writer', e.target.requ_writer.value);
        formData.append('requ_phone', e.target.requ_phone.value); // 수정
        formData.append('requ_email', e.target.requ_email.value); // 수정
        formData.append('requ_contents', e.target.requ_contents.value); // 수정
        

        try {
            const response = await fetch('http://localhost:8080/api/requestsend', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // 원하는 응답 형식
                }
            });

            if (response.ok) {
                alert('문의가 성공적으로 제출되었습니다.');
                navigate("/");
            } else {
                alert('문의 제출에 실패했습니다.');
            }
        } catch (error) {
            console.error('폼 제출 오류:', error);
            alert('문의 제출 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className='requestWrite'>
            <div className='requestWriteform'>
                <form className='irequestForm' onSubmit={handleSubmit}>
                    <p className='requestTitle'>문의</p>
                    <p className='requestSubTitle'>Paperless는 여러분들의 많은 문의를 기다립니다.</p>
                    <div className='requestInput'>
                        <p className='requestSub'>제목</p>
                        <input type='text' className='requestTitleInput' name='requ_title' required />
                    </div>
                    <div className='requestInput'>
                        <p className='requestSub'>작성자</p>
                        <input type='text' className='requestWriterInput' name='requ_writer' required />
                    </div>
                    <div className='requestInput'>
                        <p className='requestSub'>연락처</p>
                        <input type='text' className='requestPhoneInput' name='requ_phone' required />
                    </div>
                    <div className='requestInput'>
                        <p className='requestSub'>이메일</p>
                        <input type='email' className='requestEmailInput' name='requ_email' required />
                    </div>
                    <div className='requestInputCon'>
                        <p className='requestSub'>문의 내용</p>
                        <input type='text' className='requestContentsInput' name='requ_contents' required />
                    </div>
                    <div className='requestBtnContainer'>
                        <button type='button' className='btnBack'>뒤로가기</button>
                        <button type='submit' className='btnSubmit'>전송하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InquiryWrite;