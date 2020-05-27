import { defineMessages } from 'react-intl';

export const scope = 'app.components.ModalForm';

export default defineMessages({
  header: {
    title: 'Добавление события',
  },
  field: {
    start_at: {
      label: 'Date of event',
      validator: {
        required: 'Please input the title of collection!',
      },
    },
    participants: {
      validator: {
        required: 'Please choose participants',
        dateFormat: 'Invalid format of the date',
      },
    },
  },
  button: {
    modal: 'Добавить событие',
    ok: 'Сохранить',
    cancel: 'Отменить',
  },
});
