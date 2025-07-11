import { ScheduleFullDetails } from "@/types";
import { addDays, startOfWeek, setHours, setMinutes } from "date-fns";

export const  transformSchedulesToEvents = (schedules: ScheduleFullDetails[])  => {
  const daysMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return schedules.map(sched => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday

    const dayOffset = daysMap[sched.dayOfWeek];
    const dayDate = addDays(weekStart, dayOffset);

    const [startHour, startMinute] = sched.startTime.split(":").map(Number);
    const [endHour, endMinute] = sched.endTime.split(":").map(Number);

    const start = setMinutes(setHours(dayDate, startHour), startMinute);
    const end = setMinutes(setHours(dayDate, endHour), endMinute);

    return {
      id: sched.id,
      title: `${sched.course.code ?? "No code"} - ${sched.course.title ?? "No title"}\n${sched.venue.name ?? "No venue"} - ${sched.lecturer.fullName ?? "No lecturer"}`,
      start,
      end,
      resource: sched, // keep full object in case you need more
    };
  });
}

export const uniqueStringArray = (arr: string[]) => {
  return Array.from(new Set(arr));
}