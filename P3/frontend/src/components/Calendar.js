import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment)

const Calendar = (props) => {
    return (
        <div className="calendar-container">
            <BigCalendar
                className="calendar"
                localizer={localizer}
                //events={myEventsList}
                startAccessor="start"
                endAccessor="end"
            />
        </div>
    )
}

export default Calendar;