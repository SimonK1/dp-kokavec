import { useToast } from '@apideck/components'
import { ChatCompletionRequestMessage } from 'openai'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'

interface ContextProps {
  messages: ChatCompletionRequestMessage[]
  addMessage: (content: string, id: number) => Promise<void>
  isLoadingAnswer: boolean
}

interface Listing {
  messageId: number
  address: string;
  image_url: string;
  price: string;
  price_per_m: string;
  size: string;
  title: string;
  type: string;
  listingId: string;
  _additional:string;
}

interface ListingsContextProps {
  listings: Listing[] | null;
  setListings: React.Dispatch<React.SetStateAction<Listing[] | null>>;
  addListing: (content: Listing, id:number) => Promise<void>;  // Update the type to accept a Listing object
  deleteListings: () => Promise<void>; 
}

const ChatsContext = createContext<Partial<ContextProps>>({})
const ListingsContext = createContext<ListingsContextProps | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[] | null>(null);  // Initialize as null
  
  const addListing = async (content: Listing | Listing[], id:number) => {
    try {
      // Ensure content is always an array, whether it's a single listing or multiple
      const listingsToAdd = Array.isArray(content) ? content : [content];
  
      
      // Decode each listing and ensure all string fields are utf-8 decoded
      const decodedListings = listingsToAdd.map((listing) => {
        return {
          ...listing,
          messageId: id,
          title: listing.title,
          address: listing.address,
          image_url: listing.image_url,
          price: listing.price,
          price_per_m: listing.price_per_m,
          size: listing.size,
          type: listing.type,
          listing_id: listing.listingId,
          certainty: listing._additional
        };
      });
  
      // Update the listings state by adding the new decoded listings
      setListings((prevListings) => {
        return prevListings ? [...prevListings, ...decodedListings] : [...decodedListings];
      });
  
      console.log('Listings added successfully (decoded in utf-8):', decodedListings);
    } catch (error) {
      console.error('Error adding listings:', error);
    }
  };

  const deleteListings = async () => {
    try {
      // Set the listings state to an empty array to remove all listings
      setListings([]);
  
      console.log('All listings deleted successfully');
    } catch (error) {
      console.error('Error deleting listings:', error);
    }
  };
  


  return (
    <ListingsContext.Provider value={{ listings, setListings, addListing, deleteListings }}>
      {children}
    </ListingsContext.Provider>
  );
}

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  
  const { addListing } = useListings();
  
  useEffect(() => {
    const initializeChat = () => {
      const systemMessage: ChatCompletionRequestMessage = {
        role: 'system',
        content: 'Ste ChatGPT, veľký jazykový model vyškolený OpenAI.'
      }
      const welcomeMessage: ChatCompletionRequestMessage = {
        role: 'assistant',
        content: 'Ahoj, ako ti dnes môžem pomôcť?'
      }
      setMessages([systemMessage, welcomeMessage])
    }

    // When no messages are present, we initialize the chat the system message and the welcome message
    // We hide the system message from the user in the UI
    if (!messages?.length) {
      initializeChat()
    }
  }, [messages?.length, setMessages])



  const addMessage = async (content: string, id:number) => {
    setIsLoadingAnswer(true)

    try {
      const newMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content
      }
      const newMessages = [...messages, newMessage]

      // Add the user message to the state so we can see it immediately
      setMessages(newMessages)

      const { data, returned_listings = null } = await sendMessage(newMessages)
      const reply = data.choices[0].message

      console.log(returned_listings)
      if (returned_listings != null) {
        await addListing(returned_listings, id); 
      }

      // Add the assistant message to the state
      setMessages([...newMessages, reply])
    } catch (error) {
      // Show error when something goes wrong
      addToast({ title: 'An error occurred', type: 'error' })
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}
