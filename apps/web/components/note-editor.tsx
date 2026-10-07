'use client'

import React, { useState, useEffect } from 'react'
import { Pin, Star, Trash2, Copy, Check, Clock, Sparkles, Folder, Eye, EyeOff, Key } from 'lucide-react'
import { Note, NoteCategory, NoteStatus, NoteType } from '@/lib/types/note'
import { Card, CardHeader, CardContent, CardFooter } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Badge } from '@workspace/ui/components/badge'
import { NoteTypeIcon } from '@/components/note-type-icon'

interface NoteEditorProps {
  note: Note | null
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleFavorite: (id: string) => void
  onOpenQuickCap: () => void
}

export function NoteEditor({
  note,
  onUpdate,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onOpenQuickCap
}: NoteEditorProps) {
  const [copied, setCopied] = useState(false)
  const [copiedUsername, setCopiedUsername] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setShowSecret(false)
    }
  }, [note])

  if (!note) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <div className="size-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4 dark:bg-zinc-800">
          <Sparkles className="size-7" />
        </div>
        <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
          No Note Selected
        </h3>
        <p className="text-xs text-zinc-400 tracking-tight max-w-sm mb-6">
          Select a note from the rapid retrieval stream or create a new quick capture note.
        </p>
        <Button onClick={onOpenQuickCap} variant="pill" size="default">
          + Quick Capture Note
        </Button>
      </Card>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyUsername = () => {
    if (note.credentialData?.username) {
      navigator.clipboard.writeText(note.credentialData.username)
      setCopiedUsername(true)
      setTimeout(() => setCopiedUsername(false), 2000)
    }
  }

  const handleCopySecret = () => {
    if (note.credentialData?.secret) {
      navigator.clipboard.writeText(note.credentialData.secret)
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2000)
    }
  }

  const handleTitleBlur = () => {
    if (title !== note.title) {
      onUpdate(note.id, { title })
    }
  }

  const handleContentBlur = () => {
    if (content !== note.content) {
      onUpdate(note.id, { content })
    }
  }

  return (
    <Card className="h-full flex flex-col justify-between bg-white/90 dark:bg-zinc-900/90 border-zinc-200/70 dark:border-zinc-800/70 rounded-2xl overflow-hidden shadow-xs">
      {/* Editor Header Bar */}
      <CardHeader className="p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Note Type Selector */}
          <div className="flex items-center gap-1.5">
            <NoteTypeIcon type={note.type || 'note'} size="sm" />
            <select
              value={note.type || 'note'}
              onChange={e => onUpdate(note.id, { type: e.target.value as NoteType })}
              className="h-7 rounded-full bg-zinc-100/80 px-2.5 text-[0.72rem] font-semibold tracking-tight text-zinc-800 border-0 focus:ring-1 focus:ring-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-200 cursor-pointer"
            >
              <option value="note">Document / Note</option>
              <option value="credential">🔑 Credential</option>
              <option value="code">💻 Code Snippet</option>
              <option value="finance">💳 Finance & Payout</option>
              <option value="meeting">👥 Meeting Note</option>
              <option value="checklist">☑️ Checklist</option>
              <option value="voice">🎙️ Voice Memo</option>
            </select>
          </div>

          <select
            value={note.status}
            onChange={e => onUpdate(note.id, { status: e.target.value as NoteStatus })}
            className="h-7 rounded-full bg-zinc-100/80 px-2.5 text-[0.72rem] font-semibold tracking-tight text-zinc-800 border-0 focus:ring-1 focus:ring-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-200 cursor-pointer"
          >
            <option value="active">🟢 Active</option>
            <option value="pending">🟡 Pending Setup</option>
            <option value="completed">🔵 Completed</option>
            <option value="archived">⚪ Archived</option>
          </select>

          <select
            value={note.category}
            onChange={e => onUpdate(note.id, { category: e.target.value as NoteCategory })}
            className="h-7 rounded-full bg-zinc-100/80 px-2.5 text-[0.72rem] font-semibold tracking-widest text-zinc-800 border-0 focus:ring-1 focus:ring-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-200 cursor-pointer uppercase"
          >
            <option value="planning">Planning</option>
            <option value="support">Support</option>
            <option value="overview">Overview</option>
            <option value="account">Account</option>
            <option value="ideas">Ideas</option>
            <option value="scratchpad">Scratchpad</option>
          </select>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="pillOutline"
            size="xs"
            onClick={handleCopy}
            className="gap-1 text-[0.72rem] font-medium tracking-tight h-7 px-2.5"
          >
            {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              note.isPinned
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                : 'bg-zinc-100/80 text-zinc-400 hover:text-zinc-700 dark:bg-zinc-800/80 dark:hover:text-zinc-200'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className="size-3.5" />
          </button>

          <button
            onClick={() => onToggleFavorite(note.id)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              note.isFavorite
                ? 'bg-amber-50 text-amber-500 dark:bg-amber-950 dark:text-amber-400'
                : 'bg-zinc-100/80 text-zinc-400 hover:text-amber-500 dark:bg-zinc-800/80'
            }`}
            title={note.isFavorite ? 'Unstar note' : 'Star note'}
          >
            <Star className={`size-3.5 ${note.isFavorite ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-full bg-zinc-100/80 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:bg-zinc-800/80 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Delete Note"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </CardHeader>

      {/* Editor Body Workspace */}
      <CardContent className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Title Input */}
        <div className="flex items-center gap-3">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Note title..."
            className="text-lg font-semibold tracking-tight border-0 bg-transparent px-0 focus:bg-transparent focus:ring-0 focus:border-0 h-auto py-1 text-zinc-900/90 dark:text-zinc-100 flex-1"
          />
        </div>

        {/* Project Tag */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 font-medium tracking-tight text-[0.75rem]">Project:</span>
          <Input
            value={note.projectName || ''}
            onChange={e => onUpdate(note.id, { projectName: e.target.value })}
            placeholder="Assign Project..."
            icon={<Folder className="size-3 text-zinc-400" />}
            className="h-7 text-xs py-0.5 rounded-lg border-0 bg-zinc-100/70 dark:bg-zinc-800/70 max-w-xs font-medium tracking-tight"
          />
        </div>

        {/* SPECIAL CREDENTIAL ACTION CARD */}
        {note.type === 'credential' && (
          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[0.68rem] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="size-3 text-emerald-600" /> Rapid Credential Vault
              </span>
              <span className="text-[0.65rem] text-emerald-600 dark:text-emerald-400 font-mono">1-Click Copy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Username Field */}
              <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-900/50 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[0.62rem] text-zinc-400 uppercase block font-semibold tracking-wider">Username / Email</span>
                  <input
                    type="text"
                    value={note.credentialData?.username || ''}
                    onChange={e =>
                      onUpdate(note.id, {
                        credentialData: { ...note.credentialData, username: e.target.value }
                      })
                    }
                    placeholder="User or Email..."
                    className="w-full text-xs font-mono font-normal text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none"
                  />
                </div>
                <Button
                  variant="pillOutline"
                  size="xs"
                  onClick={handleCopyUsername}
                  className="h-6 px-2 shrink-0 text-[0.68rem] font-medium"
                >
                  {copiedUsername ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  {copiedUsername ? 'Copied' : 'Copy'}
                </Button>
              </div>

              {/* Secret / Key Field */}
              <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-900/50 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[0.62rem] text-zinc-400 uppercase block font-semibold tracking-wider">Secret / API Token</span>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={note.credentialData?.secret || ''}
                    onChange={e =>
                      onUpdate(note.id, {
                        credentialData: { ...note.credentialData, secret: e.target.value }
                      })
                    }
                    placeholder="Secret Key..."
                    className="w-full text-xs font-mono font-normal text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    title={showSecret ? 'Hide key' : 'Show key'}
                  >
                    {showSecret ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                  </button>
                  <Button
                    variant="pillOutline"
                    size="xs"
                    onClick={handleCopySecret}
                    className="h-6 px-2 text-[0.68rem] font-medium"
                  >
                    {copiedSecret ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    {copiedSecret ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Textarea Editor */}
        <div className="space-y-1">
          <label className="text-[0.65rem] font-semibold text-zinc-400 uppercase tracking-widest block">
            Note Contents
          </label>
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onBlur={handleContentBlur}
            placeholder="Write markdown contents here..."
            className="min-h-[220px] font-sans text-[0.84rem] text-zinc-800 dark:text-zinc-200 leading-relaxed tracking-tight border-0 bg-zinc-50/50 focus:bg-white dark:bg-zinc-900/50 dark:focus:bg-zinc-900 p-4 rounded-xl font-normal"
          />
        </div>

        {/* Tags management */}
        <div className="pt-1">
          <label className="text-[0.65rem] font-semibold text-zinc-400 uppercase tracking-widest block mb-1.5">
            Associated Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map(t => (
              <Badge key={t} variant="secondary" size="sm" className="text-[0.68rem] font-medium tracking-tight">
                #{t}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Editor Footer Status */}
      <CardFooter className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 text-[0.7rem] font-medium tracking-tight">
          <Clock className="size-3" />
          <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-zinc-600 dark:text-zinc-400 text-[0.72rem] tracking-tight">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Auto-Saved
        </div>
      </CardFooter>
    </Card>
  )
}
