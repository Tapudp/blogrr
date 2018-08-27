import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class PostsNew extends Component {
   renderField(field){
      return(
         <div className="form-group">
         <label htmlFor="Title">{ field.label }</label>
            <input
               className="form-control"
               type="text"
               {...field.input}
            />
            {field.meta.error}
         </div>
      )
   }

   render() {
      return (
         <form>
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
         </form>
      )
   }
}

function validate() {
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
})(PostsNew);

// PostEdit.js
