import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPost } from '../actions';

class PostsNew extends Component {
   renderField(field){
      const { meta: { touched, error } } = field;
      const className = `form-group ${touched && error ? 'has-danger' : ''}`;

      return(
         <div className={className}>
         <label htmlFor="Title">{ field.label }</label>
            <input
               className="form-control"
               type="text"
               {...field.input}
            />
            <div className="text-help">
               {touched ? error : ''}
            </div>
         </div>
      )
   }

   onSubmit(values){
      console.log(values);
      this.props.createPost(values);
   }

   render() {
      const { handleSubmit } = this.props;

      return (
         <form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
            <Field
               label="Title"
               name="title"
               component = {this.renderField}
            />
            <Field
               label="categories"
               name="categories"
               component={ this.renderField }
            />
            <Field
               label="Content"
               name="content"
               component={ this.renderField }
            />
            <button type="submit" className="btn btn-primary" >Submit</button>
            <Link to="/" className="btn btn-danger"> Cancel </Link>
         </form>
      )
   }
}

function validate(values) {
   const errors = {};

   // validate the inputs from 'values'
   if(!values.title){
      errors.title = "Enter a value!";
   }

   if(!values.categories){
      errors.categories = "Enter some categories";
   }

   if(!values.content){
      errors.content = "Enter some content please";
   }

   return errors;
}

export default reduxForm({
   validate, //validate: validate ES6 key: values same so we can write only one
   form: 'PostsNewForm'
})(
   connect(null, { createPost })(PostsNew)
);

// PostEdit.js
