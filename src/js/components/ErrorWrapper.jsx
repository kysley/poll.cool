import React from 'react'

class ErrorWrapper extends React.Component {
	constructor(props) {
		super(props)

    this.state = {
      val: '',
    }
	}

  render() {
    console.log(this.props)
    return(
      <div className="col-12-of-12 error--wrapper fadeInUp">
        <h1 className="error--msg">{this.props.msg} </h1>
        <h2 className="error--tip">{this.props.tip}</h2>
      </div>
    )
  }
}

export default ErrorWrapper
