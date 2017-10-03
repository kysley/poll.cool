import React from 'react'
import classNames from 'classnames'

const LoadingModal = (props) => {
  const classes = classNames({
    'loading--alert': true,
    'dur-3': true,
    fadeIn: props.active === true,
    fadeOut: props.active !== true,
  })
  return (
    <div className={classes}>
      <h1>Hang tight!</h1>
      <h2>Our recordkeepers are prepping your Poll in record time.</h2>
    </div>
  )
}

export default LoadingModal
