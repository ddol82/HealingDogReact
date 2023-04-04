import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { callSelectBeautyReservationListAPI } from "apis/BeautyAPICalls";
import ReservationList from "./ReservationList";

function Reservation() {
  //redux
  const dispatch = useDispatch();
  const beautyReservationList = useSelector(
    (state) => state.beautyReservationReducer.data
  );

  // useState
  const [form, setForm] = useState({
    beautyReservationListCode: "",
    beautyCode: "",
    userCode: "",
    date: "",
    time: "",
    reservation: "",
  });

  //useEffect
  useEffect(() => {
    dispatch(callSelectBeautyReservationListAPI());
  }, []);

  useEffect(() => {
    if (!beautyReservationList != true) {
      setForm({
        beautyReservationListCode:
          beautyReservationList.beautyReservationListCode,
        beautyCode: beautyReservationList.beautyCode,
        userCode: beautyReservationList.userCode,
        date: beautyReservationList.date,
        time: beautyReservationList.time,
        reservation: beautyReservationList.reservation,
      });
    }
  }, [beautyReservationList]);

  // event-handler
  const timeFormatter = (timestamp) => {
    let date = new Date(timestamp);

    let year = date.getFullYear().toString().slice(-2); //년도 뒤에 두자리
    let month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리
    let day = ("0" + date.getDate()).slice(-2); //일 2자리
    let hour = ("0" + date.getHours()).slice(-2); //시 2자리
    let minute = ("0" + date.getMinutes()).slice(-2); //분 2자리
    let second = ("0" + date.getSeconds()).slice(-2); //초 2자리

    let result = month + "/" + day + " " + " " + hour + ":" + minute;

    return result;
  };

  return (
    <>
      <div className="reservation-btns">
        <button className="reservation-btn">예약내역</button>
        <button className="reservation-btn">신청내역</button>
      </div>

      {Array.isArray(beautyReservationList) &&
        beautyReservationList.map((form) => (
          <ReservationList
            key={form.userCode}
            userCode={form.userCode}
            date={form.date}
            time={timeFormatter(form.time)}
          />
        ))}
    </>
  );
}

export default Reservation;
