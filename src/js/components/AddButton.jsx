import React from 'react'
import classNames from 'classnames'

const AddButton = (props) => {
  this.handleAddOption = () => {
    let data = props.options
    if (data.length >= 10) {
      return
    }
    data = props.options.concat([{ name: '' }])
    props.addOptionCallback(data)
  }

  const classes = classNames({
    'option--button': true,
  })

  return (
    <button
      className={classes}
      onClick={this.handleAddOption}
    >
      Add Option
    </button>
  )
}

export default AddButton
