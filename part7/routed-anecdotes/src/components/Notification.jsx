const Notification = ({ notification }) => {
  if (!notification) return null

  return <div className="notification">{notification}</div>
}

export default Notification
