import React, { Component } from "react";
import ReplOutput from "./ReplOutput";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      command: JSON.stringify({ hello: "world", count: -1 }), // TODO debug code
    };
  }

  componentDidMount() {
    this.submit(); // TODO debug code
  }

  async run(code) {
    let resp = await axios.post("https://flatval.masfrost.repl.co/", {
      code,
    });
    return resp.data.result;
  }

  async submit(event) {
    if (event) {
      event.preventDefault();
    }
    const { command, blocks } = this.state;
    let blockIndex = blocks.length;
    this.setState({
      blocks: blocks.concat({
        command,
      }),
      command: "",
    });

    try {
      let response = await this.run(command);
      let block = this.state.blocks[blockIndex];
      if (!block) {
        // TODO handle error from race condition
      }
      this.setState({
        blocks: this.state.blocks.map((block, index) =>
          index === blockIndex ? { ...block, response } : block
        ),
      });
    } catch (e) {
      // TODO display error
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Repl</h1>
        <ul className="repl">
          {this.state.blocks.map((block) => (
            <li>
              <div>{block.command}</div>
              <ReplOutput response={block.response} />
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
