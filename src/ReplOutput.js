import React, { useState, useEffect, Fragment } from "react";

function isImg(str) {
  let regex = /^https?:\/\/.+\/.+\.(jpe?g|gif|png)$/i;
  return !!regex.exec(str);
}

function ReplOutput({ response, heapIndex, error, uncollapseLevel }) {
  uncollapseLevel = uncollapseLevel || 0;

  const [isCollapsed, setIsCollapsed] = useState(uncollapseLevel <= 0);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    setIsCollapsed(uncollapseLevel <= 0);
  }, [uncollapseLevel]);

  if (error) {
    return (
      <pre className="error">Error {error === "" ? "" : ": " + error}</pre>
    );
  }

  if (!response) {
    return <pre>. . .</pre>;
  }

  heapIndex = heapIndex || 0;
  const current = response[heapIndex];
  if (!current) {
    return <pre>Error: Invalid heap index {heapIndex}</pre>;
  }

  const { type, value } = current;

  function PrimitiveLabel() {
    return <span className="primitive">[{type}]</span>;
  }

  if (["null", "undefined"].includes(type)) {
    return (
      <pre>
        <PrimitiveLabel />
      </pre>
    );
  }

  if (["string", "number", "boolean"].includes(type)) {
    let richImage = null;
    let media = null;

    if (type === "string" && isImg(value)) {
      richImage = <button onClick={() => setShowMedia(!showMedia)}>🖼</button>;
      media = showMedia ? (
        <img alt="auto generated" src={value} width="200" />
      ) : null;
    }

    return (
      <Fragment>
        <pre>
          <PrimitiveLabel />
          {value}
          {richImage}
        </pre>
        {media}
      </Fragment>
    );
  }

  if (type === "object" || type === "array") {
    if (isCollapsed) {
      return (
        <div className="object">
          <button className="collapse" onClick={() => setIsCollapsed(false)}>
            ☞
          </button>
          <span className="primitive">[{type}]</span>
        </div>
      );
    } else {
      return (
        <div className="object">
          <button className="collapse" onClick={() => setIsCollapsed(true)}>
            ☟
          </button>
          <span className="primitive">[{type}]</span>
          <div className="bracket">{type === "object" ? "{" : "["}</div>
          <table>
            <tbody>
              {value.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{ display: "flex", alignItems: "center" }}>
                      {type === "object" ? (
                        <ReplOutput
                          response={response}
                          heapIndex={item[0]}
                          uncollapseLevel={uncollapseLevel - 1}
                        />
                      ) : (
                        index
                      )}
                      <span className="colon">:</span>
                    </td>
                    <td>
                      <ReplOutput
                        response={response}
                        heapIndex={type === "object" ? item[1] : item}
                        uncollapseLevel={uncollapseLevel - 1}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="bracket">{type === "object" ? "}" : "]"}</div>
        </div>
      );
    }
  }

  return <pre>{JSON.stringify(response, null, 2)}</pre>;
}

export default ReplOutput;
