import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPanel from 'components/UserPanel/Loadable';
import CalendarApp from 'components/CalendarApp/Loadable';
import CalendarModal from 'components/CalendarModal/Loadable';
import { notification, Spin, Layout } from 'antd';
import moment from 'moment';
import * as FirestoreService from '../../services/firestore';
import messages from './messages';

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      dateFormat: 'DD.MM.YYYY',
      unsubscribe: null,
      toggleSubscribe: false,
    };
    FirestoreService.setUserId(props.userId);
  }

  createEvent = async fields => {
    fields.participants.push(this.props.userId);
    const docRef = await FirestoreService.addCalendarEvent({
      createdBy: this.props.userId,
      startAt: moment(fields.start_at, this.state.dateFormat).format(
        'YYYY.MM.DD',
      ),
      participants: fields.participants,
    }).catch(error => {
      notification.error({
        message: 'Cant create new event',
        description: error.message,
      });
    });

    notification.success({
      message: 'Calendar',
      description: 'Event successfuly created',
    });

    return docRef;
  };

  eventChangeIterator = change => {
    if (change.type === 'added') {
      notification.info({
        message: 'Added new event',
        description: `Event start at: ${change.doc.data().start_at}`,
      });
    }
    if (change.type === 'modified') {
      notification.info({
        message: 'Modified existing event',
        description: `Event start at: ${change.doc.data().start_at}`,
      });
    }
    if (change.type === 'removed') {
      notification.info({
        message: 'Removed event',
        description: `Event start at: ${change.doc.data().start_at}`,
      });
    }
  };

  mapEventIterator = doc => ({
    id: doc.id,
    guests: doc.data().participants.length,
    date: moment(doc.data().start_at),
  });

  eventsObserver = querySnapshot => {
    if (!this.state.toggleSubscribe) {
        this.setState({ toggleSubscribe: true });
        return;
    }
    const events = querySnapshot.docs.map(this.mapEventIterator);
    this.setState({ events });
    querySnapshot
      .docChanges()
      .filter(change => change.doc.data().created_by !== this.props.userId)
      .forEach(this.eventChangeIterator);
  };

  componentDidMount = async () => {
    const events = await FirestoreService.getCalendarEvents({
      iterator: this.mapEventIterator,
    });
    this.setState({ events });

    const unsubscribe = await FirestoreService.streamCalendarEvents({
      next: this.eventsObserver,
      error: error =>
        notification.error({
          message: 'Error of streaming',
          description: error.message,
        }),
    });
    this.setState({ unsubscribe });
  };

  componentWillUnmount = () => {
    this.state.unsubscribe();
  };

  render() {
    const { isLoggingOut } = this.props;
    const { events, dateFormat } = this.state;
    const { Header, Content, Footer } = Layout;
    return (
      <Spin
        style={{ position: 'fixed', maxHeight: '100vh' }}
        tip={messages.spin_logout_tip}
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
          <CalendarModal
            createEvent={this.createEvent}
            dateFormat={dateFormat}
          />
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
