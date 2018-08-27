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

