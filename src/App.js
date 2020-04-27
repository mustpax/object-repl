import React, { Component } from "react";
import ReplOutput from "./ReplOutput";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextId: 71717171,
      blocks: [],
      command: JSON.stringify({ hello: "world" }), // TODO debug code
      command: JSON.stringify({ hello: "world", count: -1 }), // TODO debug code
      command: JSON.stringify({
        hello: "world",
        count: -1,
        address: { zip: 94110 },
      }), // TODO debug code
      // command: JSON.stringify("!testing testing!"), // TODO debug code
    };
  }

  componentDidMount() {
    this.submit(); // TODO debug code
  }

  async run(code) {
    let resp = await axios.post("https://flatval.masfrost.repl.co/", {
      code,
      contextId: this.state.contextId,
    });
    return resp.data.result;
  }

  async submit(event) {
    if (event) {
      event.preventDefault();
    }
    const { command, blocks } = this.state;
    // Remember location in blocks array in case the user submits multiple entries
    // before server has responded
    let blockIndex = blocks.length;
    this.setState({
      blocks: blocks.concat({
        command,
      }),
      command: "",
    });

    try {
      let response = await this.run(command);
      this.setState({
        blocks: this.state.blocks.map((block, index) =>
          index === blockIndex ? { ...block, response } : block
        ),
      });
    } catch (error) {
      console.error("Error loading command", command, error.response);
      let errMsg;
      if (error.response && error.response.data) {
        errMsg = error.response.data;
      } else {
        errMsg = true;
      }
      this.setState({
        blocks: this.state.blocks.map((block, index) =>
          index === blockIndex ? { ...block, error: errMsg } : block
        ),
      });
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Repl</h1>
        <ul className="repl">
          {this.state.blocks.map((block, index) => (
            <li key={index}>
              <div>{block.command}</div>
              <ReplOutput error={block.error} response={block.response} />
            </li>
          ))}
        </ul>
        <form onSubmit={this.submit.bind(this)}>
          <input
            tabIndex="0"
            type="text"
            value={this.state.command}
            onChange={(e) => this.setState({ command: e.target.value })}
          />
        </form>
      </div>
    );
  }
}

export default App;
