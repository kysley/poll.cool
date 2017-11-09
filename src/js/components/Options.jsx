import React from 'react'


const Options = (props) => {
  this.handleOptionNameChange = (e, idx) => {
    let data = props.options

    if (data.length === idx + 1 && data.length < 10) {
      data = props.options.concat([{ name: '' }])
      props.addOptionCallback(data)
    }
    const newOptions = data.map((option, oidx) => {
      if (idx !== oidx) return option
      return { name: e.target.value }
    })
    props.optionNameChangeCallback(newOptions)
  }

  this.handleRemoveOption = (idx) => {
    let data = props.options
    if (data.length === 2) return
    data = props.options.filter((o, oidx) => idx !== oidx)
    props.removeOptionCallback(data)
  }

  return (
    <div className="option--wrapper">
      { props.options.map((option, idx) => (
        <div className="option--self" key={idx}>
          <input
            className="create--input option"
            placeholder={`Option ${idx + 1}`}
            value={option.name}
            maxLength={140}
            onChange={e => this.handleOptionNameChange(e, idx)}
          />
          <span className="option--delete" onClick={() => this.handleRemoveOption(idx)}>REMOVE</span>
        </div>
      ))}
    </div>
  )
}

export default Options
