import React from 'react'
import classNames from 'classnames'
import copy from 'copy-text-to-clipboard'

class CopyButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      copiedAlert: false,
    }
  }

  handleCopyLink = () => {
    this.setState({ copiedAlert: true })
    const link = `pollarity.cool/poll/${this.props.id}`
    copy(link)
    setTimeout(() => { this.setState({ copiedAlert: false }) }, 1100)
  }

  render() {
    const classes = classNames({
      'copy--button': true,
    })

    const classesR = classNames({
      shown: this.state.copiedAlert,
      'dur-3': true,
      fadeIn: this.state.copiedAlert,
      fadeOut: !this.state.copiedAlert,
      'copy--button__dialog': true,
    })
    return (
      <div className="copy--button__wrapper">
        <button
          className={classes}
          onClick={this.handleCopyLink}
        >
          Copy Link!
        </button>
        <span className={classesR}>Copied :)</span>
      </div>
    )
  }
}

export default CopyButton
