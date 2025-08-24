'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // базовые стили
        'peer size-4 shrink-0 rounded-[4px] border transition-colors outline-none flex items-center justify-center',

        // неактивный border-[#FE5F00] bg-transparent
        '  bg-[#FE5F00]/10',

        // активный
        'data-[state=checked]:bg-[#FE5F00] data-[state=checked]:text-white data-[state=checked]:border-[#FE5F00]',

        // состояния доступности
        'disabled:cursor-not-allowed disabled:opacity-50',

        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
