import React from "react";

function ReplOutput({ response, heapIndex }) {
  if (!response) {
    return <pre>. . .</pre>;
  }

  heapIndex = heapIndex || 0;
  const current = response[heapIndex];
  if (!current) {
    return <pre>Error: Invalid heap index {heapIndex}</pre>;
  }

  const { type, value } = current;
  if (["string", "number", "boolean", "null"].includes(type)) {
    return (
      <pre>
        {type}: {value}
      </pre>
    );
  }

  if (type === "object") {
    return (
      <div>
        <table>
          {value.map(([k, v]) => (
            <tr>
              <td>{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }

  return <pre>{JSON.stringify(response, null, 2)}</pre>;
}

export default ReplOutput;
