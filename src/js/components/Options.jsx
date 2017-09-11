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
    if (data.length == 2) return
    data = this.props.options.filter((o, oidx) => idx !== oidx)
    this.props.removeOptionCallback(data)
  }

  render() {
    return (
      <div className="option--wrapper">
      { this.props.options.map((option, idx) => (
        <div className="option--self" key={idx}>
        <input
          className="create--input option"
          placeholder={`Option ${idx + 1}`}
          value={option.name}
          onChange={e => this.handleOptionNameChange(e, idx)}
        />
        <span className="option--delete" onClick={() => this.handleRemoveOption(idx)}>REMOVE</span>
        </div>
      ))}
      </div>
    )
  }

}

export default Options
