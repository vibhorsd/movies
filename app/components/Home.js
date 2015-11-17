import React from "react";
import Tile from "./Tile";
import DetailedTile from "./DetailedTile";
import ComponentGallery from "react-component-gallery";
import {Paper, Dialog} from "material-ui";
/**
* Home page component
*/
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedKey: null};
    }
    handleClick(key) {
        this.setState({selectedKey: key});
        this.refs.movieDialog.setState({open: true});
    }
    generateTiles() {
        var tiles = [], movies = this.props.allMovies;
        for (var key in movies) {
            var movie = movies[key];
            if(movie.poster_path != null){
                var boundClick = this.handleClick.bind(this,key);
                tiles.push(<Tile key={key} movie={movies[key]} onClick={boundClick}></Tile>);
            }
        }
        return tiles;
    }
    render() {
        return (
            <Paper zDepth={0}>
                <Paper zDepth={0}>
                    <Dialog
                        title=""
                        actions={[]}
                        ref="movieDialog"
                        autoDetectWindowHeight={true}>
                        {
                            this.state.selectedKey?(
                                <DetailedTile movie={this.props.allMovies[this.state.selectedKey]} details={true}>
                                    
                                </DetailedTile>
                            ):"Not showing any movie right now"
                        }
                    </Dialog>
                </Paper>
                <ComponentGallery margin={4}
                    widthHeightRatio={4/3}
                    targetWidth={190}
                    initialComponentWidth={190}>
                    {this.generateTiles()}
                </ComponentGallery>
            </Paper>
        );
    }
}
