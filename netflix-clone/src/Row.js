import React, { useState, useEffect } from "react";
import axios from './axios';
import './Row.css';
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseimg_url="https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }){
    const [movies, setMovies] = useState ([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    /**code which runs based on a specific condition/varaible (when Row loaded, do something (feed the information: images)) */ 
    useEffect(() => {
        // if [], run once when the row loads, and don't run again.
        // will pass request to third party server(may took a second), so using async function (really important)
        async function fetchData() {
            const request = await axios.get(fetchUrl) // use await: when make the request, wait for the props come back, then do something
            //console.log(request); //a way to inpsect what I get when sending a request via api
            setMovies(request.data.results); //store json into varaible 
            return request;
        }
        fetchData();
    }, [fetchUrl]) //* dont forget 

const opts = {
    height: "390",
    width: "100%",
    playerVars:{
        autoplay: 1,
    },
};

const handleClick = (movie) =>{
    if (trailerUrl) { // if there is a trailer then set trailerUrl to empty(close it)
        setTrailerUrl('');
    } else {
        movieTrailer(movie?.name || "")
        .then((url) => {
            // https://www.youtube.com/watch?v=ktjafK4SgWM
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
        }).
        catch(error => console.log(error))
    }
};


    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {movies.map(movie => (  //map is a way to iterate an collection
                    <img
                    key={movie.id} 
                    onClick={() => handleClick(movie)}
                    className={`row_poster ${isLargeRow && "row_posterLarge"}`} //everything is row_poster, but if isLargeRow then it is row_posterLarge
                    src={`${baseimg_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} //? :(if-else)
                    alt={movie.name}/> //alt is alternatives, if no img then alt
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row;
