import React, { useState } from 'react'
import { text } from 'd3-fetch'

function useInput (options) {
  const type = options?.type || 'text'
  const [value, setValue] = useState('')
  const input = (
    <input value={value} onChange={e => setValue(e.target.value)} type={type} />
  )
  return [value, input, setValue]
}

export default function () {
  const [name, nameInput, setName] = useInput()
  const [password, passwordInput, setPassword] = useInput()
  const [email, emailInput, setEmail] = useInput()

  async function addPlayer () {
    const url = `.netlify/functions/addPlayer?name=${name}&password=${password}&email=${email}`
    const result = await text(url)
    console.log('result is', result)
    setName('')
    setPassword('')
    setEmail('')

  }

  return (
    <div>
      <div>
        <h1>add player</h1>
        <div>name</div>
        <div>
          {nameInput}
        </div>
        <div>password</div>
        <div>
          {passwordInput}
        </div>
        <div>email</div>
        <div>
          {emailInput}
        </div>
        <button onClick={addPlayer}>add player</button>
      </div>
    </div>
  )
}
