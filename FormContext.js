import React, { createContext, useReducer, useContext } from 'react';

const FormDataContext = createContext({ state:{} });

const initialState = {};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return {
        ...state,
        [action.formName]: {
          ...state[action.formName],
          ...action.payload,
        },
      };
    case 'RESET_FORM':
      const newState = { ...state };
      delete newState[action.formName];
      return newState;
    case 'RESET_ALL':
      return {};
    default:
      return state;
  }
};

export const FormDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  console.log('====================================')
  console.log(state)
  console.log('====================================')
  return (
    <FormDataContext.Provider value={{ state, dispatch }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useServiceFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};
