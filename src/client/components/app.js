import "./app.scss";

import React, { Component } from "react";

class AppContainer extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){
        console.log("will mount...");
    }

    render(){
        return (
            <section>
                <h1>Hello World</h1>
                <button
                    onClick={this.handleClick}
                >Click me...</button>
            </section>
        );
    }

    handleClick(){
        console.log("hello there from a button");
    }
}

export default AppContainer;