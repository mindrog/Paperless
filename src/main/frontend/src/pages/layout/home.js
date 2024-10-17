import React, { useEffect, useState } from 'react';
import { Carousel, Card, Button } from 'react-bootstrap';
import main1 from '../../img/main_content1.png';
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
        title: 'Card Title 1',
        text: 'This is the first card.',
        buttonText: 'Go somewhere 1',
        imgSrc: logo1, // 첫 번째 카드 이미지
        bgc: 'lightsteelblue'
    },
    {
        title: 'Card Title 2',
        text: 'This is the second card.',
        buttonText: 'Go somewhere 2',
        imgSrc: logo2, // 첫 번째 카드 이미지
        bgc: 'darksalmon'
    },
    {
        title: 'Card Title 3',
        text: 'This is the third card.',
        buttonText: 'Go somewhere 3',
        imgSrc: logo3,
        bgc: 'lightpink'
    },
    {
        title: 'Card Title 4',
        text: 'This is the second card.',
        buttonText: 'Go somewhere 2',
        imgSrc: '../../img/logo1.png',
        bgc: 'lightskyblue'  // 두 번째 카드 이미지
    },
    {
        title: 'Card Title 5',
        text: 'This is the third card.',
        buttonText: 'Go somewhere 3',
        imgSrc: '../../img/logo1.png',
        bgc: 'lightgray' // 세 번째 카드 이미지
    }
    ,
    {
        title: 'Card Title 6',
        text: 'This is the second card.',
        buttonText: 'Go somewhere 2',
        imgSrc: '../../img/logo1.png',
        bgc: 'lightblue'  // 두 번째 카드 이미지
    },
    {
        title: 'Card Title 7',
        text: 'This is the third card.',
        buttonText: 'Go somewhere 3',
        imgSrc: '../../img/logo1.png',
        bgc: 'lightgoldenrodyellow'  // 세 번째 카드 이미지
    }
];
const faqs = [
    {
        question: '질문 1: 이 플랫폼은 어떤 기능을 제공하나요?',
        answer: '답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다.답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다답변 1: 이 플랫폼은 문서 작성, 수정, 결재 등 다양한 기능을 제공합니다'
    },
    {
        question: '질문 2: 가격은 어떻게 되나요?',
        answer: '답변 2: 가격은 사용량에 따라 다르며, 자세한 사항은 문의해 주세요.'
    },
    {
        question: '질문 3: 고객 지원은 어떻게 받나요?',
        answer: '답변 3: 고객 지원은 이메일 및 전화로 가능합니다.'
    }
];
const CardComponent = ({ title, text, buttonText, imgSrc, bgc }) => {
    return (
        <Card style={{ width: '23rem' }}>
            <div className='CardImgArea' style={{ backgroundColor: bgc }}>
                <Card.Img variant="top" src={imgSrc} />
            </div>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{text}</Card.Text>
                <Button variant="primary">{buttonText}</Button>
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
          <p>{question}</p>
        </div>
        <div className={`main_cont_4_type1_a ${isOpen ? 'show' : ''}`}>
          <p>{answer}</p>
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
                        <button type='button' className='main_btn1'>도입 문의하기</button>
                        <button type='button' className='main_btn2'>로그인</button>
                    </div>
                    <div></div>
                    <div className='top_btn_box'>
                        <button type='button' className='next_div_btn' onClick={scrollToNext}></button>
                        <button type='button' className='top_btn' onClick={scrollToTop}>top</button>
                    </div>
                </div>
            </div>
            <div className='main_cont_2_title'>
                <p className='main_cont_3_title_type1_text'>협력사 소개</p>
                <p className='main_cont_3_title_type2_text2'>이 외에도 많은 협력사들이 Paperless와 함께하고 있습니다.</p>
            </div>
            <div className='main_cont_2'>
                <div className={`main_cont_2_type1 ${isVisible1 ? 'show' : ''}`}>
                    <div className='type1_img_cont'>
                        <img src={main1} className='type1' alt='Description'></img>
                    </div>
                    <div className='type1_img_script'>
                        <p className='main_script_title'>기능에 대한 제목입니다.</p>
                        <p className='main_script_contents'> 기능기능기능기능</p>
                    </div>
                </div>
                <div className={`main_cont_2_type2 ${isVisible2 ? 'show' : ''}`}>
                    <div className='type2_img_script'>
                        <p className='main_script_title'>보고서 작성 , 수정 부터 결재까지</p>
                        <p className='main_script_contents'> 기능기능기능기능</p>
                    </div>
                    <div className='type2_img_cont'>
                        <img src={main1} className='type1' alt='Description'></img>
                    </div>

                </div>
                <div className={`main_cont_2_type3 ${isVisible3 ? 'show' : ''}`}>
                    <div className='type3_img_cont'>
                        <img src={main1} className='type1' alt='Description'></img>
                    </div>
                    <div className='type3_img_script'>
                        <p className='main_script_title'>기능에 대한 제목입니다.</p>
                        <p className='main_script_contents'> 기능기능기능기능</p>
                    </div>
                </div>
                <div className={`main_cont_2_type4 ${isVisible4 ? 'show' : ''}`}>
                    <div className='type4_img_script'>
                        <p className='main_script_title'>기능에 대한 제목입니다.</p>
                        <p className='main_script_contents'> 기능은 기능입니다. 특히 기능과 기능적인 부분에서 기능스러운 부분이 강조 되며,<br /> 기능을 책임집니다.</p>
                    </div>
                    <div className='type4_img_cont'>
                        <img src={main1} className='type1' alt='Description'></img>
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
                    <p className='main_cont_3_title_type1_text'>협력사 소개</p>
                    <p className='main_cont_3_title_type2_text2'>이 외에도 많은 협력사들이 Paperless와 함께하고 있습니다.</p>
                </div>
                <div className="card-slider">
                    <div className="d-flex  card-slider-track">
                        {cardData.concat(cardData).map((data, index) => (
                            <div key={index} className="m-2">
                                <CardComponent
                                    title={data.title}
                                    text={data.text}
                                    buttonText={data.buttonText}
                                    imgSrc={data.imgSrc} // 이미지 소스 전달
                                    bgc={data.bgc}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='main_cont_4'>
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