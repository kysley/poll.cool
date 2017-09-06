import React from 'react'
import classNames from 'classnames'

class SubmitButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      val: '',
    }
  }

  handleSubmit = () => {
    this.props.handlePoll()
  }

  render() {
    const classes = classNames({
      'create--button': true,
      '_submit': true,
      'is-valid': this.props.validOptionSet,
      'is-invalid': !this.props.validOptionSet,
    })
    return (
      <button
        className={classes}
        onClick={this.handleSubmit}
      >
        {this.props.titleText}
      </button>
    )
  }
}

export default SubmitButton
