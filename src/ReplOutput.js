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
        <span className="primitive">[{type}]</span>
        {value}
      </pre>
    );
  }

  if (type === "object") {
    return (
      <div>
        <h2>{"{"}</h2>
        <table>
          <tbody>
            {value.map(([k, v], index) => (
              <tr key={index}>
                <td style={{ display: "flex", alignItems: "center" }}>
                  <ReplOutput response={response} heapIndex={k} />
                  <span className="colon">:</span>
                </td>
                <td>
                  <ReplOutput response={response} heapIndex={v} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>{"}"}</h2>
      </div>
    );
  }

  return <pre>{JSON.stringify(response, null, 2)}</pre>;
}

export default ReplOutput;
