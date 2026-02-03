"use client";

import React, { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { bookingApiService } from '@/services/user/bookingApiService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AvailabilityCalendarProps {
    serviceId: string;
    totalUnits: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    onSelect: (start: Date | undefined, end: Date | undefined) => void;
}

export function AvailabilityCalendar({ serviceId, totalUnits, startDate, endDate, onSelect }: AvailabilityCalendarProps) {
    const [availability, setAvailability] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const fetchAvailability = async (date: Date) => {
        try {
            const response = await bookingApiService.getServiceAvailability(
                serviceId,
                date.getMonth() + 1,
                date.getFullYear()
            );
            if (response.success) {
                setAvailability(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch availability", error);
        }
    };

    useEffect(() => {
        fetchAvailability(currentMonth);
    }, [serviceId, currentMonth]);

    const handleDayClick = (date: Date, isFull: boolean, isPast: boolean) => {
        if (isFull || isPast) return;

        if (!startDate || (startDate && endDate)) {
            onSelect(date, undefined);
        } else {
            if (date < startDate) {
                onSelect(date, undefined);
            } else {
                onSelect(startDate, date);
            }
        }
    };

    const getSlotInfo = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return availability.find(a => a.date === dateStr);
    };

    const isSelected = (date: Date) => {
        if (!startDate) return false;
        return format(date, 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd') ||
            (endDate && format(date, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd'));
    };

    const isInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return date > startDate && date < endDate;
    };

    return (
        <div className="bg-neutral-900/50 rounded-2xl border border-white/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white">Select Dates</h3>
                    <p className="text-sm text-neutral-400">Click to select start and end dates</p>
                </div>
                <div className="flex gap-4 text-[10px] uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-brand-500/20 border border-brand-500/50" />
                        <span className="text-neutral-400">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/50" />
                        <span className="text-neutral-400">Full</span>
                    </div>
                </div>
            </div>

            <Calendar
                mode="single" // Using single mode but managing range manually for slot data display
                onMonthChange={setCurrentMonth}
                className="w-full p-0"
                classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    table: "w-full border-collapse",
                    head_row: "flex w-full justify-between mb-4 border-b border-white/5 pb-2",
                    head_cell: "text-neutral-500 w-full font-bold text-[0.7rem] uppercase tracking-[0.2em] text-center",
                    row: "flex w-full mt-1 justify-between gap-1",
                    cell: "relative p-0 flex-1 aspect-square min-h-[50px] md:min-h-[70px]",
                    day: "hidden"
                }}
                components={{
                    Day: ({ day }: any) => {
                        const date = day.date;
                        const isOutside = day.outside;
                        if (isOutside) return <td className="flex-1 aspect-square" />;

                        const slotInfo = getSlotInfo(date);
                        const isFull = slotInfo ? slotInfo.occupied >= slotInfo.total : false;
                        const available = slotInfo ? slotInfo.total - slotInfo.occupied : totalUnits;
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        const selected = isSelected(date);
                        const inRange = isInRange(date);

                        return (
                            <td
                                onClick={() => handleDayClick(date, isFull, isPast)}
                                className={cn(
                                    "relative flex-1 aspect-square p-0.5 group",
                                    (isFull || isPast) ? "cursor-not-allowed" : "cursor-pointer"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-full h-full rounded-lg border flex flex-col items-center justify-center transition-all relative overflow-hidden",
                                        isPast ? "opacity-10 bg-transparent border-transparent" :
                                            isFull ? "bg-red-500/5 border-red-500/10 text-red-900/50" :
                                                selected ? "bg-brand-500 border-brand-500 text-white shadow-[0_0_20px_rgba(var(--brand-500-rgb),0.3)] z-20 scale-105" :
                                                    inRange ? "bg-brand-500/20 border-brand-500/40 text-brand-200" :
                                                        "bg-white/5 border-white/5 hover:border-white/20 text-neutral-300"
                                    )}
                                >
                                    <span className={cn(
                                        "text-xs font-bold z-10",
                                        selected ? "text-white" : "text-neutral-200"
                                    )}>{date.getDate()}</span>

                                    {!isPast && (
                                        <div className="z-10 mt-1 flex flex-col items-center">
                                            <span className={cn(
                                                "text-[8px] font-bold leading-none uppercase tracking-tighter opacity-70",
                                                selected ? "text-white" : isFull ? "text-red-500" : "text-brand-400"
                                            )}>
                                                {isFull ? "Full" : `${available} slots`}
                                            </span>
                                            <div className={cn(
                                                "w-6 h-0.5 rounded-full mt-1 overflow-hidden bg-white/10",
                                                selected && "bg-white/30"
                                            )}>
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        selected ? "bg-white" : isFull ? "bg-red-500" : "bg-brand-500"
                                                    )}
                                                    style={{ width: `${(available / totalUnits) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Selection Highlight background for Range */}
                                    {inRange && (
                                        <div className="absolute inset-x-0 inset-y-0 bg-brand-500/10 -z-0" />
                                    )}
                                </div>
                            </td>
                        );
                    }
                }}
            />
        </div>
    );
}
