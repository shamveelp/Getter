"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { bookingApiService } from '@/services/user/bookingApiService';
import { cn } from '@/lib/utils';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addDays,
    isBefore,
    startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface AvailabilityCalendarProps {
    serviceId: string;
    totalUnits: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    onSelect: (start: Date | undefined, end: Date | undefined) => void;
    availabilityConfig?: {
        type: 'specific_dates' | 'recurring';
        recurring?: {
            days: string[];
            is24Hours: boolean;
            startTime?: string;
            endTime?: string;
        };
        specificDates?: { startDate: Date; endDate: Date }[];
    };
}

export function AvailabilityCalendar({ serviceId, totalUnits, startDate, endDate, onSelect, availabilityConfig }: AvailabilityCalendarProps) {
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

    const isDayOff = (date: Date) => {
        if (!availabilityConfig) return false;
        const d = startOfDay(date);

        if (availabilityConfig.type === 'recurring' && availabilityConfig.recurring) {
            const dayName = format(d, 'eeee').toLowerCase();
            return !availabilityConfig.recurring.days.includes(dayName);
        }

        if (availabilityConfig.type === 'specific_dates' && availabilityConfig.specificDates) {
            return !availabilityConfig.specificDates.some(range => {
                const start = startOfDay(new Date(range.startDate));
                const end = startOfDay(new Date(range.endDate));
                return d >= start && d <= end;
            });
        }
        return false;
    };

    const isFullDay = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const slotInfo = availability.find(a => a.date === dateStr);
        return slotInfo ? slotInfo.occupied >= slotInfo.total : false;
    };

    const handleDayClick = (date: Date, isFull: boolean, isPastDay: boolean, offDay: boolean) => {
        if (isFull || isPastDay || offDay) return;

        const clickedDate = startOfDay(date);
        const s = startDate ? startOfDay(startDate) : null;
        const e = endDate ? startOfDay(endDate) : null;

        if (!s || (s && e)) {
            // Start new selection
            onSelect(clickedDate, undefined);
        } else {
            // Already have a start date
            if (isBefore(clickedDate, s)) {
                // Clicked earlier date, becomes new start
                onSelect(clickedDate, undefined);
            } else {
                // Clicked same or later date, check range validity
                let current = addDays(s, 1);
                let hasInvalidDay = false;
                while (isBefore(current, clickedDate) || isSameDay(current, clickedDate)) {
                    if (isDayOff(current) || isFullDay(current)) {
                        hasInvalidDay = true;
                        break;
                    }
                    current = addDays(current, 1);
                }

                if (hasInvalidDay) {
                    onSelect(clickedDate, undefined);
                } else {
                    onSelect(s, clickedDate);
                }
            }
        }
    };

    const getSlotInfo = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return availability.find(a => a.date === dateStr);
    };

    const isDateSelected = (date: Date) => {
        if (!startDate) return false;
        if (isSameDay(date, startDate)) return true;
        if (endDate && isSameDay(date, endDate)) return true;
        return false;
    };

    const isDateInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return date > startDate && date < endDate;
    };

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = startOfDay(new Date());

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-[10px] font-black text-neutral-400 tracking-[0.3em] uppercase">AVAILABILITY ENGINE</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 transition-all text-white group active:scale-90"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 transition-all text-white group active:scale-90"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-3 mb-6">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3">
                {days.map((date, idx) => {
                    const isMonthDay = isSameMonth(date, currentMonth);
                    const isPastDay = isBefore(startOfDay(date), today);
                    const slotInfo = getSlotInfo(date);
                    const isFull = slotInfo ? slotInfo.occupied >= slotInfo.total : false;
                    const available = slotInfo ? slotInfo.total - slotInfo.occupied : totalUnits;
                    const offDay = isDayOff(date);
                    const selected = isDateSelected(date);
                    const inRange = isDateInRange(date);

                    if (!isMonthDay) {
                        return <div key={idx} className="aspect-square opacity-0" />;
                    }

                    const disabled = isPastDay || offDay || isFull;

                    return (
                        <div
                            key={idx}
                            onClick={() => handleDayClick(date, isFull, isPastDay, offDay)}
                            className={cn(
                                "group relative aspect-square rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-300 border-2 overflow-hidden",
                                isPastDay
                                    ? "bg-neutral-900/30 border-transparent cursor-not-allowed opacity-40 grayscale"
                                    : isFull || offDay
                                        ? "bg-red-500/10 border-red-500/20 cursor-not-allowed"
                                        : "cursor-pointer",
                                selected
                                    ? "bg-brand-500 border-brand-500 text-white shadow-[0_10px_30px_rgba(var(--brand-500-rgb),0.5)] z-20 scale-105"
                                    : inRange
                                        ? "bg-brand-500/20 border-brand-500/40 text-brand-100 z-10"
                                        : !disabled && "bg-neutral-900 border-white/5 hover:border-brand-500/50 hover:bg-brand-500/5 text-white"
                            )}
                        >
                            {/* Day Number */}
                            <span className={cn(
                                "text-xl font-black tracking-tighter z-10",
                                selected ? "text-white" : isFull || offDay ? "text-red-500/50" : isPastDay ? "text-neutral-700" : "text-white"
                            )}>
                                {date.getDate()}
                            </span>

                            {/* Available Slots Indicator */}
                            {!disabled && (
                                <div className="absolute bottom-3 inset-x-0 flex flex-col items-center z-10 opacity-100 transition-opacity">
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter whitespace-nowrap",
                                        selected
                                            ? "bg-white/20 text-white"
                                            : "bg-brand-500/20 text-brand-400 group-hover:bg-brand-500 group-hover:text-white"
                                    )}>
                                        {available} LEFT
                                    </div>
                                </div>
                            )}

                            {/* Status Labels for disabled days */}
                            {offDay && !isPastDay && (
                                <div className="absolute bottom-3 px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[7px] font-black uppercase tracking-widest z-10">CLOSED</div>
                            )}
                            {isFull && !isPastDay && (
                                <div className="absolute bottom-3 px-2 py-0.5 rounded-full bg-red-600/20 text-red-500 text-[7px] font-black uppercase tracking-widest z-10">BOOKED</div>
                            )}

                            {/* Background Effects */}
                            {inRange && (
                                <div className="absolute inset-0 bg-brand-500/5 -z-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer / Legend */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-xl bg-brand-500 border-2 border-white/10 shadow-lg" />
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">SELECTED</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-xl bg-brand-500/20 border-2 border-brand-500/40" />
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">AVAILABLE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-xl bg-red-500/20 border-2 border-red-500/40 shadow-lg shadow-red-500/10" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">BOOKED / UNAVAILABLE</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => onSelect(undefined, undefined)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all text-xs font-black uppercase tracking-[0.2em] active:scale-95 group shadow-xl"
                    >
                        <RotateCcw size={16} className="group-hover:-rotate-45 transition-transform" />
                        RESET
                    </button>
                </div>
            </div>
        </div>
    );
}
