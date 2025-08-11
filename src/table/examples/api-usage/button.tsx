import { cn } from '../../../scalars/lib/utils.js'

const variantClasses = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white',
  outline: 'bg-transparent border border-gray-500 text-gray-500',
  danger: 'bg-red-500 text-white',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: keyof typeof variantClasses
}

const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  return <button className={cn('px-4 py-2 rounded-md', variantClasses[variant], props.className)} {...props} />
}

export { Button }
