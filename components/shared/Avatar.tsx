import { cn } from '@/lib/cn';

export function Avatar({ value, size = 'md', className }: { value: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const isImage = value.startsWith('data:image') || value.startsWith('http');
  const sizeClass = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl'
  }[size];

  if (isImage) {
    return <img src={value} alt="avatar" className={cn(sizeClass, 'forge-border object-cover', className)} />;
  }

  return (
    <div className={cn(sizeClass, 'grid place-items-center bg-gradient-to-br from-forge-orange via-forge-purple to-forge-blue font-black text-forge-ice shadow-glow', className)}>
      {value.slice(0, 2).toUpperCase()}
    </div>
  );
}
