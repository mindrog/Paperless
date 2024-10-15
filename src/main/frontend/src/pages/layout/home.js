import React,{ useEffect, useState } from 'react';
import logo from '../../img/logo-img.png';

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

function Home() {
    const [isVisible, setIsVisible] = useState(false);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // 특정 스크롤 위치에 도달했을 때 이미지를 표시
        if (scrollPosition > 900) { // 원하는 스크롤 위치 (예: 200px)
            setIsVisible(true);
            console.log("도달");
            } else {
            setIsVisible(false);
            console.log("이탈");
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
            <div className='main_cont_2'>
                 <div className={`main_cont_2_type1 ${isVisible ? 'show' : ''}`}>
                    <img src={logo} className='type1' alt='Description'></img>
                </div>
                <div className='main_cont_2_type2'>

                </div>
                <div className='main_cont_2_type3'>

                </div>
                <div className='main_cont_2_type4'>

                </div>
            </div>
            <div className='main_cont_3'>

            </div>
            <div className='main_cont_4'>

            </div>
            <button type='button' className='top_btn' onClick={scrollToTop}></button>
        </div>

    );
}

export default Home;