import React, { Component } from "react";
import SimpleMDEReact from "react-simplemde-editor";

class MDE extends Component {

  render() {
    const { options, delay, id, value, ...rest } = this.props;
    return (
      <SimpleMDEReact
        {...rest}
        id={id}
        value={value}
        options={{
          toolbar: [
             "heading-1", "heading-2", "heading-3", "|",
             "bold", "italic", "|",
             "ordered-list", "unordered-list", "|",
             "image", "table", "quote", "code", "|",
             "preview", "fullscreen", "side-by-side", "|", "guide" ],
   	      placeholder: "Type here... Or copy and paste your notes from another editor...",
          ...options
        }}
      />
    );
  }
}

export default MDE;
