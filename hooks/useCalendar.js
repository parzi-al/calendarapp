
"use client";


// 📁 src/hooks/useCalendar.js

import { useState } from "react";
import dayjs from "dayjs";

export default function useCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextYear = () => {
    setCurrentDate(currentDate.add(1, "year"));
  };
  
  const goToPrevYear = () => {
    setCurrentDate(currentDate.subtract(1, "year"));
  };
  
  return {
    currentDate,
    goToNextMonth,
    goToPrevMonth,
    goToNextYear,
    goToPrevYear,
    day: currentDate.date(),
    month: currentDate.month(),
    year: currentDate.year(),
  };
}
