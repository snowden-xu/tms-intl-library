import React , { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import Home from './pages/home';

class App extends Component {
    render() {
        return (
           <Home/>
        );
    }
}

export default hot(App);
