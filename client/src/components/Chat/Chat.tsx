import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import axios from 'axios'
import { io } from 'socket.io-client'
import styles from './Chat.module.css'
import Input from '../Shared/Input/Input'
import Button from '../Shared/Button/Button'
import { useAppSelector } from '../../redux/hooks'
import type { MsgType, OneDealDetailed } from '../../types'

type ChatPropsType = {
  deal: OneDealDetailed | undefined
}

export default function Chat({ deal }: ChatPropsType): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)
  const [msgs, setMsgs] = useState<MsgType[]>([])
  const [msgInput, setMsgInput] = useState<string>('')
  const socket = useMemo(() => {
    if (user.id) {
      return io(`${import.meta.env.VITE_CHAT}`, {
        extraHeaders: {
          newuserid: `${user.id}`,
        },
      })
    }
  }, [user.id])
  // const [message, setMessage] = useState('')

  const sendMsgHandler = async (): Promise<void> => {
    if (msgInput.trim() && deal && user) {
      socket?.emit('message', {
        text: msgInput,
        userId: user.id,
        userName: user.firstName,
        // socketID: socket.id,
        dealId: deal.id,
      })

      const mes = await axios.post(
        `${import.meta.env.VITE_API}/v1/deals/${deal.id}/messages`,
        { text: msgInput, userId: user.id },
        { withCredentials: true },
      )
      console.log(mes)
    }

    setMsgInput('')
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMsgInput(e.target.value)
  }

  useEffect(() => {
    if (deal) {
      axios
        .get<MsgType[]>(
          `${import.meta.env.VITE_API}/v1/deals/${deal?.id}/messages`,
          {
            withCredentials: true,
          },
        )
        .then((res) => setMsgs((prev) => res.data))
        .catch((err) => console.log(err))
      return () => {
        socket?.close()
      }
    }
  }, [deal])

  useEffect(() => {
    socket?.on(`res-deal-${deal?.id}`, (data) => setMsgs([data, ...msgs]))
  }, [msgs])

  // console.log(socket)

  return (
    <>
      <div className={styles.chat}>
        {msgs.map((msg, index) => (
          <div
            key={`msg-${index}`}
            className={clsx(
              styles.msg,
              msg.userId === user.id ? styles.myMsg : styles.hisMsg,
            )}
          >
            <p>{msg.userName}</p>
            {msg.text}
          </div>
        ))}
        {/* <div className={clsx(styles.msg, styles.myMsg)}>
          привет, давай меняться!
        </div>
        <div className={clsx(styles.msg, styles.hisMsg)}>
          привет, конечно давай!
        </div> */}
      </div>

      <div className={styles.input}>
        <Input
          name='chatMsg'
          onChange={changeHandler}
          value={msgInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMsgHandler()
          }}
        />
        <Button onClick={sendMsgHandler}>отправить</Button>
      </div>
    </>
  )
}
