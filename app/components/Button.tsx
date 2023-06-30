export function Button({
  onClick, text, className = '', ...buttonProps
}) {
  return (
    <button
      {...buttonProps}
      onClick={onClick}>
      <p
      className={`
        mr-2 text-sm text-white px-4 py-1 rounded-full
        ${className}
      `}
      >{text}</p>
    </button>
  )
}