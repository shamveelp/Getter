"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TimePickerProps {
    value: string; // "HH:MM" 24h format
    onChange: (value: string) => void;
    className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [hours, minutes] = (value && value.includes(':')) ? value.split(':') : ["12", "00"];

    const handleHourChange = (newHour: string) => {
        onChange(`${newHour}:${minutes}`);
    };

    const handleMinuteChange = (newMinute: string) => {
        onChange(`${hours}:${newMinute}`);
    };

    return (
        <div className={cn("flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm transition-colors focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500", className)}>
            <div className="flex items-center gap-1">
                <Select value={hours} onValueChange={handleHourChange}>
                    <SelectTrigger className="w-[70px] border-none focus:ring-0 h-9 text-sm font-medium bg-transparent text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 min-w-[70px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {Array.from({ length: 24 }).map((_, i) => {
                            const h = i.toString().padStart(2, '0');
                            return <SelectItem key={h} value={h} className="text-sm">{h}</SelectItem>
                        })}
                    </SelectContent>
                </Select>
                <span className="text-gray-400 font-bold">:</span>
                <Select value={minutes} onValueChange={handleMinuteChange}>
                    <SelectTrigger className="w-[70px] border-none focus:ring-0 h-9 text-sm font-medium bg-transparent text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 min-w-[70px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {Array.from({ length: 60 }).map((_, i) => {
                            const m = i.toString().padStart(2, '0');
                            return <SelectItem key={m} value={m} className="text-sm">{m}</SelectItem>
                        })}
                    </SelectContent>
                </Select>
            </div>
            <Clock className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
    )
}
