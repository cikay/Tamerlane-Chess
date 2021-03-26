import React from 'react'

export default function withProvider(Component, Provider ) {
  
  return (
    <Provider>
      <Component />
    </Provider>
  )
}
