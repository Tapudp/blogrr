import _ from 'lodash';
import { FETCH_POSTS, FETCH_POST, DELETE_POST } from '../actions';

export default function(state = {}, action){
   switch(action.type){
      case DELETE_POST:
            return _.omit(state, action.payload);
      case FETCH_POST:
            // const post = action.payload.data;
            // const newState = { ...state };
            // newState[post.id] = post;
            // return newState; this is all ES5
            return { ...state, [action.payload.data.id]: action.payload.data } // ES6 identical to what it was in ES5 just above 
      case FETCH_POSTS:
            return _.mapKeys(action.payload.data, 'id'); // [post1, post2]
      default:
            return state;
   }
}