export function BrandLogo({ size = 'default' }: { size?: 'sm' | 'default' }) {
  const dims = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const text = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className={`${dims} flex items-center justify-center rounded-xl bg-blue-600 font-bold tracking-tighter text-white ${text}`}>
      BT
    </div>
  )
}

export function BrandWordmark({ size = 'default' }: { size?: 'sm' | 'default' }) {
  const textSize = size === 'sm' ? 'text-base' : 'text-lg'

  return (
    <div className="flex items-center gap-2.5">
      <BrandLogo size={size} />
      <div className="flex items-baseline gap-0">
        <span className={`${textSize} font-semibold tracking-tight text-slate-900`}>Brick</span>
        <span className={`${textSize} font-semibold tracking-tight text-blue-600`}>Token</span>
      </div>
    </div>
  )
}
