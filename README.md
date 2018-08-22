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