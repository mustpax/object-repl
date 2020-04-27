import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [{ title: "a" }],
    };
  }

  componentDidMount() {
    async function run(code) {
      let resp = await axios.post("https://flatval.masfrost.repl.co/", {
        code,
        contextId: 1,
      });
      return resp.data;
    }

    async function getData() {
      console.log(await run("var x = 1"));
      console.log(await run("x"));
    }
  }

  render() {
    const { posts } = this.state;
    return (
      <div className="App">
        <h1>Test2</h1>
        <ul>
          {posts.map((post, i) => (
            <li key={i}>{post.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
