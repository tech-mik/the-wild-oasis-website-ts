'use client'

import { useEffect, useState } from 'react'

export default function Counter({ users }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(users)
  }, [users])

  return (
    <div>
      <div>There are {users.length} users</div>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </div>
  )
}
