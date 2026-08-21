export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-[#0b3b72] text-white hover:bg-[#0a2f5d] disabled:bg-slate-300 disabled:text-slate-500',
    secondary:
      'bg-[#eafaf2] text-[#0f3d2b] border border-[#8ad0ae] hover:bg-[#dff7ea] disabled:bg-slate-100 disabled:text-slate-400',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400',
    ghost: 'text-[#0b3b72] hover:bg-slate-100 disabled:text-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-ring disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}