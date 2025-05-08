"use client"

import { useState } from "react"
import dayjs from "dayjs"

export default function useCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs())

  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"))
  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"))

  const goToNextYear = () => setCurrentDate(currentDate.add(1, "year"))
  const goToPrevYear = () => setCurrentDate(currentDate.subtract(1, "year"))

  const goToNextWeek = () => setCurrentDate(currentDate.add(1, "week"))
  const goToPrevWeek = () => setCurrentDate(currentDate.subtract(1, "week"))

  return {
    currentDate,
    setCurrentDate,
    goToNextMonth,
    goToPrevMonth,
    goToNextYear,
    goToPrevYear,
    goToNextWeek,
    goToPrevWeek,
    day: currentDate.date(),
    month: currentDate.month(),
    year: currentDate.year(),
  }
}
