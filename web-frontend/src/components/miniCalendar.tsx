import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {format} from "date-fns/format";
import {parse} from "date-fns/parse";
import {startOfWeek} from "date-fns/startOfWeek";
import {getDay} from "date-fns/getDay";
import {enUS} from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState([
    { title: "New Admissions", start: new Date(2025, 10, 4), end: new Date(2025, 10, 7) },
    { title: "Children's Day", start: new Date(2025, 10, 14), end: new Date(2025, 10, 14) },
  ]);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-2">
        📅 Canteen Calendar
      </h2>

      <div style={{ height: 300 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={handleNavigate}
          views={["month"]}
          popup
          style={{ height: 300 }}
          eventPropGetter={(event: any) => ({
            style: {
              backgroundColor: event.title.includes("Order") ? "#3b82f6" : "#16a34a",
              borderRadius: "6px",
              color: "white",
              border: "none",
              fontSize: "12px",
            },
          })}
        />
      </div>
    </div>
  );
}
