import React, {Component} from "react";

import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Collapse
} from "shards-react";

import "./NavBar.css";

class NavBar extends Component{
    constructor(props){
        super(props);

        this.state={
            dropdownOpen:false,
            collapseOpen:false
        };
    }

    toggleDropdown(){
        this.setState({
            ...this.state,
            ...{
                dropdownOpen: !this.state.dropdownOpen
            }
        });
    }
    toggleNavbar(){
        this.setState({
            ...this.state,
            ...{
                collapseOpen: !this.state.collapseOpen
            }
        });
    }

    render(){

        return(
            <Navbar id={"appNavBar"} type="dark" expand="md">
                <NavbarBrand href="/">
                    <img id={"logoNavBar"} /> <b>Certif<span>Y</span></b>
                </NavbarBrand>
                <NavbarToggler onClick={()=>this.toggleNavbar()} />

                <Collapse open={this.state.collapseOpen} navbar>
                    <Nav navbar>

                    </Nav>
                    <Nav navbar className="ml-auto">
                    {    <NavItem>
                        <button type="button" ><a href="/">View Certificates</a></button>
                         </NavItem>
                    }
                    <NavItem>
                        <button type="button" ><a href="http://20.121.38.215:3000/about">Verification Portal</a></button>
                    </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}

export default NavBar;