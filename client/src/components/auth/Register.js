import React, { Fragment, useState } from 'react'
import { Link , Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'


import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'



const Register = ({setAlert, register, isAuthenticated}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  })


  const {name, email, password, password2} = formData

  const onChange = event => setFormData({...formData, [event.target.name]: event.target.value})

  const onSubmit = async event => {
    event.preventDefault();

    if (password !== password2) {
      setAlert('Password does not match', 'danger')
    } else {
      register({name, email, password});
    }
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2} onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.prototype = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, register})(Register)