export function Loading({
  className = '', ...props
}) {
  return (
    <img {...props} src="/loading.svg" className={`
    w-[30px] animate-spin
    ${className}
    `} />
  )
}