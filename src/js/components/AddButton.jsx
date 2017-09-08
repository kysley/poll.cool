import React from 'react'
import classNames from 'classnames'

class AddButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      val: '',
    }
  }

  handleAddOption = () => {
    let data = this.props.options
    data = this.props.options.concat([{ name: '' }])
    this.props.addOptionCallback(data)
  }

  render() {
    const classes = classNames({
      'option--button': true,
    })
    return (
      <button
        className={classes}
        onClick={() => this.handleAddOption()}
      >
        Add Option
      </button>
    )
  }
}

export default AddButton
