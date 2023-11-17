import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'
import './index.css'
import { CartProvider } from './lib/cart-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)
