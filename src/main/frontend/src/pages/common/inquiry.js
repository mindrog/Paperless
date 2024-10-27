import React, { useState } from 'react';
import '../../styles/layout/inquiry.css';
import Modal from 'react-modal';

function Inquiry() {
    const [modal1IsOpen, setModal1IsOpen] = useState(false);
    const [modal2IsOpen, setModal2IsOpen] = useState(false);

    const openModal1 = () => setModal1IsOpen(true);
    const closeModal1 = () => setModal1IsOpen(false);
    const openModal2 = () => setModal2IsOpen(true);
    const closeModal2 = () => setModal2IsOpen(false);

    // 폼 제출 핸들러 추가
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('inqu_compName', e.target.inqu_compName.value);
        formData.append('inqu_compType', e.target.inqu_compType.value);
        formData.append('inqu_writer', e.target.inqu_writer.value);
        formData.append('inqu_email', e.target.inqu_email.value);
        formData.append('inqu_phone', e.target.inqu_phone.value);
        formData.append('inqu_numberOfPeople', e.target.inqu_numberOfPeople.value);

        try {
            const response = await fetch('http://localhost:8080/api/inquirysend', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // 원하는 응답 형식
                }
            });

            if (response.ok) {
                alert('폼이 성공적으로 제출되었습니다.');
            } else {
                alert('폼 제출에 실패했습니다.');
            }
        } catch (error) {
            console.error('폼 제출 오류:', error);
            alert('폼 제출 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className='inquiry_form_container'>
            <div className='inquiry_form_title'>
                <p className='inquiry_form_title_main'>도입 신청하기</p>
                <p className='inquiry_form_title_sub'>문의하신 내용을 검토하여 상당 진행해드릴 예정입니다.</p>
                <p className='inquiry_form_title_sub2'>귀사를 위한 최적의 솔루션을 안내드리고 있습니다.</p>
                <p className='inquiry_form_title_info'>*표시된 항목은 필수 항목입니다.</p>
            </div>

            <form className='inquiry_form' onSubmit={handleSubmit}>
                <div className='input_company_name_container'>
                    <p className='input_company_name_title'>* 회사 명을 입력해주세요</p>
                    <input type='text' className='input_company_name' name='inqu_compName' required />
                </div>
                <div className='input_company_name_container'>
                    <p className='input_company_name_title'>* 회사 업종을 선택해주세요</p>
                    <select className='input_company_type' name='inqu_compType' required>
                        <option value="IT">IT</option>
                        <option value="제조/건설">제조/건설</option>
                        <option value="의료/건설">의료/건설</option>
                        <option value="교육">교육</option>
                        <option value="미디어/광고/엔터테인먼트">미디어/광고/엔터테인먼트</option>
                        <option value="금융">금융</option>
                        <option value="유통">유통</option>
                        <option value="공공">공공</option>
                        <option value="법무/세무/노무">법무/세무/노무</option>
                        <option value="여행/숙박/식음료/미용">여행/숙박/식음료/미용</option>
                        <option value="비영리단체">비영리단체</option>
                        <option value="방산">방산</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div className='input_company_name_container'>
                    <p className='input_company_name_title'>* 신청하시는 분의 이름을 입력해주세요</p>
                    <input type='text' className='input_client_name' name='inqu_writer' required />
                </div>
                <div className='input_company_name_container'>
                    <p className='input_company_name_title'>* 이메일을 입력해주세요</p>
                    <input type='email' className='input_client_email' name='inqu_email' required />
                </div>
                <div className='input_company_name_container'>
                    <p className='input_company_name_title'>* 전화 번호를 입력해주세요</p>
                    <input type='text' className='input_client_phone' name='inqu_phone' required />
                </div>
                <div className='input_company_name_container'>
                    <p className='input_company_name_title'>* 회사의 예상 인원을 입력해주세요</p>
                    <input type='text' className='input_company_scale' name='inqu_numberOfPeople' required />
                </div>
                <div className='form_blank'></div>
                <div className='form_accept_container'>
                    <p className='form_accept_title'>개인정보 수집 및 이용에 대한 안내</p>
                    <div className='form_accept1'>
                        <input type='checkbox' className='form_accept_checkbox1' required />
                        <p className='form_accept_p'>(필수)</p>
                        <a className='form_accept_a' href="#" onClick={(e) => { e.preventDefault(); openModal1(); }}>개인정보 수집 및 이용</a>
                        <p className='form_accept_p'>에 동의합니다</p>
                    </div>
                    <div className='form_accept2'>
                        <input type='checkbox' className='form_accept_checkbox2' required />
                        <p className='form_accept_p'>(필수)</p>
                        <a className='form_accept_a' href="#" onClick={(e) => { e.preventDefault(); openModal2(); }}>개인정보 제3자 제공</a>
                        <p className='form_accept_p'>에 동의합니다</p>
                    </div>
                    <p className='form_accept_sub'>위 동의를 거부할 권리가 있으며, 필수 항목의 동의를 거부하실 경우 문의 처리 및 결과 회신이 제한됩니다.</p>
                    <button type='submit' className='submit_inquiry_form'>제출하기</button>
                </div>
            </form>

            <Modal className='modal1' isOpen={modal1IsOpen} onRequestClose={closeModal1} contentLabel="Modal 1">
                {/* 모달 내용 */}
            </Modal>

            <Modal className='modal2' isOpen={modal2IsOpen} onRequestClose={closeModal2} contentLabel="Modal 2">
                {/* 모달 내용 */}
            </Modal>
        </div>
    );
}

export default Inquiry;