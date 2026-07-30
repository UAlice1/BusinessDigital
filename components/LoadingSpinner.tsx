interface Props { size?: 'sm' | 'md' | 'lg' }

export default function LoadingSpinner({ size = 'md' }: Props) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-2' }
  return (
    <div
      className={`${s[size]} rounded-full border-gray-200 border-t-primary animate-spin inline-block`}
      role="status" aria-label="Loading"
    />
  )
}
