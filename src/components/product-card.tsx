type ProductType = {
  name: string
  amount: number
  shipping: boolean
  image: string
}

interface ProductCardProps {
  data: ProductType
  addToCart: () => void
}

export function ProductCard({ data, addToCart }: ProductCardProps) {
  const [num, dec] = (data.amount / 100).toFixed(2).toString().split('.')
  return (
    <div className='relative flex flex-col p-2.5'>
      <img src={data.image} alt={data.name} className='h-80' />
      {data.shipping && (
        <span className='absolute right-2.5 top-2.5 bg-black p-1 text-xs text-white'>
          Envio gratis
        </span>
      )}
      <span className='text-center relative mt-6 h-11 after:w-6 after:h-0.5 after:bg-yellow-600 after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 px-5 my-4 leading-tight'>{data.name}</span>
      <span className='text-center'>
        <span className='text-xs'>$</span>
        <span className='text-2xl font-bold'>{num}</span>
        .{dec}
      </span>
      <span className='text-center text-zinc-500'>
        ou 9 x<span className='text-muted-foreground font-bold'>$1.21</span>
      </span>
      <button
        className='mt-8 w-full bg-zinc-900 py-4 text-white transition-colors hover:bg-yellow-500'
        onClick={addToCart}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}
