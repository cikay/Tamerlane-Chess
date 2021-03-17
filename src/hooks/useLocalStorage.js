import { useState, useEffect } from 'react'

const PREFIX = 'tamerlane-chess-'

export default function useLocalStorage(key, initialValue) {
  const prefixKey = PREFIX + key

  const [value, setValue] = useState(() => {
    console.log('use local storage')
    const jsonValue = localStorage.getItem(prefixKey)
    console.log('prefixKey', prefixKey)
    console.log('json value', jsonValue)
    console.log(typeof jsonValue)

    if (jsonValue === 'undefined' || jsonValue === 'null') {
      console.log('prefixKey', prefixKey)
      return initialValue
    }
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return JSON.parse(jsonValue)
    }
  })

  useEffect(() => {
    console.log(prefixKey, 'is changed to', value)
    localStorage.setItem(prefixKey, JSON.stringify(value))
  }, [prefixKey, value])

  return [value, setValue]
}
