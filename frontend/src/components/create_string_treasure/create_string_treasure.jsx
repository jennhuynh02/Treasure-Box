import React from 'react';

class CreateStringTreasure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      error: '',
    };

    this.handleQuote = this.handleQuote.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleQuote(e) {
    this.setState({
      quote: e.currentTarget.value,
    });
  }

  handleUpload(e) {
    e.preventDefault();
    if (this.state.quote !== '') {
      let treasure = {
        ownerId: this.props.currentUser.id,
        quote: this.state.quote,
        type: "quote",
      }
			this.props.createTreasure(treasure);
      this.setState({ quote: "" });
      this.props.currentUser.keyCount += 1;
      this.props.closeModal()
      console.log("Upload Successful!")
    } else {
      this.setState({
        error: "Is this even a treasure? Please enter something...",
      });
    }
  }

  render() {
    const {type} = this.props;
		return (
      <div className="bucket-box">
        <div>
          <h3>
            {type}
          </h3>
        </div>
        <div>
          <textarea
            className="quote-input"
            value={this.state.quote}
            onChange={this.handleQuote}
          />
          <div className="mt-5">
            {this.state.error}
            <br />
            <button className="upload-quote-button" onClick={this.handleUpload}>
              Exchange this treasure for key!
            </button>
            <br />
            <button className="upload-quote-button" onClick={() => this.props.openModal({ retrieve: -1 })}>
              Retrieve Treasure Instead
            </button>
            <button className="upload-quote-button" onClick={(e) => this.props.closeModal(e)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateStringTreasure;
