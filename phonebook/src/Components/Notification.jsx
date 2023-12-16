const Notification = ({ message }) => {
    if (!message) return null; // Don't render anything if the message is null or empty

    return (
      <div className='notifications'>
        {message}
      </div>
    )
}

export default Notification