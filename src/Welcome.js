import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Welcome() {
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function onJoin() {
    sessionStorage.setItem('name', name)
    navigate(`/chat/${roomId}`)
  }

  return (
    <div className="welcome">
      <input
        type="text"
        placeholder="Room Id"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => onJoin()}>Join</button>
    </div>
  )
}

export default Welcome
