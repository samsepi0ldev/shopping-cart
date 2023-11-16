import { Github, ShoppingCart, X } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import { ProductCard } from "./components/product-card"
import { useEffect, useState } from "react"
import { Loader } from "./components/loader"

const SIZES = ["xs", "s", "m", "ml", "l", "xl", "xxl"]

const products = [
  {
    name: "Cropped Stay Groovy em branco",
    amount: 1090,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/8552515751438644-1-product.b6128dd1df3de552cf1b.webp",
    size: "xs",
  },
  {
    name: "Camisa branca básica Cactus",
    amount: 1325,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/39876704341265610-1-product.1f07d5fa94ed8584c756.webp",
    size: "xs",
  },
  {
    name: "Capote preto da Nike",
    amount: 2590,
    shipping: false,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/9197907543445676-1-product.25f42b6c504af11cc71c.webp",
    size: "s",
  },
  {
    name: "Tule preto de tamanho grande",
    amount: 2945,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/51498472915966370-1-product.e53dc0babb7b44f7e40e.webp",
    size: "m",
  },
  {
    name: "Camisa preta do Batman",
    amount: 1090,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/12064273040195392-1-product.85191f0d6e809687fe4a.webp",
    size: "m",
  },
  {
    name: "Camisa azul",
    amount: 9000,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/10686354557628304-1-product.00bf8ca2603352e0cfad.webp",
    size: "m",
  },
  {
    name: "Loose camiseta preta",
    amount: 1400,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/11033926921508488-1-product.e80b2a0ba8e1d1c30095.webp",
    size: "ml",
  },
  {
    name: "Camisa da Vans",
    amount: 1090,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/18644119330491310-1-product.3ab8c5301302c1f8add4.webp",
    size: "l",
  },
  {
    name: "Camisa cinza",
    amount: 1490,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/11854078013954528-1-product.e540be53e59461e648c8.webp",
    size: "xl",
  },
  {
    name: "Camisa preta da Adidas",
    amount: 1490,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/876661122392077-1-product.8c566b01d48c7b6964f0.webp",
    size: "xl",
  },
  {
    name: "Camisa das Tartarugas Ninjas",
    amount: 1090,
    shipping: false,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/10547961582846888-1-product.76c02f8ee37e439fad3b.webp",
    size: "xxl",
  },
  {
    name: "Camisa preta slim",
    amount: 4990,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/6090484789343891-1-product.71fc50c019740fbf7e8e.webp",
    size: "s",
  },
  {
    name: "Blusão azul da GAP",
    amount: 2250,
    shipping: false,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/18532669286405344-1-product.7cde472a672f1f3412aa.webp",
    size: "l",
  },
  {
    name: "Camisa branca da Gucci",
    amount: 1870,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/5619496040738316-1-product.f8e172dd538635d22ef8.webp",
    size: "m",
  },
  {
    name: "Camisa tropical vinho",
    amount: 13490,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/11600983276356164-1-product.e4dadda2c10e5e458cce.webp",
    size: "xs",
  },
  {
    name: "Camisa Marine Blue",
    amount: 4900,
    shipping: true,
    image:
      "https://react-shopping-cart-67954.firebaseapp.com/static/media/27250082398145996-1-product.1dd6d87d61bfdb92f787.webp",
    size: "xs",
  },
]

type ProductType = (typeof products)[0]

type CartType = Array<ProductType & { qtd: number }>

export function App() {
  const [sizes, setSizes] = useState<string[]>([])
  const [dataProducts, setDataProducts] = useState<ProductType[]>(products)
  const [isLoadingProducts, setIsLoadingProduct] = useState(false)
  const [cart, setCart] = useState<CartType>([])
  const [open, setOpen] = useState(false)

  function handleSize(size: string) {
    const exists = sizes?.includes(size)
    if (exists) {
      setSizes((sizes) => sizes?.filter((d) => d !== size))
      return
    }
    setSizes([...sizes, size])
  }

  useEffect(() => {
    if (sizes.length) {
      setIsLoadingProduct(true)
      new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
        setDataProducts(
          products.filter((product) => sizes.includes(product.size)),
        )
        setIsLoadingProduct(false)
      })
      return
    }
    setDataProducts(products)
  }, [sizes])

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  function addOrSubQtdProductInCart(index: number, operation: string) {
    const data = cart.map((product, i) => {
      if (i === index && operation === "add") {
        product.qtd++
      } else if (i === index && operation === "sub") {
        product.qtd--
      }
      return product
    })
    setCart(data)
  }

  function removeProductFromCart(index: number) {
    setCart((products) => products.filter((_, i) => i !== index))
  }

  function addProductOnCart(product: ProductType) {
    const existsProduct = cart.find((p) => p.name === product.name)
    if (existsProduct) {
      const index = cart.indexOf(existsProduct)
      setCart((products) =>
        products.map((product, i) => {
          if (index === i) {
            product.qtd++
          }
          return product
        }),
      )
      return
    }
    setCart([...cart, Object.assign(product, { qtd: 1 })])
  }

  const amountProductsInCart = cart.reduce((acc, cur) => {
    acc += cur.amount * cur.qtd
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
        <a href="#" className="bg-black p-4 text-white">
          <Github />
        </a>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              className='fixed right-0 top-0 z-10 ml-auto bg-zinc-900 p-4 text-white transition-transform data-[state="open"]:-translate-x-[448px]'
            >
              {open ? <X /> : (
                <>
                  <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-xs text-black font-medium">
                    {cart.reduce((acc, cur) => {
                      acc += cur.qtd;
                      return acc;
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
              <div className="scrollbar-thin scrollbar-thumb-black scrollbar-track-zinc-800 h-full overflow-y-scroll pb-5">
                <div className="flex items-center justify-center space-x-4 py-11">
                  <div className="relative flex items-center justify-center">
                    <ShoppingCart className="text-white" size={32} />
                    <span className="absolute -bottom-4 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-xs font-medium">
                      {cart.reduce((acc, cur) => {
                        acc += cur.qtd;
                        return acc;
                      }, 0)}
                    </span>
                  </div>
                  <span className="text-lg font-medium text-white">
                    Carrinho
                  </span>
                </div>
                <div className="mt-10 flex flex-col gap-6 px-5 text-white">
                  {cart.length ? (
                    cart.map(({ name, image, amount, size, qtd }, index) => (
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
                            Quantidade: {qtd}
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
                              disabled={qtd <= 1}
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
                <button className="mt-10 w-full bg-zinc-950 py-4 uppercase text-white transition-colors hover:bg-black" onClick={() => alert(`Finalizar compra - Subtotal: ${formatter.format(amountProductsInCart/ 100)}`)}>
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
                className="h-9 w-9 rounded-full border border-transparent bg-zinc-300 text-xs uppercase hover:border-zinc-900 data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
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
          <span>{dataProducts.length} Produto(s) encontrados</span>
          <div className="relative mt-10 grid h-full w-full grid-cols-4 gap-y-10">
            {isLoadingProducts && <Loader />}
            {dataProducts.map((product, i) => (
              <ProductCard
                key={i}
                data={product}
                addToCart={() => addProductOnCart(product)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
