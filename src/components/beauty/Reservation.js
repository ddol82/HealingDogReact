import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { callSelectBeautyReservationListAPI } from "apis/BeautyAPICalls";
import ReservationList from "./ReservationList";

function Reservation() {
  //redux
  const dispatch = useDispatch();
  const beautyReservation = useSelector(
    (state) => state.beautyReservationReducer
  );
  const beautyReservationList = beautyReservation.data;

  useState;
  const [form, setForm] = useState({
    beautyReservationListCode: "",
    mypetCode: "",
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
        mypetCode: beautyReservationList.mypetCode,
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

  const [isOn, setIsOn] = useState(true);

  // onclickHandler
  const onclickHandler = (value) => {
    setIsOn(value);
  };

  return (
    <>
      <div className="reservation-btns">
        <button
          onClick={() => onclickHandler(true)}
          className={isOn ? "reservation-btn-active" : "reservation-btn"}
        >
          예약내역
        </button>
        <button
          onClick={() => onclickHandler(false)}
          className={!isOn ? "reservation-btn-active" : "reservation-btn"}
        >
          신청내역
        </button>
      </div>
      {Array.isArray(beautyReservationList) &&
        beautyReservationList
          .filter((item) => item.reservation === (isOn ? "O" : "X"))
          .map((val) => (
            <ReservationList
              key={val.beautyReservationListCode}
              userCode={val.userCode}
              mypetCode={val.mypetCode}
              date={timeFormatter(val.date)}
              time={timeFormatter(val.time)}
            />
          ))}

      <h1>
        {Array.isArray(beautyReservationList) &&
          beautyReservationList.map((val) => val.mypetCode)}
      </h1>
    </>
  );
}

export default Reservation;
