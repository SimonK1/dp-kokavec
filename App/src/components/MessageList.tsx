import { useMessages } from 'utils/useMessages'
import { useEffect, useRef } from 'react'
import PropertyCard from './PropertyCard'
import { useListings } from 'utils/useMessages'

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()
  const messages2 = useRef<HTMLDivElement | null>(null)
  const { listings } = useListings()

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messages2.current) {
      setTimeout(() => {
        messages2.current!.scrollTop = messages2.current!.scrollHeight
      }, 400) // Slight delay to ensure the element has rendered
    }
  }, [messages])

  return (
    <div
      className="max-w-7xl mx-auto pt-36 pb-0 px-4 md:px-8 py-2 overflow-y-auto max-h-[90vh] scroll-smooth scroll-container"
      ref={messages2}
    >
      {messages?.map((message, i) => {
        const isUser = message.role === 'user'
        if (message.role === 'system') return null

        // Filter listings that have the same messageId as the current message index (i)
        const filteredListings = listings?.filter((listing) => listing.messageId === i)

        return (
          <div key={i}>
            <div
              id={`message-${i}`}
              className={`flex mb-4 fade-up py-4 ${isUser ? 'justify-end' : 'justify-start'} ${
                i === 1 ? 'max-w-2xl' : ''
              }`}
            >
              {!isUser && (
                <img src="/img/agent.png" className="w-9 h-9 rounded-full" alt="avatar" />
              )}
              <div
                className={`group relative py-2  sm:max-w-[calc(100%-50px)] ${
                  isUser
                    ? 'bg-[#E8F2FA] text-zinc-800 shadow-md rounded-[25px] px-6 '
                    : 'ml-4 text-zinc-700 dark:text-zinc-200 px-3 rounded-lg'
                }`}
              >
                {message.content?.trim()}
              </div>
            </div>

            {/* Render the filtered listings below the message */}
            {filteredListings && filteredListings.length > 0 && (
              <div className="mb-4">
                <PropertyCard listings={filteredListings} />
              </div>
            )}
          </div>
        )
      })}

      {isLoadingAnswer && (
        <div className="flex justify-start mb-4">
          <img src="/img/agent.png" className="w-9 h-9 rounded-full" alt="avatar" />
          <div className="loader ml-2 p-2.5 px-4 bg-white rounded-full space-x-1.5 flex justify-between items-center relative">
            <span className="block w-3 h-3 rounded-full bg-zinc-600"></span>
            <span className="block w-3 h-3 rounded-full bg-zinc-600"></span>
            <span className="block w-3 h-3 rounded-full bg-zinc-600"></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesList
