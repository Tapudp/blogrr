# Blog app with react-redux 
 This is a blog app created with Blog API that lets user POST, DELETE, EDIT the blog as needed.

### React Router
 - install `react-router@4.0.0` and then call it in the `index.js` file with
   ```
   import { BrowserRouter, Route } from 'react-router-dom';

   class Hello extends React.Component {
      render() {return <div>Hello!</div>}
   }

   class GoodBye extends React.component {
      render() {return <div>GoodBye!</div>}
   }

   ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
    <div>
      <Route path="/hello" component={Hello} />
      <Route path="/goodbye" component={GoodBye} />
    </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));

   ```
 - `BrowserRouter` object interacts with the History library and decides exactly what to do based on the change inside the URL
   the term `BrowserRouter` in particular tells react-router to look at the entire URL that what's on the screen 
 - `Route` is the real work horse, that object is a react component that we can render inside any other react component

### Route Design
 - routes would look like this for homepage, post-details page and post-creations page
  ```
  <Route path="/" component={PostsIndex} />
  <Route path="/posts/:id" component={PostsShow} />
  <Route path="/posts/new" component={PostsNew} />
  ```

### Route Definition
 - `./components/posts_index.js` will have our first landing page route
  ```
  class PostsIndex extends Component{
    render(){
      return( <div> Posts Index </div> );
    }
  }
  ```
 - now `index.js` remove all the previous practiced things and then import our `posts_index.js`
 - we don't need the single central `App` component since we already have react-router to roam around. removed
    ```
    import App from './component/app';
    ```
 - import the the PostsIndex in the index.js like this
  ```
  import PostsIndex from '.components/posts_index';

  <BrowserRouter>
    <div>
      <Route path="/" component={PostsIndex} />
    </div>
  </BrowserRouter>
  ```
 - it has a little **Bug** though, whenever first time using **ReactRouter**

### State as an object
 - there will be 2 states `posts`, `activePost` property for the redux
 - `activPost` will be the selected post which the user might be looking at one particular time
 - basically we will have our state as an object to fetch the data from with `state.posts[postID]`
 - because API would be giving out array of posts and we will just make it an object 

### Redux index Action
 - our first action creator will fetch a list posts and serve them to our PostsIndex component
 - `./action/index.js` will have following:
  ```
  export const FETCH_POSTS = 'fetch_posts';
  export function fetchPosts(){
    return {
      type: FETCH_POSTS
    }    
  }
  ``` 
 - action creator is supposed to fetch a list of post and return them to reducer, so it needs to reach out to that redux-Blog-API, so we need to install `Axios` to make the network request and `Redux-Promise` middleware to handle the asynchronous nature of the handle itself
 - so then wire up `redux-promise` as a middleware in our application, in `./index.js` import `redux-promise` and also apply it to the createStoreWithMiddleware` 
  ```
  import promise from 'redux-promise';

  const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
  ```
 - importing axios in the action/index.js as well
  ```
  import axios from 'axios';

  export function fetchPosts(){
    const request = axios.get();

    ....
  } 
  ```
 - we made the axios request we assigned it to `request` and then assign it to the payload property of the action we are returning 
  because the `request` is being assingned to the payload property the `redux-promise` middleware will automatically resolve this `request` for us whenever it sees this action coming across

  so by the time this action arrives in the reducer the payload property will contain the response object from the axios which will have our array of posts
  
### Implementing Posts Redcuer
 - ./reducer/index.js removing `state: (state = {}) => state`
 - import the reducer that we create ./reducer/reducer_post
 - import type of fetch_posts from the actions
  ```
  import { FETCH_POSTS } from '../actions';

  export default function(state = {}, action){
   switch(acion.type){
      case FETCH_POSTS:
        console.log(action.payload.data) 
      default:
         return state;
   }
  }
  ```
  here `state={}` is because what our initial state object should be, that's why we have defaulted it to object the very first time it runs 
  action.payload.data will have an array of all posts we can transform that to object manually but here we are gonna use `lodash` module

 - lodash has this `_.mapKeys(posts, 'id' )` method that will resolve the array into object of posts with the id as the key
  ```
  case FETCH_POSTS:
    return _.mapKeys(action.payload.data, 'id');
  ```