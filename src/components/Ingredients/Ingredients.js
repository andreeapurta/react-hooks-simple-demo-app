import React, { useEffect, useState, useMemo, useCallback, useReducer } from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import useHttp from "../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient]; //old array + new item
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifer, clear } = useHttp();

  //we can use our effect to react to that data in the ingredients, and update our local ingredients based on that data we got back
  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === "ADD_INGREDIENT") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  //- callback with this dep - because it doesn't change between render cycles and react Memmo detects that the new function are getting when the parent component rebuilds is the old function and therefore doesn't rebuild this component
  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        `https://react-tutuorial-project-default-rtdb.firebaseio.com/ingredients/.json`,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-tutuorial-project-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );


  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />;
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
