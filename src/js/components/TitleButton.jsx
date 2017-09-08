import React from 'react'
import classNames from 'classnames'

class TitleButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      val: '',
    }
  }

  handleSaveTitle = () => {
    const data = []
    data.validTitle = false
    if (this.props.titleText === 'Continue') {
      data.validTitle = true
    }
    this.props.saveTitleCallback(data)
  }

  render() {
    const classes = classNames({
      'create--button': true,
      'is-valid': this.props.titleText === 'Continue',
      'is-invalid': this.props.titleText !== 'Continue',
    })
    return (
      <button
        className={classes}
        onClick={() => this.handleSaveTitle()}
      >
        {this.props.titleText}
      </button>
    )
  }
}

export default TitleButton
