export function BrandLogo({ size = 'default' }: { size?: 'sm' | 'default' }) {
  const dims = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const text = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className={`${dims} flex items-center justify-center rounded-xl bg-gold font-bold tracking-tighter text-navy ${text}`}>
      BT
    </div>
  )
}

export function BrandWordmark({ size = 'default', variant = 'dark' }: { size?: 'sm' | 'default'; variant?: 'dark' | 'light' }) {
  const textSize = size === 'sm' ? 'text-base' : 'text-lg'
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900'
  const accentColor = variant === 'light' ? 'text-gold-light' : 'text-gold'

  return (
    <div className="flex items-center gap-2.5">
      <BrandLogo size={size} />
      <div className="flex items-baseline gap-0">
        <span className={`${textSize} font-semibold tracking-tight ${textColor}`}>Brick</span>
        <span className={`${textSize} font-semibold tracking-tight ${accentColor}`}>Token</span>
      </div>
    </div>
  )
}
