import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import {connect} from "react-redux";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }
    changeName = (event) => {
        this.setState({
            name: event.target.value
        })
    }
    render() {
        const {isLogin,loading, location, loginSuccess, login, error} = this.props
        console.log('loginPage', this.props)
        const {name} = this.state
        if(isLogin) {
            const {redirect = '/'} = location.state || {}
            return <Redirect to={redirect} />
        }
        return (
            <div>
                <h1>loginPage</h1>
                <input type="text" value={name} onChange={this.changeName}/>
                <button onClick={() => login(name)}>{loading ? '登录中': '登录'}</button>
                {
                    error && (<p>{error}</p>) // 有错误信息则显示
                }
            </div>
        );
    }
}
const mapStateToprops = state => {
    return {
        isLogin: state.user.isLogin,
        loading: state.user.loading,
        error: state.user.error
    }
}
const mapDispatchToProps = { // 方法映射到props上
    // loginSuccess: () => {
    //     return {type: 'requestSuccess'}
    // },
    // loginSuccess: () => dispatch => {
    //     dispatch({type: 'requestLogin'})
    //     setTimeout(() => {
    //         dispatch({type: 'requestSuccess'})
    //     }, 2000)
    // },
    login : (name) => { // 这里会接收到调用login方法传得得参数
        return ({type: 'login', name})
    }
}
export default connect(mapStateToprops, mapDispatchToProps)(LoginPage)