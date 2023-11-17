import { Github, ShoppingCart, X } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import { useEffect, useState } from "react"

import { Loader } from "./components/loader"
import { ProductCard } from "./components/product-card"
import { useCart } from "./lib/cart-context"

const SIZES = ["xs", "s", "m", "ml", "l", "xl", "xxl"]

export function App() {
  const [sizes, setSizes] = useState<string[]>([])
  const [isLoadingProducts, setIsLoadingProduct] = useState(false)
  const [open, setOpen] = useState(false)

  const {
    products,
    addProductFromCart,
    filterProductBySize,
    cart,
    setCart,
    removeProductFromCart,
    reloadProducts
  } = useCart()


  function handleSize(size: string) {
    const exists = sizes?.includes(size)
    if (exists) {
      setSizes((sizes) => sizes?.filter((d) => d !== size))
      return
    }
    setSizes([...sizes, size])
  }

  useEffect(() => {
    setIsLoadingProduct(true)
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      if (!sizes.length) {
        setIsLoadingProduct(false)
        return reloadProducts()
      }
      filterProductBySize(sizes)
      setIsLoadingProduct(false)
    })
  }, [sizes])

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  function addOrSubQtdProductInCart(index: number, operation: string) {
    const data = cart.map((product, i) => {
      if (i === index && operation === "add") {
        product.quantity += 1
      } else if (i === index && operation === "sub") {
        product.quantity -= 1
      }
      return product
    })
    setCart(data)
  }

  const amountProductsInCart = cart.reduce((acc, cur) => {
    acc += cur.amount * cur.quantity
    return acc
  }, 0)

  function monthlyInstallmentByInterest() {
    const monthlyFee = 4 / 100
    const monthlyInstallment =
      (amountProductsInCart * monthlyFee) / (1 - Math.pow(1 + monthlyFee, -12))
    return formatter.format(monthlyInstallment / 100)
  }

  return (
      <main>
        <header className="flex h-12 items-center">
          <a href="https://www.github.com/samsepi0ldev/shopping-cart" className="bg-black p-4 text-white">
            <Github />
          </a>
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <button className='fixed right-0 top-0 z-10 ml-auto bg-zinc-900 p-4 text-white transition-transform data-[state="open"]:-translate-x-[448px]'>
                {open ? (
                  <X />
                ) : (
                  <>
                    <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-xs font-medium text-black">
                      {cart.reduce((acc, cur) => {
                        acc += cur.quantity
                        return acc
                      }, 0)}
                    </span>
                    <ShoppingCart />
                  </>
                )}
              </button>
            </Popover.Trigger>
            <Popover.Anchor className="fixed right-0 top-0" />

            <Popover.Portal>
              <Popover.Content className="showSideBar flex h-screen w-[448px] max-w-md flex-col bg-zinc-900 transition-transform">
                <div className="h-full overflow-y-scroll pb-5 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-black">
                  <div className="flex items-center justify-center space-x-4 py-11">
                    <div className="relative flex items-center justify-center">
                      <ShoppingCart className="text-white" size={32} />
                      <span className="absolute -bottom-4 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-xs font-medium">
                        {cart.reduce((acc, cur) => {
                          acc += cur.quantity
                          return acc
                        }, 0)}
                      </span>
                    </div>
                    <span className="text-lg font-medium text-white">
                      Carrinho
                    </span>
                  </div>
                  <div className="mt-10 flex flex-col gap-6 px-5 text-white">
                    {cart.length ? (
                      cart.map(({ name, image, amount, size, quantity }, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 border-t border-t-black pt-4"
                        >
                          <img className="w-2/12" src={image} alt={name} />
                          <div className="flex flex-col">
                            <span className="text-white">{name}</span>
                            <span className="uppercase text-zinc-600">
                              {size}
                            </span>
                            <span className="text-sm text-zinc-600">
                              Quantidade: {quantity}
                            </span>
                          </div>
                          <div className="ml-auto flex flex-col items-end justify-center gap-2">
                            <button
                              className="transition-colors hover:text-black"
                              onClick={() => removeProductFromCart(index)}
                            >
                              <X />
                            </button>
                            <span className="text-yellow-500">
                              {formatter.format(amount / 100)}
                            </span>
                            <div className="flex items-center">
                              <button
                                className="flex h-6 w-6 items-center justify-center bg-black disabled:cursor-not-allowed disabled:opacity-25"
                                disabled={quantity <= 1}
                                onClick={() =>
                                  addOrSubQtdProductInCart(index, "sub")
                                }
                              >
                                -
                              </button>
                              <button
                                className="flex h-6 w-6 items-center justify-center bg-black"
                                onClick={() =>
                                  addOrSubQtdProductInCart(index, "add")
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="mx-auto block text-center leading-10">
                        Adicione alguns produtos no carrinho <br /> :)
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-52 p-10 uppercase before:absolute before:-top-5 before:left-0 before:block before:h-5 before:w-full before:bg-gradient-to-t before:from-black/20 before:to-transparent">
                  <div className="flex items-start justify-between text-lg">
                    <span className="text-zinc-600">Subtotal</span>
                    <div className="flex flex-col">
                      <span className="text-yellow-500">
                        {formatter.format(amountProductsInCart / 100)}
                      </span>
                      <span className="text-sm uppercase text-zinc-600">
                        OU ATÉ 12 X $ {monthlyInstallmentByInterest()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-10 w-full bg-zinc-950 py-4 uppercase text-white transition-colors hover:bg-black"
                    onClick={() =>
                      alert(
                        `Finalizar compra - Subtotal: ${formatter.format(
                          amountProductsInCart / 100,
                        )}`,
                      )
                    }
                  >
                    Checkout
                  </button>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </header>
        <div className="mx-auto mt-20 grid w-full max-w-7xl grid-cols-[240px_1fr]">
          <div className="flex flex-col pr-10">
            <span className="text-base font-bold">Tamanhos:</span>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {SIZES.map((size, i) => (
                <button
                  key={i}
                  data-active={sizes.includes(size)}
                  className="h-9 w-9 rounded-full border border-transparent bg-zinc-300 text-xs uppercase data-[active=true]:bg-zinc-900 data-[active=true]:text-white hover:border-zinc-900"
                  onClick={() => handleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <span className="my-10 text-sm">
              Deixe uma estrela no Github se este repositório foi útil :)
            </span>
            <a
              className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-500"
              href="https://www.github.com/samsepi0ldev/shopping-cart"
            >
              Estrela
            </a>
          </div>
          <div className="block">
            <span>{products.length} Produto(s) encontrados</span>
            <div className="relative mt-10 grid h-full w-full grid-cols-4 gap-y-10">
              {isLoadingProducts && <Loader />}
              {products.map((product, i) => (
                <ProductCard
                  key={i}
                  data={product}
                  addToCart={() => addProductFromCart(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
  )
}
