import React from 'react'
import classNames from 'classnames'

const ErrorAlert = (props) => {
  const classes = classNames({
    'error--alert': true,
    'dur-3': true,
    'fadeIn': props.active !== 'Continue',
    'fadeOut': props.active === 'Continue',
    'voted-info': props.active === '',
  })
  return (
    <div className={classes}>
      <span>{props.errorInfo.msg}&nbsp; {props.errorInfo.tip}</span>
    </div>
  )
}

export default ErrorAlert
