export const SUBMIT_INITIAL_STATE = {
  submitting: false,
  submitted: false,
  submittedWithSuccess: false,
  error: null
}


export enum SubmitActionType {
  SUBMIT_START = 'SUBMIT_START',
  SUBMIT_END = 'SUBMIT_END',
  SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
  SUBMIT_ERROR = 'SUBMIT_ERROR',
  RESET_SUBMIT = 'RESET_SUBMIT'
}

export const submitReducer = (state = SUBMIT_INITIAL_STATE, action: any) => {
  switch (action.type) {
    case 'SUBMIT_START':
      return {
        ...SUBMIT_INITIAL_STATE,
        submitting: true
      }
    case 'SUBMIT_END':
      return {
        ...state,
        submitting: false,
        submitted: false,
      }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        submitting: false,
        submitted: true,
        submittedWithSuccess: true
      }
    case 'SUBMIT_ERROR':
      return {
        ...state,
        submitting: false,
        submitted: true,
        error: action.payload
      }
    case 'RESET_SUBMIT':
      return SUBMIT_INITIAL_STATE
    default:
      return state
  }
}
