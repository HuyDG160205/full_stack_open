import { createContext, useReducer } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.message
    default:
      return state
  }
}

const messageContext = createContext()

export const MessageContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, '')

  return (
    <messageContext.Provider value={[message, messageDispatch]}>
      {props.children}
    </messageContext.Provider>
  )
}

export default messageContext
