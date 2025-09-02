"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface OtpInputProps {
    length?: number
    onChange?: (value: string) => void
}

export function OtpInput({ length = 6, onChange }: OtpInputProps) {
    const [values, setValues] = React.useState(Array(length).fill(""))
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

    const handleChange = (value: string, idx: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newValues = [...values]
            newValues[idx] = value
            setValues(newValues)
            onChange?.(newValues.join(""))

            if (value && idx < length - 1) {
                inputsRef.current[idx + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace" && !values[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus()
        }
    }

    return (
        <div className="flex gap-2 justify-center">
            {values.map((val, idx) => (
                <Input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => { inputsRef.current[idx] = el }}
                    className="w-12 h-12 text-center text-xl rounded-xl border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary"
                />
            ))}
        </div>
    )
}
