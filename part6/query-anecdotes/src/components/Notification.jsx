// import { useMessageValue } from '../CounterContext'

import { useContext } from 'react'
import messageContext from '../CounterContext'

const Notification = () => {
  const [message] = useContext(messageContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return <div style={style}>{message}</div>
}

export default Notification
