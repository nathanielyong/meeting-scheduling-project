import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

const Calendar = (props) => {
    return (
        <div>
            <BigCalendar
                localizer={localizer}
                //      events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    )
}

export default Calendar;