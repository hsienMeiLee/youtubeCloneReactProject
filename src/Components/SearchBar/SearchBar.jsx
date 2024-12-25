import React, { useState } from 'react';
import './SearchBar.css';
import search from '../../assets/search.png';
import {API_KEY} from '../../data';

const SearchBar = ({handleSearchResults}) => {

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${inputValue}&key=${API_KEY}`;

        try {
            const response = await fetch(searchUrl);
            const data = await response.json();
            if(data && data.items){
                handleSearchResults(data.items, inputValue);
            }else{
                handleSearchResults([],inputValue);
            }
        } catch (error) {
            console.error('Search error : ', error);
            handleSearchResults([],inputValue);
        }
    }
    
    return (

        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Search' value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
                <img src={search} alt="search" />
            </form>
        </>
    )
}

export default SearchBar