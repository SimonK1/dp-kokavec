'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PropertyCardProps {
  listings: any[] // Adjust type based on your actual listings data type
}

export default function PropertyCard({ listings }: PropertyCardProps) {
  const [selectedListing, setSelectedListing] = useState<any | null>(null)

  const openOverlay = (listing: any) => {
    setSelectedListing(listing)
  }

  const closeOverlay = () => {
    setSelectedListing(null)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="min-w-full px-4 md:px-8 pt-10">
              {listings
                .filter((listing) => listing._additional.score * 100 >= 0) // Filter only listings with score > 50
                .map((listing) => {
                  return (
                    <div key={listing.title}>
                      <div className="shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)] bg-[#FBFBFB] md:pr-3 text-sm sm:pl-0 rounded-xl relative flex flex-col mb-12 transition-all duration-300">
                        {/* Score Badge */}
                        <div className="absolute top-0 right-12 md:right-0 flex justify-center items-center bg-[#FBFBFB] w-16 h-16 rounded-full -mr-8 -mt-8 shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]">
                          <p
                            className={`whitespace-nowrap px-3 py-5 text-base ${
                              listing._additional.score * 100 > 80
                                ? 'text-green-500'
                                : listing._additional.score * 100 >= 60
                                ? 'text-orange-500'
                                : 'text-red-500'
                            }`}
                          >
                            {(listing._additional.score * 100).toFixed(0)}%
                          </p>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-4 right-32 md:right-24 flex justify-center items-center bg-[#FBFBFB] w-32 h-8 rounded-full -mr-8 -mt-8 shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]">
                          <p className={`whitespace-nowrap px-3 py-5 text-base text-zinc-700`}>
                            {listing.transaction_type.charAt(0).toUpperCase() +
                              listing.transaction_type.slice(1)}
                          </p>
                        </div>

                        {/* Main Content */}
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="h-48 w-full md:w-48 flex-shrink-0">
                            <img
                              alt=""
                              src={listing.image}
                              className="h-48 w-full md:w-48 rounded-md object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-col md:flex-row items-center justify-between w-full grid grid-cols-12">
                            <div className="px-4 md:px-0 pt-8 md:pt-0 md:ml-8 col col-span-12 md:col-span-6">
                              <div className="text-zinc-400 mb-1 text-xs">
                                <p>{listing.type_of_property}</p>
                              </div>
                              <div className="font-semibold text-zinc-900 text-xl">
                                {listing.title.length > 30
                                  ? `${listing.title.substring(0, 30)}...`
                                  : listing.title}
                              </div>
                              <div className="text-zinc-500">
                                {listing.address.length > 30
                                  ? `${listing.address.substring(0, 30)}...`
                                  : listing.address}
                              </div>
                            </div>

                            {/* Property Size */}
                            <div className="ml-4 col col-span-6 md:col-span-2 text-lg mt-4 md:mt-0">
                              <p>
                                {listing.size_of_property > 0
                                  ? `${listing.size_of_property}m²`
                                  : 'Neurčené'}
                              </p>
                            </div>

                            {/* Price */}
                            <div className="ml-4 col col-span-6 md:col-span-3 text-lg mt-4 md:mt-0">
                              {listing.transaction_type === 'predaj' ? (
                                <p>
                                  {listing.price && listing.price !== 1
                                    ? `${listing.price.toLocaleString('sk-SK', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                      })} €`
                                    : 'Cena dohodou'}
                                </p>
                              ) : (
                                <p>
                                  {listing.price_per_month && listing.price_per_month !== 1
                                    ? `${listing.price_per_month.toLocaleString('sk-SK', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                      })} €`
                                    : 'Cena dohodou'}
                                </p>
                              )}
                            </div>

                            {/* Toggle Button */}
                            <button
                              className="bg-[#2A2A2D] rounded-full col col-span-1 col-start-10 md:col-start-auto h-12 w-12 p-4 mb-4 ml-4 mt-4 md:mt-0"
                              onClick={() => openOverlay(listing)} // Toggle for the clicked listing
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="rgba(255,255,255,1)"
                              >
                                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedListing} onClose={closeOverlay} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-[#FFFFFF] py-8 shadow-xl px-8">
                  <div className="pb-8">
                    <div className="flex items-center justify-between">
                      <h2 id="slide-over-heading" className="text-2xl font-semibold text-gray-900">
                        Detail
                      </h2>
                      <div className="ml-3 flex items-end">
                        <button
                          type="button"
                          onClick={closeOverlay}
                          className="absolute relative bg-black w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                  {selectedListing && (
                    <div>
                      <div className="pb-1 sm:pb-6">
                        <div>
                          <div className="relative h-56 sm:h-96 rounded-md">
                            <img
                              alt=""
                              src={selectedListing.image}
                              className="absolute size-full object-cover rounded-md"
                            />
                            {/* Type Badge */}
                            <div className="absolute bottom-4 right-32 md:right-32 flex justify-center items-center bg-[#FBFBFB] w-32 h-8 rounded-full -mr-8 -mt-8 shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]">
                              <p className={`whitespace-nowrap px-3 py-5 text-base text-zinc-700`}>
                                {selectedListing.transaction_type.charAt(0).toUpperCase() +
                                  selectedListing.transaction_type.slice(1)}
                              </p>
                            </div>
                            {/* Score Badge */}
                            <div className="absolute bottom-4 right-12 md:right-12 flex justify-center items-center bg-[#FBFBFB] w-16 h-16 rounded-full -mr-8 -mt-8 shadow-[0_0px_20px_0px_rgba(0,0,0,0.15)]">
                              <p
                                className={`whitespace-nowrap px-3 py-5 text-base ${
                                  selectedListing._additional.score * 100 > 80
                                    ? 'text-green-500'
                                    : selectedListing._additional.score * 100 >= 60
                                    ? 'text-orange-500'
                                    : 'text-red-500'
                                }`}
                              >
                                {(selectedListing._additional.score * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 sm:mt-8 sm:flex sm:items-end relative">
                            <div className="sm:flex-1">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                    {selectedListing.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-500 pt-2">
                                  {selectedListing.type_of_property}
                                </p>
                              </div>
                              <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                                <a
                                  href={`tel:` + selectedListing.clean_phone_number}
                                  type="button"
                                  className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                                >
                                  Zavolať
                                </a>
                                <a
                                  href={selectedListing.url}
                                  type="button"
                                  className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                  Navštíviť inzerát
                                </a>
                                <div className="ml-3 inline-flex sm:ml-0"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pb-5 pt-5 sm:pt-0">
                        <dl className="space-y-8 sm:space-y-6 ">
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                              Popis
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              <p>{selectedListing.description_text}</p>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                              Lokalita
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {selectedListing.address}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                              Rozloha
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {(selectedListing.size_of_property === 0 || selectedListing.size_of_property === 1 || selectedListing.size_of_property === null)
                                ? 'Neurčené'
                                : `${selectedListing.size_of_property}m²`}
                            </dd>

                          </div>
                            {selectedListing.transaction_type === 'prenájom' ? (
                              <>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                                    Cena / mesiac
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    {selectedListing.price_per_month && selectedListing.price_per_month !== 1
                                      ? `${selectedListing.price_per_month}€`
                                      : 'Cena dohodou'}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                                    Cena za m² / mesiac
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    {selectedListing.price_per_month_per_m && selectedListing.price_per_month_per_m !== 1
                                      ? `${selectedListing.price_per_month_per_m}€`
                                      : 'Cena dohodou'}
                                  </dd>
                                </div>
                              </>
                                  ) : (
                                    <>
                                      <div>
                                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                                          Cena
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                          {selectedListing.price && selectedListing.price !== 1
                                            ? `${selectedListing.price}€`
                                            : 'Cena dohodou'}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0">
                                          Cena za m²
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                          {selectedListing.price_per_m && selectedListing.price_per_m !== 1
                                            ? `${selectedListing.price_per_m}€`
                                            : 'Cena dohodou'}
                                        </dd>
                                      </div>
                                    </>
                                  )}

                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
