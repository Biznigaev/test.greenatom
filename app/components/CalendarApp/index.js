import React from 'react';
import { Spin, Calendar, Badge } from 'antd';
import Moment from 'moment';
import './index.css';

const CalendarApp = props => {
  const { events } = props;
  const getListData = value => {
    const listData = events
      .filter(event => event.date.startOf('day').isSame(value.startOf('day')))
      .map(event => ({
        key: event.id,
        content: `Событие (гостей: ${event.guests})`,
        type: event.date.isBefore(Moment().startOf('day'))
          ? 'success'
          : event.date.isSame(Moment().startOf('day'))
          ? 'error'
          : 'warning',
      }));
    return listData || [];
  };
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.key}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return <Calendar dateCellRender={dateCellRender} />;
};

export default CalendarApp;
