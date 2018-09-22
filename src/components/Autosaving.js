import React, { Component } from "react";
import SimpleMDEReact from "react-simplemde-editor";

class Autosaving extends Component {
  defaultProps = {
    delay: 100,
    value: ''
  }

  state = {
    value: localStorage.getItem(`smde_${this.props.id}`) || this.props.value
  };

  render() {
    const { options, delay, id, ...rest } = this.props;
    return (
      <SimpleMDEReact
        {...rest}
        id={id}
        value={this.state.value}
        options={{
          autosave: {
            enabled: true,
            uniqueId: id,
            delay
          },
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

export default Autosaving;
