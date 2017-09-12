import React from 'react'
import classNames from 'classnames'

const SubmitButton = (props) => {

  this.handleSubmit = () => {
    props.onClick()
  }

  const classes = classNames({
    'create--button': true,
    '_submit': true,
    'is-valid': props.validOptionSet,
    'is-invalid': !props.validOptionSet,
  })
  
  return (
    <button
      className={classes}
      onClick={this.handleSubmit}
    >
      {props.titleText}
    </button>
  )
}

export default SubmitButton
