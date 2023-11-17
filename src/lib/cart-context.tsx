import { ReactNode, createContext, useContext, useState } from 'react'

import { productsData } from './products'

type Product = {
  name: string
  size: string
  image: string
  amount: number
  shipping: boolean
}

type Cart = Product & { quantity: number }

interface CartContextProps {
  addProductFromCart: (index: number) => void
  removeProductFromCart: (index: number) => void
  filterProductBySize: (sizes: string[]) => void
  products: Product[]
  cart: Cart[]
  setCart: (products: Cart[]) => void
  reloadProducts: () => void
}

const CartContext = createContext<CartContextProps>({} as CartContextProps)

interface CartProviderProps {
  children?: ReactNode
}

export function CartProvider ({ children }: CartProviderProps) {
  const [products, setProducts] = useState<Product[]>(productsData)
  const [cart, setCart] = useState<Cart[]>([])

  function addProductFromCart (index: number) {
    const product = products.find((_, i) => i === index)!
    const productInCart = cart.find(p => p.name === product?.name)
    if (productInCart) {
      return setCart(products => products.map(product => {
        if (product.name === productInCart.name) {
          product.quantity += 1
        }
        return product
      }))
    }
    setCart([...cart, {...product, quantity: 1 }])
  }

  function removeProductFromCart (index: number) {
    setCart(products => products.filter((_, i) => i !== index))
  }

  function filterProductBySize (sizes: string[]) {
    setProducts(productsData.filter(product => sizes.includes(product.size)))
  }

  function reloadProducts () {
    setProducts(productsData)
  }
  
  return (
    <CartContext.Provider value={{
      addProductFromCart,
      removeProductFromCart,
      filterProductBySize,
      products,
      cart,
      setCart,
      reloadProducts
    }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart () {
  return useContext(CartContext)
}