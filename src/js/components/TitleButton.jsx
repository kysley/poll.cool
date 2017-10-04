import React from 'react'
import classNames from 'classnames'

const TitleButton = (props) => {
  this.handleSaveTitle = () => {
    const data = []
    data.validTitle = false
    if (props.titleText === 'Continue') {
      data.validTitle = true
    }
    props.saveTitleCallback(data)
  }

  const classes = classNames({
    'create--button': true,
    'is-valid': props.titleText === 'Continue',
    'is-invalid': props.titleText !== 'Continue',
  })

  return (
    <button
      className={classes}
      onClick={this.handleSaveTitle}
    >
      {props.titleText}
    </button>
  )
}

export default TitleButton
