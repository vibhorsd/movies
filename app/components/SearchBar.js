/**
 * Created by pushanmitra on 18/11/15.
 */
import React from "react";
import  Search from  "react-search-bar";
import InlineCss from "react-inline-css";
import SearchMovieAction from "../actions/SearchMovieAction"

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {suggestions: props.suggestions};
    }
    render (){
        return (<InlineCss
            stylesheet="
                .search-bar-suggestions {
                    background-color: #b0c4de;
                }
                .search-bar-input {
                    margin-left: 10px;
                    margin-top: 10px;
                    height: 18px;
                    width: 250px;
                    box-sizing:border-box;
                    border-radius:5px
                }
                .search-bar-submit {
                    margin-left: 6px;
                    height: auto;
                }
                ">
            <Search
                    placeholder="search Movie title on page"
                    onChange={this._onChange.bind(this)}
                    onSubmit={this._onSubmit.bind(this)}>
            </Search>
            </InlineCss>)
    }
    _onChange (input, resolve){
        var suggestions = this.props.suggestions;
        setTimeout(() => {
            resolve(suggestions.filter((suggestion) =>
                suggestion.match(new RegExp('^' + input.replace(/\W\s/g, ''), 'i'))
            ));
        }, 25);
    }
    _onSubmit(input){
        if (!input) return;
        console.info(`Searching "${input}"`);
        SearchMovieAction.search(input);
    }
}