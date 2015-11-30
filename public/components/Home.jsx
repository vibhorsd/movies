import React from "react";
import {connect} from 'react-redux';
import {getData} from "../actions";

class Home extends React.Component {
    handleClick() {
        this.props.getData();
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>Click me</button>
                {this.props.data?("got data " + this.props.data):(this.props.pending?"getting data...":null)}
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
        getData: () => dispatch(getData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
