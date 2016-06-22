import { combineReducers } from 'redux';
import { Map } from 'immutable';
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from './actions';

function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_SUBREDDIT:
    return action.subreddit
  default:
    return state
  }
}

function posts(state = Map({
  isFetching: false,
  didInvalidate: false,
  items: []
}), action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return state.set("didInvalidate", true);
    case REQUEST_POSTS:
      return state.merge({
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_POSTS:
      return state.merge({
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsBySubreddit(state = Map(), action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return state.set(action.subreddit, posts(state[action.subreddit], action))
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer
