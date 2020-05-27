import { firestore as db } from '../firebase';

export const addCalendarEvent = async ({
  createdBy,
  startAt,
  participants,
}) => {
  const eventsRef = db.collection('events');
  const docRef = await eventsRef.add({
    created_by: createdBy,
    start_at: startAt,
    participants,
  });
  return docRef;
};

let userId = false;

export const setUserId = id => {
  userId = id;
};

const getEventsRef = () => {
  const eventsRef = db
    .collection('events')
    .where('participants', 'array-contains-any', [userId]);
  return eventsRef;
};

export const streamCalendarEvents = async observer => {
  const streamRef = await getEventsRef().onSnapshot(observer);
  return streamRef;
};

export const getCalendarEvents = async ({ iterator }) => {
  const eventsActual = await getEventsRef().get();
  return eventsActual.docs.map(iterator);
};
