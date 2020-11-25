import Actions from '../actions/actions';

const initialState = {
  notifications: [],
  notificationSelected: {},
};

const NotificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Actions.setNotifications:
      return { ...state, notifications: payload };
    case Actions.selectNotification:
      return { ...state, notificationSelected: payload };
    default:
      return state;
  }
};

export default NotificationReducer;
