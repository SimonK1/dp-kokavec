import { useState, useRef } from 'react'
import { useMessages } from 'utils/useMessages'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import DropUp from './DropUp'

const MessageForm = () => {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { addMessage } = useMessages()
  const router = useRouter()
  const { query } = router.query
  const { messages } = useMessages()

  useEffect(() => {
    if (router.isReady && query != null && query != undefined && query != '') {
      // Delay of 2 seconds (2000 milliseconds)
      const timer = setTimeout(() => {
        addMessage(query as string, 1)
        router.replace('/chat', undefined, { shallow: true })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [router.isReady])

  const handleSubmit = async (e?: any) => {
    e?.preventDefault()
    addMessage(content, messages.length + 1)
    setContent('')
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' 
      textarea.style.overflowY = 'hidden' 
    }
  }

  // Handle keypress to send on Enter (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() 
      handleSubmit() 
    }
  }

  // Resize the textarea dynamically based on content
  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' 
      textarea.style.height = `${textarea.scrollHeight}px` 
      if (textarea.scrollHeight > 7 * parseFloat(getComputedStyle(textarea).lineHeight)) {
        textarea.style.overflowY = 'scroll' 
      } else {
        textarea.style.overflowY = 'hidden'
      }
    }
  }

  return (
    <div className="bg-gradient-to-t from-white from 30% via-white via-50% pb-6 lg:pb-12 rounded-[45px]">
      <div className="max-w-4xl mx-auto flex pt-8 justify-center">
        <DropUp />
        <form
          className="md:ms-4 relative max-w-2xl w-full rounded-t-xl px-4 md:px-0 z-10"
          onSubmit={handleSubmit}
        >
          <div className="bg-white px-4 ring-1 ring-zinc-300/40 flex items-center rounded-[25px] shadow-md relative">
            <label htmlFor="content" className="sr-only">
              Vaša správa
            </label>
            <textarea
              name="content"
              placeholder="Tu popíšte svoju nehnuteľnosť..."
              rows={1}
              value={content}
              autoFocus
              ref={textareaRef}
              required
              onChange={(e: any) => {
                setContent(e.target.value)
                handleInput()
              }}
              className="font-light resize-none w-full rounded-[25px] !p-3 text-zinc-900 border-0 focus:outline-0 focus:ring-0 dark:text-white dark:placeholder-zinc-400 dark:bg-zinc-800/80 backdrop-blur shadow-none"
              onKeyDown={handleKeyDown}
              style={{ maxHeight: 'calc(7 * 1.5em)' }}
            />
            <div className="hidden md:block">
              <div className="flex h-full items-end align-end space-x-3">
                <button
                  className="bg-black text-white rounded-full text-sm hover:bg-zinc-800 py-2 px-6"
                  type="submit"
                >
                  Odoslať
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <p className="text-xs text-zinc-400 pt-3 text-center">
              {' '}
              Naša AI môže robiť chyby. Vždy si skontrolujte dôležité informácie.{' '}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageForm
