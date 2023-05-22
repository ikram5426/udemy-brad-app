import React, { useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
   email: "",
    password: ""
  });

  const {email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
   
    setFormData({email: "", password: ""});
  };
  return (
    <React.Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Sign in </h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Log in your Account
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
        
          
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => onChange(e)}
              name='email'
            />
          
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='6'
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
        
          <input type='submit' className='btn btn-primary' value='Register' />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </React.Fragment>
  );
};

export default Register;
