import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  async function getData() {
    let resp = await axios.get("https://jsonplaceholder.typicode.com/posts");
    setPosts(resp.data);
  }

  useEffect(function () {
    getData();
  }, []);

  return (
    <div className="App">
      <h1>Test</h1>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
