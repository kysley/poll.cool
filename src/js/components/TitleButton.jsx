import React from 'react'
import classNames from 'classnames'

class TitleButton extends React.Component {
  constructor(props) {
    super(props)
    this.saveTitle = this.saveTitle.bind(this)

    this.state = {
      val: '',
    }
  }

  saveTitle = (e) => {
    this.props.handleSaveTitle()
    this.setState({
      val: e.target.value,
    })
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
        onClick={e => this.saveTitle(e)}
      >
        {this.props.titleText}
      </button>
    )
  }
}

export default TitleButton
