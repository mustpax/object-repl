import React, { Component } from "react";
import ReplOutput from "./ReplOutput";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextId: 71717172,
      blocks: [],
      maxCollapseDepth: 1,
      command: JSON.stringify({
        name: "Moose",
        likes: ["puzzles", "meditation", "quiet"],
        address: {
          zip: 94110,
          state: {
            short: "CA",
            long: "California",
          },
        },
        profile: "https://media.giphy.com/media/cJSdHSJ4yhmltD9epc/giphy.gif",
      }), // TODO debug code
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
      let errMsg = "";
      if (error.response && error.response.data) {
        errMsg = error.response.data;
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
        <div className="config">
          <h2>Config</h2>
          <div className="control">
            <span>Auto-expand depth: </span>

            <input
              type="number"
              min="0"
              max="10"
              value={this.state.maxCollapseDepth}
              onChange={(e) =>
                this.setState({ maxCollapseDepth: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
        <h1>Object Repl</h1>
        <ul className="repl">
          {this.state.blocks.map((block, index) => (
            <li key={index}>
              <div className="command">{block.command}</div>
              <ReplOutput
                error={block.error}
                response={block.response}
                uncollapseLevel={this.state.maxCollapseDepth}
              />
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

        <div className="clear"></div>
      </div>
    );
  }
}

export default App;
