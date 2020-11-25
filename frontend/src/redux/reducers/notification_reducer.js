import Actions from '../actions/actions';

const initialState = {
  notifications: [],
};

const NotificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Actions.setNotifications:
      return { ...state, notifications: payload };
    default:
      return state;
  }
};

export default NotificationReducer;
