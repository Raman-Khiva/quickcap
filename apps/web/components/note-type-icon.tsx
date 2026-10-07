'use client'

import React from 'react'
import { Key, FileText, CheckSquare, Users, Code, Mic, CreditCard } from 'lucide-react'
import { NoteType } from '@/lib/types/note'
import { cn } from '@workspace/ui/lib/utils'

interface NoteTypeIconProps {
  type: NoteType
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

export function NoteTypeIcon({ type, size = 'md', className, showLabel = false }: NoteTypeIconProps) {
  const getConfig = () => {
    const strokeWidth = 2.75
    const iconSizeClass = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'

    switch (type) {
      case 'credential':
        return {
          icon: <Key className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
          label: 'Credential'
        }
      case 'code':
        return {
          icon: <Code className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
          label: 'Code Snippet'
        }
      case 'finance':
        return {
          icon: <CreditCard className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
          label: 'Finance & Payout'
        }
      case 'meeting':
        return {
          icon: <Users className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
          label: 'Meeting Note'
        }
      case 'voice':
        return {
          icon: <Mic className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
          label: 'Voice Memo'
        }
      case 'checklist':
        return {
          icon: <CheckSquare className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
          label: 'Checklist'
        }
      case 'note':
      default:
        return {
          icon: <FileText className={iconSizeClass} strokeWidth={strokeWidth} />,
          style: 'bg-zinc-200/90 text-zinc-800 dark:bg-zinc-700/80 dark:text-zinc-200',
          label: 'Note'
        }
    }
  }

  const { icon, style, label } = getConfig()

  const boxSizes = {
    sm: 'p-1 rounded-md',
    md: 'p-1.5 rounded-lg',
    lg: 'p-2.5 rounded-xl'
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={cn(
          "inline-flex items-center justify-center shrink-0 font-medium transition-colors",
          boxSizes[size],
          style,
          className
        )}
        title={label}
      >
        {icon}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      )}
    </div>
  )
}
