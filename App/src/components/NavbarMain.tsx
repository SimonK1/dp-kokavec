'use client'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function NavbarMain() {
  const [open, setOpen] = useState(false)
  return (
    <header className="top-0">
      <nav
        aria-label="Global"
        className="flex items-end align-end lg:items-center lg:align-center justify-between p-6 px-8 lg:px-12 pt-10 absolute z-10 w-full"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex">
            <p className="text-white text-2xl ml-4">Realia</p>
          </a>
          <p className="mt-1 text-white px-6 py-2 text-xs lg:text-xs self-center rounded-full ml-8 lg:ml-24 hidden lg:block">
            O -- Produkt je momentálne v uzavretej verzii alfa -- O
          </p>
        </div>

        <div className="flex lg:flex-1 lg:justify-end">
          <a
            href="/feedback"
            className="flex justify-center align-end items-center text-sm lg:text-sm leading-6 bg-none text-white rounded-full mr-2 lg:mr-8"
          >
            Zanechať feedback
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="ml-2 w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex justify-center align-end items-end ml-4 text-sm leading-6 rounded-full -mb-1 lg:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-[#1F2028] py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-end justify-end">
                      <div className="ml-3 flex h-7 items-end">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon
                            aria-hidden="true"
                            className="h-6 w-6 text-white hover:text-zinc-200"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-8 flex-1 px-4 sm:px-12">
                    <p className="font-light text-2xl leading-6 text-white">Jednoduchý návod</p>
                    <p className="font-light text-sm leading-6 text-zinc-500 pt-8">
                      Vitajte v našej realitnej chatovacej aplikácii! Stačí napísať, čo hľadáte –
                      napríklad „2-izbový byt v Košiciach do 150 000 €“ alebo „dom so záhradou v
                      tichej lokalite“. Asistent porozumie vašej požiadavke, opýta sa na chýbajúce
                      informácie a zobrazí vám najvhodnejšie nehnuteľnosti podľa vašich preferencií.
                    </p>
                    <p className="font-light text-sm leading-6 text-zinc-500 pt-4">
                      Kedykoľvek počas rozhovoru môžete upraviť alebo doplniť svoje požiadavky –
                      napríklad zmeniť lokalitu, cenu alebo typ nehnuteľnosti. Asistent si pamätá
                      kontext konverzácie, takže nemusíte všetko opakovať. Jednoducho pokračujte v
                      chatovaní a objavte ponuky šité na mieru.
                    </p>
                    <a
                      href="/feedback"
                      className="flex justify-start align-end items-center text-sm lg:text-sm leading-6 bg-none text-white rounded-full pt-8 hover:text-zinc-200"
                    >
                      Zanechajte cennú spätnú väzbu
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.2"
                        stroke="currentColor"
                        className="ml-2 w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </a>
                    <a
                      href="/chat"
                      className=" flex items-center bg-white text-black text-center justify-center rounded-full text-lg hover:bg-zinc-200 py-2 px-10 mt-8"
                      type="submit"
                    >
                      Prejdite na chat
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="ml-2 w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </header>
  )
}
