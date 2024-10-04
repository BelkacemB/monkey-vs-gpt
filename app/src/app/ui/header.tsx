import React from 'react';
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Github } from 'lucide-react';
import Link from 'next/link';
const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center w-full h-16 px-4 border-b shrink-0 bg-muted">
      <div className="flex-1">
        <Link href="/">
          <p className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500'>س</p>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <a
          target="_blank"
          href="https://github.com/BelkacemB/monkey-vs-gpt"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }), 'hidden md:flex')}
        >
          <Github className='h-6 w-6' />
          <span className="ml-2 text-sm">monkey-vs-gpt</span>
        </a>
      </div>
      <div className="flex-1 text-right">
        <p className='text-sm text-muted-foreground'>Made with ❤️ by <Link href="https://belkacem.dev" className='underline'>Belkacem</Link></p>
      </div>
    </header>
  );
};

export default Header;
