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

### Action Creator shortcuts
 - wireup the fetch_posts action creator to the fetch_posts component
  ```
  import { connect } from 'react-redux';
  import { fetchPosts } from '../actions';
  ```

  here the connect helper we have always used with `mapDispatchToProps` to have the action creator directly into the component so we can call it off to a props object
  here we are going to use another way kind of shortcut to wireup the action creator 

  so instead of `mapStateToProps` argument we will have `null` since we are not having it.
  and in the second argument rather than passing `mapDispatchToProps` function we can directly pass in the action creator itself inside of an object :p
  ```
  export default connect(null, { fetchPosts: fetchPosts })(PostsIndex);
  ```
  but with **ES6** 
  ```
  export default connect(null, { fetchPosts })(PostsIndex);
  ```
 - a real question is *when are we going to call the action creator to call the api and reach our api to fetch the posts* may be some click, hover events.
  so as soon as the `PostsIndex` component renders we want it to reach out to the API and fetch the posts 
  here comes the **React Life Cycle Method**, it is a function on a react class that is automatically called by react
  we need `ComponentDidMount`
 - `componentWillMount` will not work nicely because as the react is eager to render the component but the API fetching may take time asynchronously to fetch the data before the component mounts on the dom

### Redndering a list of posts
 - set up a new article in the POSTMAN API software and then POST it. Then reload our app see it in the network tab and XHR we would be able to see the posts 
  ```
  function mapStateToProps(state) {
    return { posts: state.posts };
  }
  ```

 and then also hook up the mapStateToProps function to the connect middleware
 ```
 export default connect(mapStateToProps, { fetchPosts })(PostsIndex);
 ```
 - add the following:
 ```
 renderPosts() {
   return _.map(this.props.posts, post => {
     return (
       <li className="list-group-item">
        { post.title }
       </li>
     )
   });
 }

 render() {
  return(
    <div>
      <h3>Posts</h3>
      <ul className="list-group">
        { this.renderPosts() }
      </ul>
    </div>
  )
 }
 ```

### Creating new Posts
 - Scaffold PostsNew component
 - Add route configuration
 - Add navigation between Index and New
 - Add form to PostsNew
 - Make action creator to save post 
 - but after adding the new posts_new component in the main app it shows all the index components as well

### React router Gotcha
 - { Switch } component takes in a collection of different routes, it takes in a colleciton of different routes
 - and we need to put the root route at the end of the list

### Navigation with Link Component
 - use Link component inside posts_index component so that 
 ```
 <div className="text xs-right>
  <Link className="btn btn-primary" to="/posts/new">
    Add new Posts
  </Link>
 </div>
 ```
 it does render as an anchor tag on the dom, so it is React-router's anchor and it must be used like one.

### Redux forms
 - in /posts/new the user will put in all the different data and hit save so we need the blog API to save it and redirect to the homepage of the app.
 - so building form will be complicated because we have many input fields here and we want to validate each of the input field we are gonna use conditional library called `redux-forms' it is all about handling any type of FORM that we put together with redux, validating the input and then submitting the form in some fashion
 - install it with npm module and look at the docs on github
 - import the reducer from the redux form, it uses our instance of store so it wires up some action creators and reducers that we might have to look at.
 - in /reducer/index.js 
 ```
 import { reducer as formReducer } from 'redux-form';
 ```
 so we are just using alias formReducer for our reducer form and add it to the common RootReducer
 ```
 const rootReducer = combineReducers({
   posts: postReducer,
   form : formReducer
 })
 ```

### Setting up redux-forms
 - The soul purpose of using redux-forms instead of handling the inputs manually
 - to identify different pieces of `form state` i.e. 3 pieces of state title, categories, contents 
 - Make one `Field` component per piece of state i.e., is created by `redux-form` for us
 - User changes a `Field` input i.e., action creator 
 - Internally Redux form automatically handles all of these changes i.e., that's the boiler plate we don't have to write
 - User submits form
 - we validate inputs and handle submittal
 - in the /components/posts_new.js 
 ```
 import { Field, reduxForm } from 'redux-form';
 ```
 field is a react component, reduxForm is a function, it is identical `connect` helper from `react-redux` so use `reduxForm` helper and attatch it to somehow `PostsNew` component
 ```
 export default reduxForm({
   form: 'PostsNewForm'
 })(PostsNew);
 ```
 instead of `mapStateToProps` and `mapDispatchToProps` we pass single argument which is a function which has configuration options
 the `form` property can be looked as the name of the form
 - so if we had another PostEdit.js file and if we 
 ```
 export default reduxForm({
   form: 'PostsNewFor'
 })(PostsNew)
 ```
 then it is going to be merge with the above function because of the same name. 
 - now to communicate with the reducer, so sending up the actual form inside our component, so /components/posts_new.js
 ```
 class PostsNew extends Component {
   render(){
     <form>
      <Field
        name="title"
        component={}
      />
     </form>
   }
 }
 ```
 name is the piece of state that we are going to edit
 component property takes in a function that will be used to display this field component

### The field Component
 - we are going to have 3 field components for
 title,
 categories,
 content
 - the basic form property is kind of namespace here unique, in the reduxForm helper function, is to have it in isolation form all the state that is going to be generated by this particular component, 

 it only needs to be unique if we want it in isolation and not share any of its states with any other forms, it helps when we have multipage app

 - field component itself doesn't know how to produce enough JSX to show itself on screen, it only knows how to interact with `redux-form`, so the component property is adding a function that will return some amount of JSX to show that field on the screen
 - so it is going to use custom handler functions
 ```
 renderTitleField(field) {
   return(
     <div>
      <input
       type="text"
       {...field.input}
      />
     </div>
   )
 }

 <Field
  name = "title"
  component = { this.renderTitleField }
 />
 ```
 the field needs to go in as argument because the Field component needs to control what renders and manipulates inside it which is a <input/> so wire it up

 - the thre dots(.) are for the object there and all of its properties in that object to be communicated as props to the input tag

### Generalizing field
 - give input field label as well
 - create another field for tags(categories)
 - no need to separated functions for various fields just a generalized one with `renderField` and just put them in the component properties of the Fields
 - so we should pass arbitrary properties for particular Field component that we want to render for. and have the label in the renderField function as `{ field.title }` so that it renders particular thing for that particular Field
 - create a new 'Content` Field

### Validating form
 - tags are categories actually so changed it
 - create a validate function and give it in as a configuration to the redux-form
 - the validate function is in the configuration so it will be called by the redux-form once the form is filled up and if the error object is empty then it is validated otherwise it will give out the errors

### Showing errors to users
 - we need to get the error messages to show up so we can reference the field object 
 - so in the renderField function we need to add {field.meta.error}
 - the error object looks at the Field components name property so the errors.title is intended

### Handling Form submittal
 - create a submit button (obvioulsy! :p)
 - `onSubmit` function in the form itself , **reduxForm only handle the state and validation part of our form**, it is not responsible for things like taking data and saving in some form
  basically `onSubmit` will have some code from the redux-form and some of our own code
 ```
 onSubmit(values){
   console.log(values);
 }

 const { handleSubmit } = this.props;

 onSubmit = { handleSubmit(this.onSubmit.bind(this)) }
 ```
 when we wire up the redux-form it passes ton of additional properties to our redux-form, so the `handleSubmit` was passed from redux-form to this component so that's why we started it as this.props

 - so first handleSubmit() is from redux-form and it first validates make sure if everything is working perfectly and then it calls the `onSubmit` function that we have defined
 - we bind the onSubmit because we wanted it into the context of our component

### Form and Field States
 - errors only needs to be displayed when it is going to happen so in the renderField helper and add a ternary conditional to the `{field.meta.error}`
 ```
 { field.meta.touched ? field.meta.error : '' }
 ```
 empty string at the end
 - now just needed a bit of styling with css

### Conditional Styling
 - add `has-danger`to renderField helpers div element where className is already form-group
 - also add 
 ```
 <div className="text-help">
  { field.meta.touched ? field.meta.error : '' }
 </div>
 ```
 - so for better code organization we will have this in renderField helper
 ```
 const className = `form-group ${field.meta.touched && field.meta.error ? 'has-danger' : ''}`;
 ```
 we can create another `const { meta } = field` and remove all the field term that has been called

 so we can do more structuring by
 ```
 const { meta: { touched, error } } = field;
 ```
 and again we can remove all the meta from the called things
 also remove the hard codded css class name and add the variable that we have defined

### Navigation again
 - so in the /components/posts_new.js we have to make the navigation possible to 
 ```
 import { Link } from 'react-router';

 <Link to='/' className="btn btn-danger">Cancel</Link>
 ```
 also add some css so two buttons don't look sandwiched together so the /style/style.css would be following
 ```
 form a {
   margin-left: 5px;
 }
 ```
 because <Link> tags are basicaly anchor tags 
 **css still can't be linked to the main file**

### Create post action creator
 - in /actions/index.js we need to create a new action-creator function
 ```
 export const CREATE_POSTS = 'create_posts

 export default createPosts(values) {
   const request = axios.post(`${ROOT_URL}/posts${API_KEY}`);

   return {
     type: CREATE_POSTS,
     payload: request
   }
 }
 ```
 the values object passed into the action function so that it knows what to post 
 - so now only need to check in the reducer where state is actually an object where the keys are id of the posts and values are the actual posts themselves so **leave the reducer as it is**

 - and now in the /components/posts_new.js call the action creator and import the connect helper as well
 ```
 import { connect } from 'react-redux';
 import { createPosts } from './actions';

 export default reduxForm({
   validate,
   form: 'PostsNewForm'
 })(
   connect(null, { createPost })(PostsNew)
 );
 ```
 and at the bottom we already have redux-form helper so we are gonna put the connect helper inside it as the second argument; this is how to stack up multiple connect like helpers

 the createPost action creator does return a react component
 - in the `onSubmit` function call the action creator the so the action takes place
 ```
 onSubmit(values){
   this.props.createPost(values);
 }
 ```
 don't forget to pass in the values

  #### The request must be made with values in the second argument in the action creator createPosts function

### Navigation through callbacks
 - so whenever React router's <Route> component renders our component according to the paths it will also pass on many other props as well so one of them is `history` so we need to put in 
 ```
 this.props.history.push('/');
 ```
 in our `onSubmit` function 
 - but it only just redirects to homepage without even completing the post operation and then on the index page the newly created post doesn't appear so we need to basically use callbacks to have the first operation compelete itself and then only render with the new post in the list. so it would look like following
 ```
 onSubmit(values){
   this.props.createPost(values, () => {
     this.props.history.push('/');
   })
 }
 ```

 and also in the action creator after the request happens we need to define, axios.post returns a promise so we can use .then()
 ```
 export function createPost(values, callback) {
   const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values)
                        .then(() => callback());
 ....}
 ```

### New posts_show component
 - /components/posts_show and import it in index.js
 - don't forget to put the Router path of /posts/:id after the /posts/new because order matters here
 - so create a new action creator 
 ```
 export const FETCH_POST = 'fetch_post';
 export function fetchPost(id){
   const request = axios.get(`${ROOT_URL}/posts/${id}#{API_KEY}`);

   return {
     type: FETCH_POST,
     payload: request
   }
 }
 ```
 - now also add the action creator in the reducer_posts file.
 ```
 import { FETCH_POSTS, FETCH_POST } from '../actions';

 export default function (state = {}, action){
   switch(action.type){
      case FETCH_POST:
        const post = action.payload.data;
        const newState = { ...state };
        newState[post.id] = post;
        return newState;
   }
 }
 ```

### Selecting from own props
 - in the /components/posts_show.js
 ```
 import { connect } from 'react-redux';
 import { fetchPost } from '../actions';

 class PostsShow extends Component {
   componentDidMount(){
     this.props.match.params.id;
     this.props.fetchPost();
   }

   render(){
     return(
       <div> Posts Show! </div>
     )
   }
 }
 
 function mapStateToProps({ posts }){

 }

 export default connect(null, { fetchPost })(PostsShow);
 ```
 we are trying to fetch a particular id of the post so in the mapStateToProps({ posts }), so we don't want to work with big list of posts but only with a particular id of post

 - so we can use a token which provided to us from the URL; **react-router provides directly this from the url**
 ```
 componentDidMount(){
   // this.props.match.params.id;
   const { id } = this.props.match.params;
   this.props.fetchPost(id);
 }
 ```
 - params object will hold all the given wild card parameters in the url, so here we only need the id one that's why we called it
 - so there is no need to pass the whole posts object and then derive to one single post that we care about but we need to figure out a way to get a single post
 ```
 function mapStateToProps({ posts }, ownProps){ ... }
 ```
 ownProps is the by convention we call in ownProps, it is headed/going to the component specified in that class

### Data Dependencies
 - after setting up the mapStateToProps and also set it up in the connect helper we just need to render
 - `can not read title of undefined` we have the things defined in our reducer but it still making that undefined effect 
 - the flow goes like this we first try to fetch the post from the api then the redux connector and mapStateToProps looks at it and tries to map the single post as wrote in the code, but this is asynchronous operation so until this gets completed we need to render that it is **Loading...**
 - so put an if condition for the same and as soon as the api fetches it our component will render.

### Caching records
 - create a Link tag to navigate back to posts index, so import it in the post_show itself.
 - add the link tag again inside of our post_index component so that on clicking a particular post title it will take us to that particular post
 - add the posts id in the link inside the renderPosts helper in posts_index file
 ```
 <Link to={`/posts/${post.id}`}>
  { post.title }
 </Link>
 ```
 - also if we are so tightly constrained on network fetching then we should just not fetch each post individually and take it from the list of posts while all of the were fetched from the API. But put it in a conditional because we don't know since how long the user has been sitting on the index page.
 so in posts_show put the componentdidMount()'s content in an if conditional if needed.

### Deleting a post
 - a button to render in posts_show to delete that particular post
 ```
 onDeleteClick(){
   const { id } = this.props.match.params;
   this.props.deletePost(id);
 }

 <button
  className = "btn btn-danger pull-xs-right"
  onClick = {this.onDeleteClick.bind(this)} 
 >
 Delete Post
 </button>
 ```
 again get the id from the params object that has been given to us by react-router

 - we can even put it like `this.props.deletePost(this.props.post.id)` but since the post itself takes time to get fetched and then render the button might say that it was undefined initially so it is safer to look at the react-router's params object and take the id to delete

 - here we worked backward so don't forget to import the deletePost action creator and then create it in the action creator itself also add it in the `connect` helper at the bottom
 - delete Action creator
 ```
 export const DELETE_POST = 'delete_post';

 export function deletePost(id, callback){
   const request = axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
                        .then(() => callback());
   return {
     type: DELETE_POST,
     payload: id
   }
 }
 ```
 - and also add following in the post_show onDeleteClick function
 ```
 import { fetchPost, deletePost } from '../actions';

 onDeleteClick(){
   const { id } = this.props.match.params;

   this.props.deletePost(id, () => {
     this.props.history.push('/');
   });
 }

 export default connect(mapStateToProps, { fetchPost, deletePost }))(PostsShow);
 ```

 - so now even after deleting the post the post still remains in the state/reducer so we need to define another switch case to make it remove from there as well. so in our reducer file
 ```
 case DELETE_POST:
  return _.omit(state, action.payload);
 ```

### Wrap up - Conclusion
 - this react-redux app used a reducers, action creators to create posts, and delete them and we also used react-router inside our actionCreators with history object
 - ownProps system, with mapStateToProps, it is the 2nd argument so it is the set of props that is going to the target component
 so it makes mapStateToProps really great to do some intermediate level of calculation
 - in the reducers with fetch_post, we made it easier to take all of our existing state and add in the additional record to that object as well. so we keep going back to the same post over and over the key post existing inside our state object is just getting over-written by `[action.payload.data.id]: action.payload.data`