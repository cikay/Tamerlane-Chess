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

    if (jsonValue == 'undefined') {
      console.log('prefixKey', prefixKey)
      return initialValue
    }
    const parsedValue = JSON.parse(jsonValue)

    if (typeof parsedValue === 'function') {
      return parsedValue()
    }

    return parsedValue
  })

  useEffect(() => {
    console.log(prefixKey, 'is changed to', value)
    localStorage.setItem(prefixKey, JSON.stringify(value))
  }, [prefixKey, value])

  return [value, setValue]
}
