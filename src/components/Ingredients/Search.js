import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props; //object destuctoring
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {  //if the user stopped typing start fetching
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? '' //NOTHING
            : `?orderBy="title"&equalTo="${enteredFilter}"`; //FILTER UNDERSTOOD BY FIREBASE
        fetch(
          'https://react-tutuorial-project-default-rtdb.firebaseio.com/ingredients.json' + query
        )
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    //clean up function
    return () => {
      clearTimeout(timer); //if there is a new key pressed, clear the timer
    };
  }, [enteredFilter, onLoadIngredients, inputRef]); // onLoadIngredients as dependency because we want it to change everytime ingredients change

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;