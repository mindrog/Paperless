import React, { useEffect, useState } from 'react';
import { Carousel, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import main1 from '../../img/main_content1.png';
import godown from '../../img/godownwhite.png'
import main2 from '../../img/main_main.png';
import main3 from '../../img/main_main2.png';
import main4 from '../../img/main_main3.png';
import logo1 from '../../img/logo1.png';
import logo2 from '../../img/logo2.png';
import logo3 from '../../img/logo3.png';
import logo4 from '../../img/logo4.png';
import logo5 from '../../img/logo5.png';
import logo6 from '../../img/logo6.png';
import logo7 from '../../img/logo7.png';
import logo8 from '../../img/logo8.png';
import logo9 from '../../img/logo9.png';
import logo10 from '../../img/logo10.png';
import logo11 from '../../img/logo11.png';
import logo12 from '../../img/logo12.png';
import girl1 from '../../img/main_girl1.png';
import girl2 from '../../img/main_girl2.png';
import girl3 from '../../img/main_girl3.png';
import girl4 from '../../img/main_girl4.png';
import boy1 from '../../img/main_boy1.png';
import boy2 from '../../img/main_boy2.png';
import boy3 from '../../img/main_boy3.png';


import '../../styles/layout/home.css';

const getScrollPosition = () => {
    const scrollPosition = window.scrollY || window.pageYOffset;
    console.log("현재 스크롤 위치:", scrollPosition);
    return scrollPosition;
};

// 스크롤을 최상단으로 올리는 함수
const scrollToTop = () => {
    const currentPosition = getScrollPosition();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("스크롤을 최상단으로 이동했습니다. 이전 위치:", currentPosition);
};
const scrollToNext = () => {
    window.scrollTo({ top: 868, behavior: 'smooth' });
}
const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo12];
const cardData = [
    {
        title: '김민수, 중소기업 팀장',
        text: '“Paperless 덕분에 팀의 업무 효율이 눈에 띄게 향상되었습니다. 다양한 보고서 템플릿이 있어 매번 처음부터 작성할 필요 없이 시간을 절약할 수 있습니다!”',

        imgSrc: boy1, // 첫 번째 카드 이미지
        bgc: 'lightsteelblue'
    },
    {
        title: '이영희, 대기업 관리자',
        text: '“실시간 협업 기능이 정말 유용해요. 팀원들과 함께 작업하며 피드백을 주고받는 과정이 훨씬 수월해졌습니다. 프로젝트 진행이 더 빠르고 효율적이에요.”',

        imgSrc: girl1, // 첫 번째 카드 이미지
        bgc: 'darksalmon'
    },
    {
        title: '박지훈, 스타트업 CEO',
        text: '“클라우드 저장 기능 덕분에 언제 어디서나 문서에 접근할 수 있어 매우 편리합니다. 자동 저장도 정말 마음에 들어요. 데이터 유실 걱정이 없어졌습니다!”',

        imgSrc: boy2,
        bgc: 'lightpink'
    },
    {
        title: '최하나, 프리랜서',
        text: '“직관적인 인터페이스 덕분에 처음 사용하더라도 쉽게 적응할 수 있었습니다. 필요한 기능이 모두 모여 있어 정말 만족스럽습니다.”',

        imgSrc: girl2,
        bgc: 'lightskyblue'  // 두 번째 카드 이미지
    },
    {
        title: '홍상희, 공공기관 직원',
        text: '“보고서 작성이 이렇게 간편해질 줄은 몰랐습니다. Paperless를 통해 팀 내 소통도 활발해지고, 업무의 체계성이 확실히 개선되었습니다!”',

        imgSrc: girl3,
        bgc: 'lightgray' // 세 번째 카드 이미지
    }
    ,
    {
        title: '정수민, 교육 기관 관리자',
        text: '“Paperless를 사용한 이후로 문서 작성이 훨씬 간편해졌습니다. 교육 관련 보고서를 작성할 때 필요한 템플릿이 많아 큰 도움이 되고 있습니다. 팀원들과의 협업도 원활해져서 업무 진행 속도가 빨라졌어요!”',

        imgSrc: girl4,
        bgc: 'lightblue'  // 두 번째 카드 이미지
    },
    {
        title: '이민호, IT 회사 개발자',
        text: '“실시간 협업 기능이 특히 유용합니다. 여러 팀원과 동시에 작업할 수 있어 아이디어를 빠르게 교환하고, 프로젝트 진행 상황을 즉시 확인할 수 있어요. Paperless 덕분에 팀워크가 더욱 강화되었습니다!”',

        imgSrc: boy3,
        bgc: 'lightgoldenrodyellow'  // 세 번째 카드 이미지
    }
];
const faqs = [
    {
        question: 'Q1. 보고서 템플릿은 어떻게 사용하나요?',
        answer: 'A1. Paperless에서 제공하는 보고서 템플릿은 미리 설정된 형식으로, 필요에 따라 수정하여 사용할 수 있습니다. 간편하게 제목과 내용을 입력하면 전문적인 보고서를 빠르게 작성할 수 있습니다.'
    },
    {
        question: 'Q2. Paperless를 사용하기 위해 필요한 시스템 요구 사항은 무엇인가요?',
        answer: 'A2. Paperless는 웹 기반 플랫폼으로, 최신 브라우저(Chrome, Firefox, Safari 등)와 안정적인 인터넷 연결만 있으면 사용 가능합니다. 특별한 설치가 필요하지 않습니다.'
    },
    {
        question: 'Q3. 고객 지원은 언제 이용할 수 있나요??',
        answer: 'A3. 고객 지원팀은 평일 근무 시간 동안 운영되며, 이메일 및 채팅을 통해 문의할 수 있습니다. 긴급한 문제는 우선 순위로 처리됩니다.'
    }
];
const CardComponent = ({ title, text, imgSrc, bgc }) => {
    return (
        <Card style={{ width: '23rem' }}>
            <div className='CardImgArea' style={{ backgroundColor: bgc }}>
                <Card.Img variant="top" src={imgSrc} />
            </div>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <div className='card_text'>
                    <Card.Text>{text}</Card.Text>
                </div>

            </Card.Body>
        </Card>
    );
};
const FAQComponent = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAnswer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='main_cont_4_type1'>
            <div className='main_cont_4_type1_q' onClick={toggleAnswer}>
                <p className='qa_q'>{question}</p>
            </div>
            <div className={`main_cont_4_type1_a ${isOpen ? 'show' : ''}`}>
                <p className='qa_a'>{answer}</p>
            </div>
        </div>
    );
};

function Home() {
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isVisible4, setIsVisible4] = useState(false);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // 특정 스크롤 위치에 도달했을 때 이미지를 표시
        if (scrollPosition > 828) { // 원하는 스크롤 위치 (예: 200px)
            setIsVisible1(true);

        } else {
            setIsVisible1(false);

        }

        if (scrollPosition > 1350) { // 원하는 스크롤 위치 (예: 200px)
            setIsVisible2(true);

        } else {
            setIsVisible2(false);

        }
        if (scrollPosition > 1600) { // 원하는 스크롤 위치 (예: 200px)
            setIsVisible3(true);

        } else {
            setIsVisible3(false);

        }
        if (scrollPosition > 1850) { // 원하는 스크롤 위치 (예: 200px)
            setIsVisible4(true);

        } else {
            setIsVisible4(false);

        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (

        <div className='main_cont'>
            <div className='cont1_bg'>
                <div className='main_cont_1'>

                    <div className='main_cont_1_title_type1'>
                        <p className='main_cont_1_title_type1_text'>당신의 일이 쉬워질 수 있도록</p>
                    </div>
                    <div className='main_cont_1_title_type2'>
                        <p className='main_cont_1_title_type2_text'>Paperless</p>
                    </div>
                    <div className='main_cont_1_title_type3'>
                        <p className='main_cont_1_title_type3_text'>편리한 방식으로 업무할 수 있도록 도와드리는 업무 플랫폼 입니다.</p>
                        <p className='main_cont_1_title_type3_text2'>소통, 협업 등을 하나의 공간에서 활용하여 생산성을 높여보세요.</p>
                    </div>
                    <div className='main_cont_1_btn_container'>
                        <Link to="/inquiry" className='main_btn1'>
                            도입 신청하기
                        </Link>
                        <Link to="/login" className='main_btn2'>
                            로그인
                        </Link>
                    </div>
                    <div></div>
                    <div className='top_btn_box'>
                        <img src={godown} className='next_div_btn' onClick={scrollToNext} alt='Description' />
                        <button type='button' className='top_btn' onClick={scrollToTop}>top</button>
                    </div>
                </div>
            </div>
            <div className='main_cont_2_title'>
                <p className='main_cont_3_title_type1_text'>기능 소개</p>
                <p className='main_cont_3_title_type2_text2'>Paperless는 다양한 기능을 통해 보고서 작성 및 관리의 효율성을 극대화합니다.</p>
            </div>
            <div className='main_cont_2'>
                <div className={`main_cont_2_type1 ${isVisible1 ? 'show' : ''}`}>
                    <div className='type1_img_cont'>
                        <img src={main2} className='type1' alt='Description'></img>
                    </div>
                    <div className='type1_img_script'>
                        <p className='main_script_title'>직원 관리, 물자 관리, 문서 관리를 한번에 </p>
                        <p className='main_script_contents'> 효율적인 업무 운영을 위해 더 이상 여러 시스템을 사용할 필요가 없습니다. 우리 그룹웨어는 직원 관리, 물자 관리, 문서 관리 기능을 통합하여 모든 업무를 간편하게 처리할 수 있는 솔루션입니다.</p>
                    </div>
                </div>
                <div className={`main_cont_2_type2 ${isVisible2 ? 'show' : ''}`}>
                    <div className='type2_img_script'>
                        <p className='main_script_title'>보고서 작성 , 수정 부터 결재까지 간편하게</p>
                        <p className='main_script_contents'> 효율적인 업무 환경을 위한 필수 도구! Paperless는 보고서 작성과 수정, 결재 과정까지 모두 통합하여 간편하게 관리할 수 있습니다.


                        </p>
                    </div>
                    <div className='type2_img_cont'>
                        <img src={main3} className='type1' alt='Description'></img>
                    </div>

                </div>
                <div className={`main_cont_2_type3 ${isVisible3 ? 'show' : ''}`}>
                    <div className='type3_img_cont'>
                        <img src={main4} className='type1' alt='Description'></img>
                    </div>
                    <div className='type3_img_script'>
                        <p className='main_script_title'>채팅과 이메일을 통한 소통을 원활하게 </p>
                        <p className='main_script_contents'> 효율적인 커뮤니케이션은 성공적인 팀워크의 핵심입니다. <br />우리 그룹웨어는 채팅과 이메일 기능을 통합하여 팀원 간의 소통을 더욱 원활하게 만들어줍니다.</p>
                    </div>
                </div>
                <div className={`main_cont_2_type4 ${isVisible4 ? 'show' : ''}`}>
                    <div className='type4_img_script'>
                        <p className='main_script_title'>peperless가 제공하는<br /> 다양한 보고서 템플릿!</p>
                        <p className='main_script_contents'> 효율적인 업무 처리를 위해 Paperless는 다양한 보고서 템플릿을 제공합니다. 각 템플릿은 사용자의 필요에 맞춰 설계되어, 빠르고 간편하게 전문적인 보고서를 작성할 수 있도록 돕습니다.</p>
                    </div>
                    <div className='type4_img_cont'>
                        <img src={main2} className='type1' alt='Description'></img>
                    </div>

                </div>
            </div>
            <div className='main_cont_3_title'>
                <p className='main_cont_3_title_type1_text'>협력사 소개</p>
                <p className='main_cont_3_title_type2_text2'>이 외에도 많은 협력사들이 Paperless와 함께하고 있습니다.</p>

            </div>
            <div className='main_cont_3'>
                <div className="logo-slider">
                    <div className="logo-slider-track">

                        {logos.concat(logos).map((logo, index) => (
                            <div className="logo" key={index}>
                                <img src={logo} alt={`Logo ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='main_cont_4'>
                <div className='main_cont_3_title'>

                    <p className='main_cont_3_title_type1_text'>고객 후기</p>
                    <p className='main_cont_3_title_type2_text2'>우리 Paperless를 사용한 고객들의 생생한 후기를 소개합니다!</p>
                </div>
                <div className="card-slider">
                    <div className="d-flex  card-slider-track">
                        {cardData.concat(cardData).map((data, index) => (
                            <div key={index} className="m-2">
                                <CardComponent
                                    title={data.title}
                                    text={data.text}

                                    imgSrc={data.imgSrc} // 이미지 소스 전달
                                    bgc={data.bgc}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='main_cont_5'>
                <div className='main_cont_3_title'>
                    <p className='main_cont_3_title_type1_text'>자주 묻는 질문</p>
                </div>
                <div className='faq'>
                    {faqs.map((faq, index) => (
                        <FAQComponent
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>
            </div>
            <button type='button' className='top_btn' onClick={scrollToTop}></button>
        </div>

    );
}

export default Home;