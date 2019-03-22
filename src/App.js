import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import _ from "lodash";
import { DatePicker, Input, Select } from "antd";
const Option = Select.Option;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
  }

  onChangeInputValue = (e) =>{
    console.log(e)
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div>
        <input value={inputValue} onChange={this.onChangeInputValue} />
        <button>按钮33</button>
      </div>
    );
  }
}

export default hot(App);
