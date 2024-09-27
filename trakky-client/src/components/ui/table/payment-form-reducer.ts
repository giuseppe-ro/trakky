/* eslint-disable @typescript-eslint/no-explicit-any */
export const FETCH_INITIAL_STATE = {
  loading: false,
  owners: [],
  types: [],
  categories: [],
  icons: [],
  error: null,
};

export enum FetchActionType {
  FETCH_START = 'FETCH_START',
  FETCHED_OWNERS = 'FETCHED_OWNERS',
  FETCHED_TYPES = 'FETCHED_TYPES',
  FETCHED_CATEGORIES = 'FETCHED_CATEGORIES',
  FETCHED_ICONS = 'FETCHED_ICONS',
  FETCH_END = 'FETCH_END',
  FETCH_ERROR = 'FETCH_ERROR',
}

export const paymentFormDataReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
      };
    case 'FETCHED_OWNERS':
      return {
        ...state,
        owners: action.payload,
      };
    case 'FETCHED_TYPES':
      return {
        ...state,
        types: action.payload,
      };
    case 'FETCHED_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'FETCHED_ICONS':
      return {
        ...state,
        icons: action.payload,
      };
    case 'FETCH_END':
      return {
        ...state,
        loading: false,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
