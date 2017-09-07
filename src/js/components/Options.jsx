import React from 'react'


class Options extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
      val: '',
    }
	}

  editOption = (e, idx) => {
    console.log(this.props)
    this.props.onOptChange(e, idx)
  }

  removeOption = (idx) => {
    this.props.onOptRemove(idx)
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
          onChange={e => this.editOption(e, idx)}
          
        />
        <span onClick={() => this.removeOption(idx)}>-</span>
        </div>
      ))}
      </div>
    )
  }

}

export default Options
