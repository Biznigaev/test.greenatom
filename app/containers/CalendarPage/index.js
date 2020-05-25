import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPanel from 'components/UserPanel/Loadable';
import CalendarModal from 'components/CalendarModal/Loadable';
import { Spin, Layout, Calendar, Badge } from 'antd';
import firestore from '../../firebase';
import messages from './messages';
import './calendar.css';

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount() {
    firestore
      .collections('events')
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
        // this.setState({ events: data });
      });
  }

  render() {
    const { isLoggingOut } = this.props;
    const { Header, Content, Footer } = Layout;

    return (
      <Spin
        style={{ position: 'fixed', maxHeight: '100vh' }}
        tip="Logging out ..."
        spinning={isLoggingOut}
        size="large"
      >
        <Header
          style={{
            textAlign: 'right',
            background: '#f0f2f5',
            color: 'rgba(0, 0, 0, 0.65)',
          }}
        >
          <UserPanel />
        </Header>
        <Content>
          <Calendar
            onPanelChange={onPanelChange}
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <CalendarModal />
        </Footer>
      </Spin>
    );
  }
}

function onPanelChange(value, mode) {
  console.log(value.format('YYYY-MM-DD'), mode);
}

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        {
          type: 'success',
          content: 'This is very long usual event。。....',
        },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map(item => (
        <li key={item.content}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
  };
}

export default connect(mapStateToProps)(CalendarPage);
