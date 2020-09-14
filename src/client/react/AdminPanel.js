import React, { useState } from 'react'
import { text } from 'd3-fetch'

function useInput (options) {
  const type = options?.type || 'text'
  const [value, setValue] = useState('')
  const input = (
    <input value={value} onChange={e => setValue(e.target.value)} type={type} />
  )
  return [value, input]
}

export default function () {
  const [name, nameInput] = useInput()
  const [password, passwordInput] = useInput()
  const [email, emailInput] = useInput()

  async function addPlayer () {
    const url = `./addPlayer?name=${name}&password=${password}&email=${email}`
    const result = await text(url)
    console.log('result is', result)
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
