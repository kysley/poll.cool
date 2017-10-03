import React from 'react'

const ErrorWrapper = props => (
  <div className="col-12-of-12 error--wrapper fadeInUp">
    <h1 className="error--msg">{props.msg} </h1>
    <h2 className="error--tip">{props.tip}</h2>
  </div>
)

export default ErrorWrapper
