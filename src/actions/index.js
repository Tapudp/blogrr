import axios from 'axios';

export const FETCH_POSTS = 'fetch_posts';

export function fetchPosts(){
   const ROOT_URL = `http://reduxblog.herokuapp.com/api/`;
   const API_KEY = '?key=ilovebutterscotch';

   const request = axios.get(`${ROOT_URL}/posts${API_KEY}`); // making request to Redux Blog api

   return {
      type: FETCH_POSTS,
      payload: request
   }
}