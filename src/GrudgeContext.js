import React, { useReducer, createContext, useCallback } from 'react';
import initialState from './initialState';
import id from 'uuid/v4';

export const GrudgeContext = createContext();

const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const reducer = (state = defaultState, action) => {
  if (action.type === GRUDGE_ADD) {
    const newPresent = [
      {
        id: id(),
        ...action.payload
      },
      ...state.present
    ];
    return {
      past: [state.present, ...state.past],
      present: newPresent,
      future: []
    }
  }

  if (action.type === GRUDGE_FORGIVE) {
    const newPresent = state.present.ap(grudge => {
      if( grudge.id === action.payload.id ){
        return { ...grudge, forgiven : !grudge.forgiven};
      }
      return grudge;
    })
    return {
      past: [],
      present: newPresent,
      future: []
    }; 
  }
 
  return state;
};
const defaultState = {
  past: [],
  present: initialState,
  future: []
}
export const GrudgeProvider = ({ children }) => {
  const [grudges, dispatch] = useReducer(reducer, initialState);
  const grudges =  state.present;

  const addGrudge = useCallback(
    ({ person, reason }) => {
      dispatch({
        type: GRUDGE_ADD,
        payload: {
          person,
          reason
        }
      });
    },
    [dispatch]
  );

  const toggleForgiveness = useCallback(
    id => {
      dispatch({
        type: GRUDGE_FORGIVE,
        payload: {
          id
        }
      });
    },
    [dispatch]
  );

  return (
    <GrudgeContext.Provider value={{ grudges, addGrudge, toggleForgiveness }}>
      {children}
    </GrudgeContext.Provider>
  );
};
