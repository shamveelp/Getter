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
    const [hours, minutes] = (value && value.includes(':')) ? value.split(':') : ["00", "00"];

    const handleHourChange = (newHour: string) => {
        onChange(`${newHour}:${minutes}`);
    };

    const handleMinuteChange = (newMinute: string) => {
        onChange(`${hours}:${newMinute}`);
    };

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <Select value={hours} onValueChange={handleHourChange}>
                <SelectTrigger className="w-[70px] focus:ring-brand-500">
                    <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="h-64">
                    {Array.from({ length: 24 }).map((_, i) => {
                        const h = i.toString().padStart(2, '0');
                        return <SelectItem key={h} value={h}>{h}</SelectItem>
                    })}
                </SelectContent>
            </Select>
            <span className="text-gray-500 font-medium">:</span>
            <Select value={minutes} onValueChange={handleMinuteChange}>
                <SelectTrigger className="w-[70px] focus:ring-brand-500">
                    <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="h-64">
                    {Array.from({ length: 60 }).map((_, i) => {
                        const m = i.toString().padStart(2, '0');
                        return <SelectItem key={m} value={m}>{m}</SelectItem>
                    })}
                </SelectContent>
            </Select>
            <Clock className="w-4 h-4 text-muted-foreground ml-2" />
        </div>
    )
}
