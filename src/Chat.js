import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from './supabase'
import './Chat.css'

function Chat() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [channel, setChannel] = useState(null)
  const [senderName] = useState(
    sessionStorage.getItem('name') ||
      `Anonymous - ${Math.round(Math.random() * 10e5)}`,
  )
  const { roomId } = useParams()

  async function fetchData() {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .filter('roomId', 'eq', roomId)

    setMessages(messages)
  }
  useEffect(() => {
    fetchData()

    const channel = supabase.channel(roomId)

    channel
      .on(
        'broadcast',
        {
          event: 'new-message',
        },
        () => {
          fetchData()
        },
      )
      .subscribe()

    setChannel(channel)
  }, [])

  function onChangeMessage(v) {
    setMessage(v)
  }

  async function onSend() {
    const newMessage = {
      text: message,
      roomId,
      senderName,
      createdAt: Date.now(),
    }
    await supabase.from('messages').insert([newMessage])

    setMessage('')
    fetchData()

    channel.send({
      type: 'broadcast',
      event: 'new-message',
      payload: newMessage,
    })
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((it) => (
          <div className="message" key={it.id}>
            <span
              className={`sender-name ${
                it.senderName === senderName ? 'self' : ''
              }`}
            >
              {it.senderName}:&nbsp;
            </span>
            <span className="text">{it.text}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type message here"
        value={message}
        onChange={(e) => onChangeMessage(e.target.value)}
      />
      <button onClick={() => onSend()}>Send</button>
    </div>
  )
}

export default Chat
