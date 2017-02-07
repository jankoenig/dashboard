import * as React from "react";


interface GoogleHomeProps {
    style?: React.CSSProperties;
    width?: string;
    height?: string;
    color?: string;
}

export default class GoogleHome extends React.Component<GoogleHomeProps, any> {

    static defaultProps: GoogleHomeProps = {
        style: undefined,
        width: "58px",
        height: "88px",
        color: "#0000000"
    };

    // tslint:disable
    render() {
        return (
            <svg style={this.props.style} width={this.props.width} height={this.props.height} viewBox="21 6 58 88" preserveAspectRatio="xMidYMin" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="noun_679288" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(21.000000, 6.000000)">
                    <path d="M28.54,54.222 C18,54.222 9.888,53.715 5.081,52.757 C1.502,52.043 0.806,51.291 0.678,51.078 C0.628,50.997 0.605,50.901 0.611,50.805 C1.211,40.722 2.141,27.995 2.82,18.701 C3.232,13.065 3.347,13.678 3.419,12.256 C3.432,11.994 3.651,11.791 3.918,11.805 C4.18,11.818 4.381,12.041 4.369,12.303 C4.297,13.736 4.196,12.907 3.768,18.771 C3.095,27.993 2.173,40.598 1.573,50.639 C1.871,50.852 2.894,51.406 5.959,51.955 C10.836,52.829 18.435,53.272 28.541,53.272 C38.701,53.272 46.362,52.823 51.314,51.94 C54.378,51.396 55.442,50.845 55.762,50.627 C55.161,40.59 54.241,27.992 53.567,18.774 C53.137,12.909 52.648,6.831 52.576,5.398 C52.564,5.136 52.765,4.913 53.027,4.9 C53.292,4.885 53.51,5.088 53.525,5.35 C53.595,6.773 54.102,13.066 54.515,18.704 C55.194,27.996 56.123,40.723 56.723,50.805 C56.729,50.909 56.7,51.015 56.642,51.102 C56.42,51.422 53.767,54.222 28.54,54.222 Z" id="Shape" fill={this.props.color} fillRule="nonzero"></path>
                    <g id="Group" transform="translate(5.000000, 80.000000)" fillRule="nonzero" fill={this.props.color}>
                        <path d="M23.668,6.678 C34.508,6.678 40.91,5.914 43.293,3.791 C43.767,3.371 44.758,2.366 45.906,0.872 C45.906,0.872 41.583,3.438 23.667,3.438 L23.667,3.438 C5.751,3.438 1.43,0.872 1.43,0.872 C2.576,2.366 3.569,3.371 4.041,3.791 C6.424,5.914 12.828,6.678 23.668,6.678 L23.668,6.678 Z" id="Shape"></path>
                        <path d="M23.668,7.152 C12.057,7.152 6.093,6.255 3.726,4.146 C3.145,3.628 2.138,2.573 1.053,1.16 C0.915,0.979 0.924,0.726 1.075,0.555 C1.226,0.386 1.477,0.348 1.672,0.463 C1.713,0.487 6.208,2.964 23.668,2.964 C41.13,2.964 45.624,0.487 45.666,0.461 C45.863,0.348 46.113,0.389 46.262,0.559 C46.411,0.73 46.421,0.98 46.283,1.161 C45.2,2.574 44.192,3.63 43.612,4.147 C41.242,6.255 35.279,7.152 23.668,7.152 Z M2.922,1.948 C3.691,2.829 4.225,3.319 4.357,3.438 C6.505,5.35 12.461,6.203 23.667,6.203 L23.668,6.203 C34.874,6.203 40.828,5.35 42.979,3.438 C43.11,3.319 43.644,2.829 44.414,1.948 C41.823,2.73 35.881,3.913 23.668,3.913 C11.456,3.913 5.514,2.73 2.922,1.948 Z" id="Shape"></path>
                    </g>
                    <path d="M28.457,16.109 C21.853,17.063 15.64,17.246 10.961,16.625 C4.727,15.798 3.418,13.893 3.418,12.441 C3.418,10.989 4.728,8.707 10.961,6.077 C15.64,4.103 21.854,2.491 28.457,1.536 C35.06,0.582 41.272,0.398 45.954,1.019 C52.187,1.847 53.495,3.751 53.495,5.203 C53.495,6.655 52.187,8.938 45.954,11.568 C41.272,13.541 35.06,15.154 28.457,16.109 Z M28.457,2.485 C14.048,4.568 4.368,9.243 4.368,12.303 C4.368,15.364 14.048,17.241 28.457,15.159 C42.866,13.076 52.546,8.401 52.546,5.34 C52.546,2.28 42.866,0.402 28.457,2.485 Z" id="Shape" fill={this.props.color} fillRule="nonzero"></path>
                    <path d="M28.671,83.913 L28.671,83.913 L28.667,83.913 C10.825,83.913 6.367,81.388 6.187,81.28 C6.135,81.248 6.089,81.207 6.053,81.16 C3.8,78.224 0.02,72.159 0.02,64.507 C0.02,62.002 0.219,57.391 0.611,50.805 C0.624,50.58 0.774,50.357 0.996,50.325 C1.211,50.293 1.402,50.375 1.484,50.569 C1.766,50.838 4.99,53.273 28.541,53.273 C52.302,53.273 55.597,50.796 55.867,50.549 C55.964,50.365 56.153,50.295 56.359,50.336 C56.572,50.377 56.712,50.589 56.723,50.805 C57.117,57.393 57.315,62.002 57.315,64.507 C57.315,72.159 53.536,78.225 51.282,81.16 C51.246,81.207 51.201,81.248 51.148,81.28 C50.967,81.388 46.51,83.913 28.671,83.913 L28.671,83.913 Z M6.742,80.499 C7.373,80.808 12.378,82.964 28.667,82.964 C37.78,82.964 43.273,82.285 46.274,81.716 C49.079,81.184 50.296,80.645 50.59,80.499 C52.778,77.63 56.363,71.807 56.363,64.507 C56.363,62.124 56.181,57.808 55.822,51.67 C53.931,52.582 47.844,54.222 28.539,54.222 C9.433,54.222 3.398,52.605 1.509,51.679 C1.15,57.811 0.968,62.124 0.968,64.507 C0.969,71.807 4.556,77.63 6.742,80.499 Z" id="Shape" fill={this.props.color} fillRule="nonzero"></path>
                    <g id="Group" transform="translate(0.000000, 51.000000)" fillRule="nonzero" fill={this.props.color}>
                        <circle id="Oval" cx="55.395" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="53.859" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="52.324" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="50.789" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="49.257" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="47.722" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="46.187" cy="18.208" r="0.511"></circle>
                        <path d="M44.651,18.719 C44.934,18.719 45.164,18.489 45.164,18.206 C45.164,17.923 44.935,17.696 44.651,17.696 C44.371,17.696 44.141,17.923 44.141,18.206 C44.142,18.488 44.371,18.719 44.651,18.719 Z" id="Shape"></path>
                        <circle id="Oval" cx="43.119" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="41.584" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="40.049" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="38.515" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="36.982" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="35.447" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="33.912" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="32.377" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="30.845" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="56.16" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="54.627" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="51.557" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="16.808" r="0.513"></circle>
                        <circle id="Oval" cx="48.49" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="46.955" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="45.419" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="16.808" r="0.513"></circle>
                        <circle id="Oval" cx="42.352" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="40.817" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="39.282" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="16.808" r="0.513"></circle>
                        <circle id="Oval" cx="36.214" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="34.679" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="33.144" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="31.611" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="30.076" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="55.395" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="53.859" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="52.324" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="50.789" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="49.257" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="47.722" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="46.187" cy="21.071" r="0.511"></circle>
                        <path d="M44.651,21.582 C44.934,21.582 45.164,21.352 45.164,21.069 C45.164,20.788 44.935,20.559 44.651,20.559 C44.371,20.559 44.141,20.788 44.141,21.069 C44.142,21.352 44.371,21.582 44.651,21.582 Z" id="Shape"></path>
                        <circle id="Oval" cx="43.119" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="41.584" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="40.049" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="38.515" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="36.982" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="35.447" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="33.912" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="32.377" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="30.845" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="54.627" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="51.557" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="19.673" r="0.513"></circle>
                        <circle id="Oval" cx="48.49" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="46.955" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="45.419" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="19.673" r="0.513"></circle>
                        <circle id="Oval" cx="42.352" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="40.817" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="39.282" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="19.673" r="0.513"></circle>
                        <circle id="Oval" cx="36.214" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="34.679" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="33.144" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="31.611" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="30.076" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="53.859" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="52.324" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="50.789" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="49.257" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="47.722" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="46.187" cy="23.934" r="0.511"></circle>
                        <path d="M44.651,24.445 C44.934,24.445 45.164,24.217 45.164,23.935 C45.164,23.653 44.935,23.422 44.651,23.422 C44.371,23.422 44.141,23.652 44.141,23.935 C44.141,24.218 44.371,24.445 44.651,24.445 Z" id="Shape"></path>
                        <circle id="Oval" cx="43.119" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="41.584" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="40.049" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="38.515" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="36.982" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="35.447" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="33.912" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="32.377" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="30.845" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="54.627" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="51.557" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="22.537" r="0.513"></circle>
                        <circle id="Oval" cx="48.49" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="46.955" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="45.419" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="22.537" r="0.513"></circle>
                        <circle id="Oval" cx="42.352" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="40.817" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="39.282" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="22.537" r="0.513"></circle>
                        <circle id="Oval" cx="36.214" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="34.679" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="33.144" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="31.611" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="30.076" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="52.324" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="50.789" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="49.257" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="47.722" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="46.187" cy="26.798" r="0.512"></circle>
                        <path d="M44.651,27.311 C44.934,27.311 45.164,27.082 45.164,26.799 C45.164,26.516 44.935,26.286 44.651,26.286 C44.371,26.286 44.141,26.516 44.141,26.799 C44.141,27.082 44.371,27.311 44.651,27.311 Z" id="Shape"></path>
                        <circle id="Oval" cx="43.119" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="41.584" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="40.049" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="38.515" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="36.982" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="35.447" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="33.912" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="32.377" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="30.845" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="29.309" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="53.092" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="51.557" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="25.4" r="0.513"></circle>
                        <circle id="Oval" cx="48.49" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="46.955" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="45.419" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="25.4" r="0.513"></circle>
                        <circle id="Oval" cx="42.352" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="40.817" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="39.282" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="25.4" r="0.513"></circle>
                        <circle id="Oval" cx="36.214" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="34.679" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="33.144" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="31.611" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="30.076" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="50.789" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="49.257" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="47.722" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="46.187" cy="29.664" r="0.511"></circle>
                        <path d="M44.651,30.175 C44.934,30.175 45.164,29.946 45.164,29.662 C45.164,29.38 44.935,29.152 44.651,29.152 C44.371,29.152 44.141,29.38 44.141,29.662 C44.142,29.945 44.371,30.175 44.651,30.175 Z" id="Shape"></path>
                        <circle id="Oval" cx="43.119" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="41.584" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="40.049" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="38.515" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="36.982" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="35.447" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="33.912" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="32.377" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="30.845" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="51.557" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="28.264" r="0.513"></circle>
                        <circle id="Oval" cx="48.49" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="46.955" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="45.419" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="28.264" r="0.513"></circle>
                        <circle id="Oval" cx="42.352" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="40.817" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="39.282" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="28.264" r="0.513"></circle>
                        <circle id="Oval" cx="36.214" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="34.679" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="33.144" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="31.611" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="30.076" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="28.264" r="0.511"></circle>
                        <path d="M47.466,31.131 C47.466,30.847 47.237,30.618 46.954,30.618 C46.672,30.618 46.443,30.847 46.443,31.131 C46.443,31.411 46.672,31.641 46.954,31.641 C47.237,31.641 47.466,31.411 47.466,31.131 Z" id="Shape"></path>
                        <path d="M45.931,31.131 C45.931,30.847 45.703,30.618 45.421,30.618 C45.138,30.618 44.908,30.847 44.908,31.131 C44.908,31.411 45.137,31.641 45.421,31.641 C45.703,31.641 45.931,31.411 45.931,31.131 Z" id="Shape"></path>
                        <path d="M44.398,31.131 C44.398,30.847 44.168,30.618 43.885,30.618 C43.602,30.618 43.372,30.847 43.372,31.131 C43.372,31.411 43.602,31.641 43.885,31.641 C44.168,31.641 44.398,31.411 44.398,31.131 Z" id="Shape"></path>
                        <path d="M42.863,31.131 C42.863,30.847 42.633,30.618 42.35,30.618 C42.067,30.618 41.84,30.847 41.84,31.131 C41.84,31.411 42.068,31.641 42.35,31.641 C42.632,31.641 42.863,31.411 42.863,31.131 Z" id="Shape"></path>
                        <path d="M41.328,31.131 C41.328,30.847 41.099,30.618 40.818,30.618 C40.534,30.618 40.305,30.847 40.305,31.131 C40.305,31.411 40.534,31.641 40.818,31.641 C41.1,31.641 41.328,31.411 41.328,31.131 Z" id="Shape"></path>
                        <path d="M39.793,31.131 C39.793,30.847 39.565,30.618 39.283,30.618 C39.001,30.618 38.77,30.847 38.77,31.131 C38.77,31.411 39,31.641 39.283,31.641 C39.566,31.641 39.793,31.411 39.793,31.131 Z" id="Shape"></path>
                        <path d="M38.261,31.131 C38.261,30.847 38.031,30.618 37.748,30.618 C37.465,30.618 37.235,30.847 37.235,31.131 C37.235,31.411 37.465,31.641 37.748,31.641 C38.031,31.641 38.261,31.411 38.261,31.131 Z" id="Shape"></path>
                        <path d="M36.726,31.131 C36.726,30.847 36.496,30.618 36.213,30.618 C35.93,30.618 35.703,30.847 35.703,31.131 C35.703,31.411 35.931,31.641 36.213,31.641 C36.495,31.641 36.726,31.411 36.726,31.131 Z" id="Shape"></path>
                        <path d="M35.19,31.131 C35.19,30.847 34.961,30.618 34.679,30.618 C34.398,30.618 34.167,30.847 34.167,31.131 C34.167,31.411 34.397,31.641 34.679,31.641 C34.962,31.641 35.19,31.411 35.19,31.131 Z" id="Shape"></path>
                        <path d="M33.655,31.131 C33.655,30.847 33.427,30.618 33.145,30.618 C32.863,30.618 32.632,30.847 32.632,31.131 C32.632,31.411 32.862,31.641 33.145,31.641 C33.428,31.641 33.655,31.411 33.655,31.131 Z" id="Shape"></path>
                        <path d="M32.123,31.131 C32.123,30.847 31.893,30.618 31.61,30.618 C31.327,30.618 31.1,30.847 31.1,31.131 C31.1,31.411 31.329,31.641 31.611,31.641 C31.893,31.641 32.123,31.411 32.123,31.131 Z" id="Shape"></path>
                        <path d="M30.587,31.131 C30.587,30.847 30.358,30.618 30.076,30.618 C29.793,30.618 29.565,30.847 29.565,31.131 C29.565,31.411 29.794,31.641 30.076,31.641 C30.358,31.641 30.587,31.411 30.587,31.131 Z" id="Shape"></path>
                        <path d="M29.053,31.131 C29.053,30.847 28.824,30.618 28.542,30.618 C28.26,30.618 28.031,30.847 28.031,31.131 C28.031,31.411 28.26,31.641 28.542,31.641 C28.824,31.641 29.053,31.411 29.053,31.131 Z" id="Shape"></path>
                        <circle id="Oval" cx="27.775" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="18.568" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="17.034" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="13.965" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="6.293" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="4.759" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="1.69" cy="18.208" r="0.511"></circle>
                        <circle id="Oval" cx="27.008" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="25.473" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="22.404" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="20.87" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="19.335" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="14.733" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="11.664" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="8.595" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="5.526" cy="16.808" r="0.512"></circle>
                        <circle id="Oval" cx="3.992" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="0.923" cy="16.808" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="18.568" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="17.034" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="13.965" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="6.293" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="4.759" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="21.071" r="0.511"></circle>
                        <circle id="Oval" cx="27.008" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="25.473" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="22.404" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="20.87" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="19.335" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="14.733" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="11.664" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="8.595" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="5.526" cy="19.673" r="0.512"></circle>
                        <circle id="Oval" cx="3.992" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="19.673" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="18.568" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="17.034" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="13.965" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="6.293" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="4.759" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="23.934" r="0.511"></circle>
                        <circle id="Oval" cx="27.008" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="25.473" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="22.404" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="20.87" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="19.335" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="14.733" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="11.664" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="8.595" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="5.526" cy="22.537" r="0.512"></circle>
                        <circle id="Oval" cx="3.992" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="22.537" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="26.241" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="24.706" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="23.172" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="21.637" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="20.103" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="18.568" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="17.034" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="15.5" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="13.965" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="12.431" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="10.896" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="9.362" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="7.828" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="6.293" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="4.759" cy="26.798" r="0.512"></circle>
                        <circle id="Oval" cx="27.008" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="25.473" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="22.404" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="20.87" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="19.335" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="14.733" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="11.664" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="8.595" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="5.526" cy="25.4" r="0.512"></circle>
                        <circle id="Oval" cx="3.992" cy="25.4" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="18.568" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="17.034" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="13.965" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="29.664" r="0.511"></circle>
                        <circle id="Oval" cx="27.008" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="25.473" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="22.404" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="20.87" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="19.335" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="14.733" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="11.664" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="28.264" r="0.512"></circle>
                        <circle id="Oval" cx="8.595" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="28.264" r="0.511"></circle>
                        <circle id="Oval" cx="5.526" cy="28.264" r="0.512"></circle>
                        <path d="M27.52,31.131 C27.52,30.847 27.291,30.618 27.008,30.618 C26.726,30.618 26.497,30.847 26.497,31.131 C26.497,31.411 26.726,31.641 27.008,31.641 C27.29,31.641 27.52,31.411 27.52,31.131 Z" id="Shape"></path>
                        <path d="M25.984,31.131 C25.984,30.847 25.755,30.618 25.473,30.618 C25.19,30.618 24.962,30.847 24.962,31.131 C24.962,31.411 25.191,31.641 25.473,31.641 C25.755,31.641 25.984,31.411 25.984,31.131 Z" id="Shape"></path>
                        <path d="M24.451,31.131 C24.451,30.847 24.222,30.618 23.94,30.618 C23.657,30.618 23.428,30.847 23.428,31.131 C23.428,31.411 23.657,31.641 23.94,31.641 C24.221,31.641 24.451,31.411 24.451,31.131 Z" id="Shape"></path>
                        <path d="M22.916,31.131 C22.916,30.847 22.687,30.618 22.405,30.618 C22.122,30.618 21.894,30.847 21.894,31.131 C21.894,31.411 22.123,31.641 22.405,31.641 C22.687,31.641 22.916,31.411 22.916,31.131 Z" id="Shape"></path>
                        <path d="M21.382,31.131 C21.382,30.847 21.153,30.618 20.871,30.618 C20.588,30.618 20.359,30.847 20.359,31.131 C20.359,31.411 20.588,31.641 20.871,31.641 C21.152,31.641 21.382,31.411 21.382,31.131 Z" id="Shape"></path>
                        <path d="M19.847,31.131 C19.847,30.847 19.618,30.618 19.336,30.618 C19.054,30.618 18.825,30.847 18.825,31.131 C18.825,31.411 19.054,31.641 19.336,31.641 C19.618,31.641 19.847,31.411 19.847,31.131 Z" id="Shape"></path>
                        <path d="M18.313,31.131 C18.313,30.847 18.084,30.618 17.802,30.618 C17.519,30.618 17.29,30.847 17.29,31.131 C17.29,31.411 17.519,31.641 17.802,31.641 C18.083,31.641 18.313,31.411 18.313,31.131 Z" id="Shape"></path>
                        <path d="M16.779,31.131 C16.779,30.847 16.55,30.618 16.267,30.618 C15.984,30.618 15.756,30.847 15.756,31.131 C15.756,31.411 15.985,31.641 16.267,31.641 C16.549,31.641 16.779,31.411 16.779,31.131 Z" id="Shape"></path>
                        <path d="M15.244,31.131 C15.244,30.847 15.015,30.618 14.733,30.618 C14.451,30.618 14.221,30.847 14.221,31.131 C14.221,31.411 14.45,31.641 14.733,31.641 C15.016,31.641 15.244,31.411 15.244,31.131 Z" id="Shape"></path>
                        <path d="M13.71,31.131 C13.71,30.847 13.481,30.618 13.198,30.618 C12.916,30.618 12.687,30.847 12.687,31.131 C12.687,31.411 12.916,31.641 13.198,31.641 C13.48,31.641 13.71,31.411 13.71,31.131 Z" id="Shape"></path>
                        <path d="M12.175,31.131 C12.175,30.847 11.946,30.618 11.664,30.618 C11.382,30.618 11.152,30.847 11.152,31.131 C11.152,31.411 11.381,31.641 11.664,31.641 C11.947,31.641 12.175,31.411 12.175,31.131 Z" id="Shape"></path>
                        <path d="M10.641,31.131 C10.641,30.847 10.412,30.618 10.129,30.618 C9.847,30.618 9.618,30.847 9.618,31.131 C9.618,31.411 9.847,31.641 10.129,31.641 C10.412,31.641 10.641,31.411 10.641,31.131 Z" id="Shape"></path>
                        <circle id="Oval" cx="55.393" cy="1.09" r="0.511"></circle>
                        <circle id="Oval" cx="53.858" cy="1.09" r="0.511"></circle>
                        <circle id="Oval" cx="55.393" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="53.858" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="52.325" cy="3.953" r="0.512"></circle>
                        <circle id="Oval" cx="50.791" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="49.255" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="47.72" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="46.188" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="44.653" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="43.118" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="41.583" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="40.05" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="38.516" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="36.981" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="35.446" cy="3.953" r="0.512"></circle>
                        <circle id="Oval" cx="33.914" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="32.378" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="30.843" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="56.161" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="54.626" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="51.559" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="48.488" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="46.954" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="45.421" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="42.351" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="40.818" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="55.393" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="53.858" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="52.325" cy="6.819" r="0.512"></circle>
                        <circle id="Oval" cx="50.791" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="49.255" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="47.72" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="46.188" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="44.653" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="43.118" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="41.583" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="40.05" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="38.516" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="36.981" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="35.446" cy="6.819" r="0.512"></circle>
                        <circle id="Oval" cx="33.914" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="32.378" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="30.843" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="56.161" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="54.626" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="51.559" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="48.488" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="46.954" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="45.421" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="42.351" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="40.818" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="39.283" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="36.213" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="34.68" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="33.146" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="31.61" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="30.076" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="55.393" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="53.858" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="52.325" cy="9.683" r="0.512"></circle>
                        <circle id="Oval" cx="50.791" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="49.255" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="47.72" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="46.188" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="44.653" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="43.118" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="41.583" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="40.05" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="38.516" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="36.981" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="35.446" cy="9.683" r="0.512"></circle>
                        <circle id="Oval" cx="33.914" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="32.378" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="30.843" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="56.161" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="54.626" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="53.092" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="51.559" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="50.023" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="48.488" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="46.954" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="45.421" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="43.886" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="42.351" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="40.818" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="39.283" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="37.748" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="36.213" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="34.68" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="33.146" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="31.61" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="30.076" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="28.542" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="55.393" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="53.858" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="52.325" cy="12.546" r="0.512"></circle>
                        <circle id="Oval" cx="50.791" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="49.255" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="47.72" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="46.188" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="44.653" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="43.118" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="41.583" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="40.05" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="38.516" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="36.981" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="35.446" cy="12.546" r="0.512"></circle>
                        <circle id="Oval" cx="33.914" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="32.378" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="30.843" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="56.161" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="54.626" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="51.559" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="48.488" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="46.954" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="45.421" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="42.351" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="40.818" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="39.283" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="36.213" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="34.68" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="33.146" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="31.61" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="30.076" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="55.393" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="53.858" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="52.325" cy="15.409" r="0.512"></circle>
                        <circle id="Oval" cx="50.791" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="49.255" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="47.72" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="46.188" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="44.653" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="43.118" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="41.583" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="40.05" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="38.516" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="36.981" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="35.446" cy="15.409" r="0.512"></circle>
                        <circle id="Oval" cx="33.914" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="32.378" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="30.843" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="29.309" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="56.161" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="54.626" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="53.092" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="51.559" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="50.023" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="48.488" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="46.954" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="45.421" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="43.886" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="42.351" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="40.818" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="39.283" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="37.748" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="36.213" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="34.68" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="33.146" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="31.61" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="30.076" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="28.542" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="1.09" r="0.512"></circle>
                        <circle id="Oval" cx="1.69" cy="1.09" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="18.569" cy="3.953" r="0.512"></circle>
                        <circle id="Oval" cx="17.034" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="3.953" r="0.512"></circle>
                        <circle id="Oval" cx="13.965" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="6.294" cy="3.953" r="0.512"></circle>
                        <circle id="Oval" cx="4.759" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="3.953" r="0.512"></circle>
                        <circle id="Oval" cx="1.69" cy="3.953" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="14.733" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="11.664" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="8.595" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="5.527" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="3.992" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="2.556" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="18.569" cy="6.819" r="0.512"></circle>
                        <circle id="Oval" cx="17.034" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="6.819" r="0.512"></circle>
                        <circle id="Oval" cx="13.965" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="6.294" cy="6.819" r="0.512"></circle>
                        <circle id="Oval" cx="4.759" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="6.819" r="0.512"></circle>
                        <circle id="Oval" cx="1.69" cy="6.819" r="0.511"></circle>
                        <circle id="Oval" cx="27.007" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="25.473" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="22.404" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="20.871" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="19.335" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="14.733" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="11.664" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="8.595" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="5.527" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="3.992" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="0.923" cy="5.419" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="18.569" cy="9.683" r="0.512"></circle>
                        <circle id="Oval" cx="17.034" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="9.683" r="0.512"></circle>
                        <circle id="Oval" cx="13.965" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="6.294" cy="9.683" r="0.512"></circle>
                        <circle id="Oval" cx="4.759" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="9.683" r="0.512"></circle>
                        <circle id="Oval" cx="1.69" cy="9.683" r="0.511"></circle>
                        <circle id="Oval" cx="27.007" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="25.473" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="23.939" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="22.404" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="20.871" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="19.335" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="17.802" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="16.267" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="14.733" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="13.198" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="11.664" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="10.129" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="8.595" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="7.061" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="5.527" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="3.992" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="2.458" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="0.923" cy="8.284" r="0.512"></circle>
                        <circle id="Oval" cx="27.775" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="18.569" cy="12.546" r="0.512"></circle>
                        <circle id="Oval" cx="17.034" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="12.546" r="0.512"></circle>
                        <circle id="Oval" cx="13.965" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="6.294" cy="12.546" r="0.512"></circle>
                        <circle id="Oval" cx="4.759" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="12.546" r="0.512"></circle>
                        <circle id="Oval" cx="1.69" cy="12.546" r="0.511"></circle>
                        <circle id="Oval" cx="27.007" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="25.473" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="22.404" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="20.871" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="19.335" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="14.733" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="11.664" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="8.595" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="5.527" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="3.992" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="0.923" cy="11.149" r="0.511"></circle>
                        <circle id="Oval" cx="27.775" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="26.241" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="24.706" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="23.172" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="21.637" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="20.103" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="18.569" cy="15.409" r="0.512"></circle>
                        <circle id="Oval" cx="17.034" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="15.5" cy="15.409" r="0.512"></circle>
                        <circle id="Oval" cx="13.965" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="12.431" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="10.896" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="9.362" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="7.828" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="6.294" cy="15.409" r="0.512"></circle>
                        <circle id="Oval" cx="4.759" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="3.225" cy="15.409" r="0.512"></circle>
                        <circle id="Oval" cx="1.69" cy="15.409" r="0.511"></circle>
                        <circle id="Oval" cx="27.007" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="25.473" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="23.939" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="22.404" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="20.871" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="19.335" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="17.802" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="16.267" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="14.733" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="13.198" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="11.664" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="10.129" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="8.595" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="7.061" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="5.527" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="3.992" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="2.458" cy="14.012" r="0.511"></circle>
                        <circle id="Oval" cx="0.923" cy="14.012" r="0.511"></circle>
                    </g>
                    <g id="Group" transform="translate(20.000000, 8.000000)" fillRule="nonzero" fill={this.props.color}>
                        <ellipse id="Oval" transform="translate(2.110042, 0.892826) rotate(-8.852886) translate(-2.110042, -0.892826) " cx="2.1100424" cy="0.702823052" rx="1.49101999" ry="0.310004157"></ellipse>
                        <path d="M1.238,1.275 L1.238,1.275 C0.708,1.275 0.456,1.179 0.422,0.964 C0.354,0.52 1.505,0.292 2.004,0.214 C2.333,0.163 2.651,0.135 2.923,0.135 C3.453,0.135 3.705,0.231 3.738,0.447 C3.806,0.89 2.655,1.118 2.156,1.197 C1.827,1.248 1.508,1.275 1.238,1.275 Z M0.925,0.885 C0.997,0.895 1.098,0.903 1.237,0.903 L1.237,0.903 C1.489,0.903 1.787,0.878 2.098,0.829 C2.654,0.743 3.036,0.619 3.233,0.527 C3.029,0.499 2.541,0.509 2.059,0.584 C1.504,0.67 1.123,0.793 0.925,0.885 Z" id="Shape"></path>
                    </g>
                    <g id="Group" transform="translate(28.000000, 6.000000)" fillRule="nonzero" fill={this.props.color}>
                        <ellipse id="Oval" transform="translate(2.499169, 1.213327) rotate(-8.852886) translate(-2.499169, -1.213327) " cx="2.4991691" cy="1.02332415" rx="1.49202001" ry="0.310004157"></ellipse>
                        <path d="M1.627,1.597 L1.627,1.597 C1.097,1.597 0.845,1.501 0.811,1.286 C0.742,0.843 1.894,0.614 2.393,0.537 C2.722,0.486 3.04,0.458 3.312,0.458 C3.844,0.458 4.094,0.554 4.126,0.77 C4.196,1.213 3.044,1.441 2.546,1.52 C2.216,1.57 1.898,1.597 1.627,1.597 Z M1.314,1.207 C1.386,1.217 1.487,1.225 1.626,1.225 L1.626,1.225 C1.878,1.225 2.177,1.199 2.487,1.151 C3.044,1.064 3.425,0.941 3.623,0.849 C3.419,0.821 2.931,0.831 2.448,0.906 C1.894,0.992 1.511,1.115 1.314,1.207 Z" id="Shape"></path>
                    </g>
                    <g id="Group" transform="translate(23.000000, 9.000000)" fillRule="nonzero" fill={this.props.color}>
                        <ellipse id="Oval" transform="translate(2.339522, 1.260170) rotate(-8.841563) translate(-2.339522, -1.260170) " cx="2.3395222" cy="1.0701729" rx="1.49197411" ry="0.309994621"></ellipse>
                        <path d="M1.469,1.643 L1.469,1.643 C0.939,1.643 0.688,1.547 0.654,1.331 C0.585,0.888 1.737,0.66 2.236,0.581 C2.566,0.53 2.883,0.503 3.155,0.503 C3.686,0.503 3.937,0.599 3.971,0.814 C4.039,1.258 2.888,1.486 2.389,1.564 C2.058,1.615 1.74,1.643 1.469,1.643 Z M1.156,1.252 C1.229,1.261 1.329,1.27 1.468,1.27 L1.468,1.27 C1.72,1.27 2.018,1.244 2.329,1.195 C2.886,1.109 3.268,0.986 3.465,0.893 C3.259,0.865 2.773,0.874 2.291,0.95 C1.736,1.037 1.354,1.16 1.156,1.252 Z" id="Shape"></path>
                    </g>
                    <g id="Group" transform="translate(32.000000, 7.000000)" fillRule="nonzero" fill={this.props.color}>
                        <ellipse id="Oval" transform="translate(1.729213, 1.581662) rotate(-8.852886) translate(-1.729213, -1.581662) " cx="1.7292134" cy="1.39165985" rx="1.49101999" ry="0.310004157"></ellipse>
                        <path d="M0.857,1.965 L0.857,1.965 C0.327,1.965 0.076,1.869 0.042,1.653 C-0.025,1.209 1.125,0.982 1.623,0.903 C1.952,0.852 2.269,0.825 2.544,0.825 C3.074,0.825 3.324,0.921 3.359,1.136 C3.426,1.58 2.275,1.807 1.777,1.886 C1.447,1.937 1.128,1.965 0.857,1.965 Z M0.546,1.575 C0.618,1.584 0.719,1.592 0.858,1.592 L0.858,1.592 C1.111,1.592 1.409,1.566 1.72,1.518 C2.276,1.432 2.658,1.309 2.856,1.216 C2.652,1.188 2.163,1.198 1.682,1.273 C1.125,1.359 0.742,1.482 0.546,1.575 Z" id="Shape"></path>
                    </g>
                </g>
            </svg>
        );
    }
}
// tslint:enable