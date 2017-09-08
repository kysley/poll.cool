import React from 'react'


class Options extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
      val: '',
    }
	}

  handleOptionNameChange = (e, idx) => {
    const newOptions = this.props.options.map((option, oidx) => {
      if (idx !== oidx) return option
      return { name: e.target.value}
    })
    this.props.optionNameChangeCallback(newOptions)
  }

  handleRemoveOption = (idx) => {
    let data = this.props.options
    data = this.props.options.filter((o, oidx) => idx !== oidx)
    this.props.removeOptionCallback(data)
  }

  render() {
    return (
      <div>
      { this.props.options.map((option, idx) => (
        <div key={idx}>
        <input
          className="create--input option"
          placeholder={`Option ${idx + 1}`}
          value={option.name}
          onChange={e => this.handleOptionNameChange(e, idx)}
        />
        <span onClick={() => this.handleRemoveOption(idx)}>-</span>
        </div>
      ))}
      </div>
    )
  }

}

export default Options
