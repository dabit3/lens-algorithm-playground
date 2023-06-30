'use client'

export function Input({
  onChange, placeholder, className = ''
}) {
  return (
    <input
      onChange={onChange}
      placeholder={placeholder}
      className={`
        bg-slate-200 py-2 px-4 rounded
        ${className}
      `}
    />
  )
}