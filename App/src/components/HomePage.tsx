import { useState, useRef } from 'react'
import { useRouter } from 'next/router'

const HomePage = () => {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const router = useRouter()

  const handleSubmit = async (e?: any) => {
    e?.preventDefault()

    router.push({
      pathname: '/chat',
      query: { query: content } 
    })
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
    <div className="bg-[#1F2028] h-dvh overflow-y-hidden">
      <img
        className="h-dvh w-full object-cover p-2 rounded-[25px] brightness-[0.70] backdrop-blur-md"
        src="img/titleImage.jpg"
      />

      <div className="px-4 lg:px-0 w-full lg:w-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center font-semibold">
        <p className="text-3xl pt-16 lg:pt-0 lg:text-7xl text-white font-thin uppercase tracking-tight">
          Prvá AI platforma
          <br />
          pre nehnuteľnosti
        </p>

        <form
          className="relative mx-auto max-w-4xl rounded-t-xl mb-12 px-4 md:px-0 pt-8"
          onSubmit={handleSubmit}
        >
          <div className="backdrop-blur-md bg-white dark:bg-[#1F2028] bg-opacity-50  px-4 ring-1 ring-zinc-300/40 flex items-center rounded-[25px] shadow-md">
            <label htmlFor="content" className="sr-only">
              Vaša správa
            </label>
            <textarea
              name="content"
              placeholder="Popíšte svoju nehnuteľnosť tu..."
              rows={1}
              value={content}
              autoFocus
              ref={textareaRef}
              required
              onChange={(e: any) => {
                setContent(e.target.value)
                handleInput()
              }}
              className="bg-white bg-opacity-0 text-black dark:text-white font-light font-light resize-none w-full rounded-[25px] !p-3 border-0 focus:outline-0 focus:ring-0 dark:text-white placeholder-zinc-700 dark:placeholder-zinc-400 shadow-none"
              onKeyDown={handleKeyDown} 
              style={{ maxHeight: 'calc(7 * 1.5em)' }}
            />
            <div className="hidden lg:block">
              <div className="flex h-full items-end align-end space-x-3">
                <button
                  className="bg-[#1F2028] lg:bg-black text-black lg:text-white font-light rounded-full text-sm hover:bg-zinc-800 py-2 px-6"
                  type="submit"
                >
                  Odoslať
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 block lg:hidden">
            <div className="flex h-full items-end align-end space-x-3">
              <button
                className="bg-[#1F2028] lg:bg-black text-white lg:text-white  font-light rounded-full text-sm hover:bg-zinc-800 py-2 px-6"
                type="submit"
              >
                Odoslať
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full absolute bottom-10 text-center">
        <p className="text-xs text-[#DBDBDB] pt-3 font-light px-4">
          {' '}
          Naša AI môže robiť chyby. Vždy si skontrolujte dôležité informácie.
        </p>
      </div>
    </div>
  )
}

export default HomePage
