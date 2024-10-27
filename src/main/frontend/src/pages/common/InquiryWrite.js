import React from 'react';
import '../../styles/layout/inquiryWrite.css'
function InquiryWrite () {
    return (
        <div className='inquiryWrite'>
        <div className='inquiryWriteform'>
            <form className='inquiryForm'>
                <p className='inquiryTitle'>문의</p>
                <p className='inquirySubTitle'>Paperless는 여러분들의 많은 문의를 기다립니다.</p>
                <div className='inquiryInput'>
                    <p className='inquirySub'>제목</p>
                    <input type='text' className='inquiryTitleInput'></input>
                </div>
                <div className='inquiryInput'>
                    <p className='inquirySub'>작성자</p>
                    <input type='text' className='inquiryWriterInput'></input>
                </div>
                <div className='inquiryInput'>
                    <p className='inquirySub'>연락처</p>
                    <input type='text' className='inquiryPhoneInput'></input>
                </div>
                <div className='inquiryInput'>
                    <p className='inquirySub'>이메일</p>
                    <input type='email' className='inquiryEmailInput'></input>
                </div>
                <div className='inquiryInputCon'>
                    <p className='inquirySub'>문의 내용</p>
                    <input type='text' className='inquiryContentsInput'></input>
                </div>
                <div className='inquiryBtnContainer'>
                    <button type='button' className='btnBack'>뒤로가기</button>
                    <button type='submit' className='btnSubmit'>전송하기</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default InquiryWrite ;