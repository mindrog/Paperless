import React, { useState } from 'react';
import '../../styles/layout/inquiry.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

function Inquiry() {
    const [modal1IsOpen, setModal1IsOpen] = useState(false);
    const [modal2IsOpen, setModal2IsOpen] = useState(false);
    const navigate = useNavigate();

    const openModal1 = () => setModal1IsOpen(true);
    const closeModal1 = () => setModal1IsOpen(false);
    const openModal2 = () => setModal2IsOpen(true);
    const closeModal2 = () => setModal2IsOpen(false);

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
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('폼이 성공적으로 제출되었습니다.');
                navigate("/"); // 페이지 이동
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

            <Modal
               className='modal1'
                isOpen={modal1IsOpen}
                onRequestClose={closeModal1}
                contentLabel="Modal 1"
            >
                <h2 className="modal-title">개인정보 수집 및 이용 동의</h2>
                <div className="modal-content">
                    <h3>1. 개인정보의 수집 및 이용 목적</h3>
                    <p>
                        회사는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다:
                        <ul>
                            <li>서비스 제공 및 관리</li>
                            <li>고객 문의 응대 및 상담</li>
                            <li>서비스 개선 및 마케팅</li>
                            <li>법적 의무 이행</li>
                        </ul>
                    </p>
                    
                    <h3>2. 수집하는 개인정보 항목</h3>
                    <p>
                        회사는 서비스 이용 과정에서 다음과 같은 개인정보를 수집할 수 있습니다:
                        <ul>
                            <li>성명</li>
                            <li>이메일 주소</li>
                            <li>전화번호</li>
                            <li>주소</li>
                            <li>기타 서비스 제공에 필요한 정보</li>
                        </ul>
                    </p>
                    
                    <h3>3. 개인정보의 보유 및 이용 기간</h3>
                    <p>
                        회사는 수집한 개인정보를 다음의 이유로 필요한 기간 동안 보유합니다:
                        <ul>
                            <li>서비스 제공 기간 동안</li>
                            <li>고객님의 동의를 받았거나 법적 의무가 있을 경우</li>
                        </ul>
                    </p>
                    
                    <h3>4. 개인정보의 제3자 제공</h3>
                    <p>
                        회사는 고객님의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다:
                        <ul>
                            <li>고객님의 동의가 있는 경우</li>
                            <li>법령에 따라 요구되는 경우</li>
                        </ul>
                    </p>
                    
                    <h3>5. 개인정보의 안전성 확보</h3>
                    <p>
                        회사는 고객님의 개인정보를 안전하게 보호하기 위해 다음과 같은 조치를 취하고 있습니다:
                        <ul>
                            <li>암호화된 저장 및 전송</li>
                            <li>내부 관리 체계 구축 및 운영</li>
                            <li>정기적인 보안 점검</li>
                        </ul>
                    </p>
                    
                    <h3>6. 개인정보 처리방침의 변경</h3>
                    <p>
                        회사는 개인정보 처리방침을 변경할 경우, 변경사항을 웹사이트에 공지하여 고객님께 알려드립니다.
                    </p>
                    
                    <h3>7. 고객님의 권리</h3>
                    <p>
                        고객님은 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지 요청을 할 수 있습니다.
                        이러한 요청은 고객센터를 통해 진행할 수 있습니다.
                    </p>
                    
                    <h3>8. 문의사항</h3>
                    <p>
                        개인정보 처리에 관한 문의는 아래의 연락처로 해주시기 바랍니다:
                        <ul>
                            <li>이메일: [이메일 주소]</li>
                            <li>전화: [전화번호]</li>
                        </ul>
                    </p>
                </div>
                <button className="modal-button" onClick={closeModal1}>닫기</button>
            </Modal>


            <Modal
                className='modal2'
                isOpen={modal2IsOpen}
                onRequestClose={closeModal2}
                contentLabel="Modal 2"
            >
                <h2>개인정보 제3자 제공 동의</h2>
                <div>여기에 관련 내용을 작성합니다.</div>

                <h2 className="modal-title">개인정보 제3자 제공 동의</h2>
                <div className="modal-content">
                    <p>본인은 아래와 같은 조건으로 개인정보를 제3자에게 제공하는 것에 동의합니다.</p>
                    <ol>
                        <li><strong>제공받는 자:</strong> [제3자 이름 또는 회사명]</li>
                        <li><strong>제공하는 개인정보의 항목:</strong>
                            <ul>
                                <li>이름</li>
                                <li>연락처</li>
                                <li>이메일 주소</li>
                                <li>기타 필요한 정보</li>
                            </ul>
                        </li>
                        <li><strong>제공 목적:</strong>
                            <ul>
                                <li>[제공받는 자]의 서비스 제공 및 고객 관리</li>
                                <li>마케팅 및 광고 관련 정보 제공</li>
                                <li>서비스 개선 및 연구 분석 목적</li>
                            </ul>
                        </li>
                        <li><strong>보유 및 이용 기간:</strong> 개인정보는 제공 목적이 달성된 후 지체 없이 파기합니다.</li>
                        <li><strong>개인정보 제공에 대한 동의 거부 권리:</strong>
                            본인은 개인정보의 제3자 제공에 동의하지 않을 권리가 있으며, 동의하지 않을 경우 서비스 이용에 제한이 있을 수 있습니다.
                        </li>
                    </ol>
                    <p>개인정보 보호법에 따라, 본인의 개인정보는 안전하게 보호되며, 동의하지 않을 경우에도 불이익이 없음을 알려드립니다.</p>
                </div>
                <button className="modal-button" onClick={closeModal2}>닫기</button>
            </Modal>
        </div>
    );
}

export default Inquiry;
