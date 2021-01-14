import React, {Component} from 'react';
import {Redirect, Route }from 'react-router-dom'
import {connect} from "react-redux";
class PrivatePage extends Component {
    render() {
        const {isLogin, path, component} = this.props
        console.log('privateLogin',this.props);
        if(isLogin) {
            return <Route path={path} component={component}></Route>
        }
        return <Redirect to={{
            pathname: '/login',
            state:{redirect: path}
        }} />

    }
}
const mapStateToprops = state => {
    return {
        isLogin: state.user.isLogin
    }
}

export default connect(mapStateToprops)(PrivatePage)