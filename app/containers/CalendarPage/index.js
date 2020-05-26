import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPanel from 'components/UserPanel/Loadable';
import CalendarApp from 'components/CalendarApp/Loadable';
import CalendarModal from 'components/CalendarModal/Loadable';
import { Spin, Layout } from 'antd';
import Moment from 'moment';
import { firestore as db } from '../../firebase';
import messages from './messages';

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  createEvent = async data =>
    await db.collection('events').add({
      created_by: this.props.userId,
      start_at: Moment(data.start_at).format('DD.MM.YYYY'),
      participants: data.participants.push(this.props.userId),
    });

  fetchEvents = async () => {
    const eventsRef = db.collection('events');
    const eventsActual = await eventsRef
      .where('participants', 'array-contains-any', [this.props.userId])
      .get();
    const events = [];
    for (const doc of eventsActual.docs) {
      events.push({
        id: doc.id,
        guests: doc.data().participants.length,
        date: Moment(doc.data().start_at),
      });
    }
    return events;
  };

  componentDidMount = async () => {
    const events = await this.fetchEvents();
    this.setState({ events });
  };

  render() {
    const { isLoggingOut } = this.props;
    const { events } = this.state;
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
          <CalendarApp events={events} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <CalendarModal />
        </Footer>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.auth.user.uid,
    isLoggingOut: state.auth.isLoggingOut,
  };
}

export default connect(mapStateToProps)(CalendarPage);
