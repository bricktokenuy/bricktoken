/**
 * Banner discreto para indicar que la plataforma está en pre-lanzamiento.
 * Se renderiza arriba del header en el layout raíz.
 */
export function PreLaunchBanner() {
  return (
    <div
      role="status"
      className="bg-amber-500/10 border-b border-amber-500/30 text-amber-900 text-center text-xs py-2 px-4"
    >
      Versión preview · Las propiedades mostradas son demo. La plataforma aún no opera con inversiones reales.
    </div>
  )
}
