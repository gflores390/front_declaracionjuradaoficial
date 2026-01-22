"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  label = " ",
  placeholder = "DD/MM/YYYY",
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value + 'T12:00:00') : new Date())
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString())
  const containerRef = useRef<HTMLDivElement>(null)

  // Convertir date string (YYYY-MM-DD) a DD/MM/YYYY
  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  // Convertir DD/MM/YYYY a YYYY-MM-DD (SIN conversión de zona horaria)
  const formatDateToInput = (day: number, month: number, year: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDayClick = (day: number) => {
    const newDate = formatDateToInput(day, currentMonth.getMonth(), currentMonth.getFullYear())
    onChange(newDate)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), Number.parseInt(e.target.value)))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number.parseInt(e.currentTarget.value)
    const currentYear = new Date().getFullYear()

    if (year >= 1900 && year <= currentYear) {
      setCurrentMonth(new Date(year, currentMonth.getMonth()))
      setYearInput(year.toString())
    }
  }

  const handleYearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value
    setYearInput(inputValue)

    // Permitir que se escriba mientras digita
    if (inputValue.length === 4) {
      const year = Number.parseInt(inputValue)
      const currentYear = new Date().getFullYear()

      // Solo aceptar años válidos hasta el año actual
      if (year >= 1900 && year <= currentYear) {
        setCurrentMonth(new Date(year, currentMonth.getMonth()))
      }
    }
  }

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const currentYear = currentMonth.getFullYear()
  const maxYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: maxYear - 1899 }, (_, i) => 1900 + i).filter((y) => y <= maxYear)

  // ✅ FUNCIÓN HELPER PARA COMPARAR FECHAS SIN ZONA HORARIA
  const isSameDate = (dateString: string | undefined, day: number, month: number, year: number) => {
    if (!dateString) return false
    const [valueYear, valueMonth, valueDay] = dateString.split("-").map(Number)
    return valueDay === day && valueMonth === month + 1 && valueYear === year
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`} ref={containerRef}>
      {label && <label className="font-medium text-sm text-[#215F99]">{label}</label>}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full h-12 px-4
            flex items-center justify-between
            rounded-lg text-sm font-normal
            transition-all duration-200 ease-in-out

            border
            ${value
                ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]"
                : "bg-white border-[#215F99]/30"
            }

            hover:border-[#215F99]
            hover:shadow-sm

            focus:outline-none
            focus:border-[#215F99]
            focus:ring-2 focus:ring-[#215F99]/25
            `}

        >
          <span className={value ? "text-[#215F99]" : "text-gray-400"}>
            {value ? formatDateDisplay(value) : placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 text-[#215F99] transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-[#215F99]/20 rounded-md shadow-lg z-50 p-4 w-80">
            <div className="flex gap-2 mb-4 items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[#EDF2F7] rounded transition-colors"
              >
                <svg className="w-4 h-4 text-[#215F99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2 flex-1">
                <select
                  value={currentMonth.getMonth()}
                  onChange={handleMonthChange}
                  className="flex-1 px-2 py-1 border border-[#215F99]/20 rounded text-sm text-[#215F99] font-medium hover:border-[#215F99] focus:border-[#215F99] focus:ring-2 focus:ring-[#215F99]/20"
                >
                  {months.map((month, idx) => (
                    <option key={month} value={idx}>
                      {month}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={yearInput}
                  onChange={handleYearInput}
                  min="1900"
                  max={maxYear}
                  placeholder="YYYY"
                  className="w-24 px-2 py-1 border border-[#215F99]/20 rounded text-sm text-[#215F99] font-medium hover:border-[#215F99] focus:border-[#215F99] focus:ring-2 focus:ring-[#215F99]/20 transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-[#EDF2F7] rounded transition-colors"
              >
                <svg className="w-4 h-4 text-[#215F99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Grid de días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-[#215F99]/60 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {days.map((day) => {
                // ✅ USAR LA NUEVA FUNCIÓN SIN CONVERSIÓN DE ZONA HORARIA
                const isSelected = isSameDate(value, day, currentMonth.getMonth(), currentMonth.getFullYear())

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex items-center justify-center rounded text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-[#215F99] text-white shadow-md"
                        : "hover:bg-[#EDF2F7] text-[#215F99] hover:shadow"
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}export default DatePicker