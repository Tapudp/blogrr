import _ from 'lodash'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../actions';

class PostsIndex extends Component {
   componentDidMount() {
      this.props.fetchPosts();
   }

   renderPosts() {
      return _.map(this.props.posts, post => {
         return (
            <li className = "list-group-item" key={ post.id } >
               { post.title }
               <p> { post.content } </p>
               <small> { post.categories } </small>
            </li>
         )
      });
      // return this.props.posts.toArray().map(post => {
      //    return (
      //       <li className = "list-group-item" key={ post.id } >
      //          { post.title }
      //       </li>
      //    )
      // })
   }

   render() {
      console.log(this.props.posts);
      return (
         <div>
            <h3>Posts</h3>
            <ul className = "list-group" >
               { this.renderPosts() }
            </ul>
         </div>
      )
   }
}

function mapStateToProps(state){
   return { posts: state.posts }
}

export default connect(mapStateToProps, { fetchPosts })(PostsIndex);
// export default connect(null, { fetchPosts: fetchPosts })(PostsIndex);