"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { CollectionEvent, parseTimeRange } from "@/lib/types";



type CalendarProps = {
  initialEvents: CollectionEvent[];
};

export const Calendar = ({ initialEvents }: CalendarProps) => {
  const calendarRef = React.useRef<FullCalendar>(null);

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.next();
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.today();
  };

  const calendarEvents = initialEvents.map((event) => {
    const { start, end } = parseTimeRange(event.date, event.time);
    return {
      id: event.id.toString(),
      title: event.title,
      start,
      end,
      extendedProps: {
        location: event.location,
        houses: event.houses,
        status: event.status,
      },
    };
  });

  return (
    <DashboardCard className="lg:col-span-3">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        eventContent={(eventInfo) => (
          <div className="flex items-center gap-1 p-1 w-full overflow-hidden">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                eventInfo.event.extendedProps.status === "Completed"
                  ? "bg-green-500"
                  : eventInfo.event.extendedProps.status === "In Progress"
                  ? "bg-blue-500"
                  : eventInfo.event.extendedProps.status === "Scheduled"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium text-foreground truncate"
                title={eventInfo.event.title}
              >
                {eventInfo.event.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {eventInfo.event.start?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {eventInfo.event.end?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}
        dayMaxEventRows={3}
        moreLinkContent={({ num }) => `+${num} more`}
        moreLinkClassNames="text-xs text-primary hover:underline"
        eventBackgroundColor="transparent"
        eventBorderColor="transparent"
        eventTextColor="inherit"
        dayCellClassNames="border border-border"
        height="600px"
        customButtons={{
          prev: { text: "◄", click: handlePrev },
          next: { text: "►", click: handleNext },
          today: { text: "Today", click: handleToday },
        }}
        dayCellContent={(dayInfo) => (
          <div className="flex justify-start p-1">
            <span className={dayInfo.isToday ? "font-bold text-primary" : ""}>
              {dayInfo.dayNumberText}
            </span>
          </div>
        )}
      />
    </DashboardCard>
  );
};