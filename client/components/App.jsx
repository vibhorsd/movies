import React from "react";
import {connect} from "react-redux";
import {getRemoteData} from "../actions";

class App extends React.Component {
    handleClick() {
        this.props.getRemoteData();
    }
    render() {
        return (
            <div>
                <button
                    onClick={this.handleClick.bind(this)}
                    style={{width: "100px", height: "50px"}}
                    >Get Data</button>
                <br></br>
                <h3>
                    {this.props.data?("got " + this.props.data):(this.props.pending?"getting data...":null)}
                </h3>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        pending: state.pending
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getRemoteData: () => dispatch(getRemoteData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
