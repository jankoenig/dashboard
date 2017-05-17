import * as React from "react";
import "../../themes/audio";

export interface AudioProps {
  style?: React.CSSProperties;
  src?: string;
};

export default class AudioComponent extends React.Component<AudioProps, any> {

  styles() {
    return { ...{ display: "inline-block" }, ...this.props.style };
  }

  render() {
    return (
      <div className="container" style={this.styles()}>
        <audio controls>
          <source src={this.props.src} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        {this.props.children}
      </div>
    );
  }
}
