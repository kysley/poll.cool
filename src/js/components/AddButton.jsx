import React from 'react'
import classNames from 'classnames'

class AddButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      val: '',
    }
  }

  handleSubmit = () => {
    this.props.onClick()
  }

  render() {
    const classes = classNames({
      'option--button': true,
    })
    return (
      <button
        className={classes}
        onClick={this.handleSubmit}
      >
        Add Option
      </button>
    )
  }
}

export default AddButton
