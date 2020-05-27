import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPanel from 'components/UserPanel/Loadable';
import CalendarApp from 'components/CalendarApp/Loadable';
import CalendarModal from 'components/CalendarModal/Loadable';
import { notification, Spin, Layout } from 'antd';
import moment from 'moment';
import { firestore as db } from '../../firebase';
import messages from './messages';

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      dateFormat: 'DD.MM.YYYY',
      unsubscribe: null,
    };
  }

  createEvent = async fields => {
    fields.participants.push(this.props.userId);
    const eventsRef = db.collection('events');
    const docRef = await eventsRef
      .add({
        created_by: this.props.userId,
        start_at: moment(fields.start_at, this.state.dateFormat).format(
          'YYYY.MM.DD',
        ),
        participants: fields.participants,
      })
      .catch(error => {
        notification.error({
          message: 'Cant create new event',
          description: error.message,
        });
      });
    console.log(docRef);
    notification.success({
      message: 'Calendar',
      description: 'Event successfuly created',
    });

    return docRef;
  };

  getEventsRef = () => {
    const eventsRef = db
      .collection('events')
      .where('participants', 'array-contains-any', [this.props.userId]);
    return eventsRef;
  };

  fetchEvents = async () => {
    const eventsActual = await this.getEventsRef().get();
    const events = [];
    for (const doc of eventsActual.docs) {
      events.push({
        id: doc.id,
        guests: doc.data().participants.length,
        date: moment(doc.data().start_at),
      });
    }
    return events;
  };

  observeEvents = async observer => {
    const streamRef = await this.getEventsRef().onSnapshot(observer);
    return streamRef;
  };

  componentDidMount = async () => {
    const events = await this.fetchEvents();
    this.setState({ events });
    const unsubscribe = await this.observeEvents({
      next: querySnapshot => {
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          guests: doc.data().participants.length,
          date: moment(doc.data().start_at),
        }));
        this.setState({ events });
        querySnapshot
          .docChanges()
          .filter(change => change.doc.data().created_by !== this.props.userId)
          .forEach(change => {
            if (change.type === 'added') {
              notification.info({
                message: 'Added new event',
                description: `Event start at: ${change.doc.data().start_at}`,
              });
              console.log('New event: ', change.doc.data());
            }
            if (change.type === 'modified') {
              notification.info({
                message: 'Modified existing event',
                description: `Event start at: ${change.doc.data().start_at}`,
              });
              console.log('Modified event: ', change.doc.data());
            }
            if (change.type === 'removed') {
              notification.info({
                message: 'Removed event',
                description: `Event start at: ${change.doc.data().start_at}`,
              });
              console.log('Removed event: ', change.doc.data());
            }
          });
      },
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
