import React, {Component} from 'react';
import {BrowserRouter, Link, Route, Switch }from 'react-router-dom'
import LoginPage from './loginPage'
import UserPage from './userPage'
import PrivatePage from "./PrivatePage";
class RoutePage extends Component {
    render() {
        return (
            <div>
                <h1>RoutePage</h1>
                <BrowserRouter>
                    <Link to={'/user'}>用户中心</Link>
                    <Link to={'/login'}>登陆</Link>
                    {/*<Route path={'/user'} component={UserPage}></Route>*/}
                    <Switch>
                        <PrivatePage path={'/user'} component={UserPage}></PrivatePage>
                        <Route path={'/login'} component={LoginPage}></Route>
                    </Switch>

                </BrowserRouter>
            </div>
        );
    }
}

export default RoutePage;