import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import styled from 'styled-components'
import { useSelector } from 'react-redux';
import '../../styles/company/company_user_calender.css'
import ScheduleModal from '../component/CalendarModal'

const FullCalendarContainer = styled.div
`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  // 캘린더 전체 사이즈 조정
  .fc {
    width: 70%;
    height:  90%;
  }

  // toolbar container
  .fc .fc-toolbar.fc-header-toolbar {
    margin: 0;
    padding: 0 40px;
    background-color: #2e3d86;
    height: 63px;
    font-weight: 600;
    font-size: 12px;
    line-height: 29px;
    color: white;
    border-radius: 20px 20px 0px 0px;
  }

  // toolbar 버튼
  .fc .fc-button-primary {
    background-color: transparent;
    border: none;

    span {
      font-weight: 500;
      font-size: 28px;
    }

    :hover {
      background-color: transparent;
    }
  }

  // 요일 부분
  .fc-theme-standard th {
    height: 32px;
    padding-top: 3.5px;
    background: #e5edff;
    border: 1px solid #dddee0;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #7b7b7b;
  }

  // 오늘 날짜 배경색
  .fc .fc-daygrid-day.fc-day-today {
    background-color: #fff8bd;
    color: #356eff;
  }

  // 날짜별 그리드
  .fc .fc-daygrid-day-frame {

    padding: 10px;
  }
    .fc .fc-day-sun a {
    color: red;
}
  
/* 토요일 날짜: 파란색 */
.fc .fc-day-sat a {
    color: blue;
}
.fc .fc-daygrid-day.fc-day-today {
    background-color: #e689572;
}
  // 날짜  ex) 2일
  .fc .fc-daygrid-day-top {
    flex-direction: row;
    margin-bottom: 3px;
  }

  // 각 이벤트 요소
  .fc-event {
    cursor: pointer;
    padding: 2px 4px;
    margin-bottom: 3px;
    border-radius: 4px;
    font-weight: 400;
    font-size: 12px;
  }
`;

function CompanyUserCalender() {
  const [modalOpen, setModalOpen] = useState(false);

    const handleSave = (scheduleData) => {
        console.log('일정 데이터:', scheduleData);
        // 서버로 전송 로직 추가 가능
    };
  const userData = useSelector((state) => state.user.data);
  const [schedules, setSchedules] = useState([]);
  useEffect(() => {
    const getSchedule = async () => {

        try {
            const token = localStorage.getItem('jwt');
            if (!token) {

                console.error("토큰이 없습니다.");
                return;
            }
            const response = await axios.post(`http://localhost:8080/api/getscheduls?emp_comp_no=${userData.emp_comp_no}&emp_dept_no=${userData.emp_dept_no}&emp_no=${userData.emp_no}`, {
                headers: {
                    'Authorization': token
                }
            });
            console.log("data : " + response.data);
            setSchedules(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('호출이 실패 했습니다 :', error);
        }
    };
    console.log()
    getSchedule();
}, []);
  return (
    <div>
    <div className='fullcalendarContainer'>
    <FullCalendarContainer>
    <FullCalendar
      defaultView="dayGridMonth"
      plugins={[dayGridPlugin]}
      headerToolbar={{
        start: 'today,ScheduleInsertBtn', // custom 버튼을 여기에 추가
        center: 'title',
        end: 'prev,next'
    }}
    customButtons={{
        ScheduleInsertBtn: {
            text: '일정추가',
            click: () => setModalOpen(true) // 버튼 클릭 시 실행할 함수 추가
        }
        
      }}

      events={schedules}
    />
    </FullCalendarContainer>
  </div>
  <div>
     <ScheduleModal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                onSave={handleSave} />
  </div>
  </div>
  );
}

export default CompanyUserCalender;