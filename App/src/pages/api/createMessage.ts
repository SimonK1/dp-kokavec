import { NextApiRequest, NextApiResponse } from 'next'
import weaviate, { WeaviateClient } from 'weaviate-ts-client'

const client: WeaviateClient = weaviate.client({
  scheme: 'http', 
  host: '147.175.146.250:8080', 
  headers: {
    'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || ''
  }
})

interface WeaviateResponse {
  data: any
  errors?: any
}

export default async function createMessage(req: NextApiRequest, res: NextApiResponse) {

  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { messages } = req.body // Extract messages from the request body
  const apiKey = process.env.OPENAI_API_KEY

  // Check if the API key is present
  if (!apiKey) {
    console.error('API key is missing')
    return res.status(500).json({ error: 'OpenAI API key is not configured' })
  }

  // Step 1: Define the function schema for real estate search
  const functionDefinition = [
    {
      name: 'semanticSearchRealEstateListings',
      description:
        "Extracts if possible structured information from a user's real estate search query, including property type, location, budget, bedrooms, and amenities.",
      parameters: {
        type: 'object',
        properties: {
          type_of_property: {
            type: 'string',
            description:
              'Type of property (e.g., Apartmán, Vila, Rodinný dom, Byt, Pozemok, 1-Izbový byt, 2-Izbový byt, 3-Izbový byt, 4-Izbový byt, 5-Izbový byt).'
          },
          size_of_property: {
            type: 'object',
            description:
              'Size of the property, including type (exact, range, or approximate) and values.',
            properties: {
              type: {
                type: 'string',
                enum: ['exact', 'range', 'approximate'],
                description:
                  'Specifies whether the size is an exact value, a range, or an approximate size.'
              },
              min_size: {
                type: 'integer',
                nullable: true,
                description: 'Minimum size in square feet or square meters (only for range type).'
              },
              max_size: {
                type: 'integer',
                nullable: true,
                description: 'Maximum size in square feet or square meters (only for range type).'
              },
              size: {
                type: 'integer',
                nullable: true,
                description: 'Exact or approximate size value.'
              },
              unit: {
                type: 'string',
                enum: ['sqft', 'sqm', 'm²'],
                description: 'Unit of measurement (square feet, square meters, etc.).'
              }
            }
          },
          price: {
            type: 'object',
            description:
              'Price details for the property search, including type (exact, range, or approximate) and values.',
            properties: {
              type: {
                type: 'string',
                enum: ['exact', 'range', 'approximate'],
                description:
                  'Specifies whether the price is an exact value, a range, or an approximate value.'
              },
              min_price: {
                type: 'number',
                nullable: true,
                description: 'Minimum price (only for range type).'
              },
              max_price: {
                type: 'number',
                nullable: true,
                description: 'Maximum price (only for range type).'
              },
              price: {
                type: 'number',
                nullable: true,
                description: 'Exact or approximate price value.'
              }
            }
          },
          price_per_mont: {
            type: 'object',
            description:
              'Price per month for the property search if we are talking about rent, including type (exact, range, or approximate) and values.',
            properties: {
              type: {
                type: 'string',
                enum: ['exact', 'range', 'approximate'],
                description:
                  'Specifies whether the price is an exact value, a range, or an approximate value.'
              },
              min_price: {
                type: 'number',
                nullable: true,
                description: 'Minimum price (only for range type).'
              },
              max_price: {
                type: 'number',
                nullable: true,
                description: 'Maximum price (only for range type).'
              },
              price: {
                type: 'number',
                nullable: true,
                description: 'Exact or approximate price value.'
              }
            }
          },
          location: {
            type: 'string',
            description: 'The city, neighborhood, or region where the user wants the property.'
          },
          response_for_user: {
            type: 'string',
            description: 'A user-friendly response summarizing the extracted details.'
          },
          query: {
            type: 'string',
            description:
              'Vyhľadávací dopyt na nájdenie nehnuteľností pomocou kľúčových slov a ich synoným. Ak sa dá extraktuj typ inzerátu alebo typ nehnuteľnosti(pozemok, byt, rodinný dom...)'
          }
        },
        required: ['query']
      }
    }
  ]

  // Step 2: Make a request to OpenAI to refine the user's search query and identify if a function should be called
  try {
    const refinedQueryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4o-mini', 
        functions: functionDefinition,
        function_call: 'auto' // Determine if function calling is required
      })
    })

    if (!refinedQueryResponse.ok) {
      const errorData = await refinedQueryResponse.json()
      return res.status(refinedQueryResponse.status).json({ error: errorData })
    }

    const refinedQueryData = await refinedQueryResponse.json()
    const responseMessage = refinedQueryData.choices[0].message

    // Step 3: Check if the function call was suggested by OpenAI
    if (
      responseMessage.function_call &&
      responseMessage.function_call.name === 'semanticSearchRealEstateListings'
    ) {
      const functionArgs = JSON.parse(responseMessage.function_call.arguments)
      const { query } = functionArgs

      const functionCall = refinedQueryData.choices[0]?.message?.function_call
      const extractedDetails = JSON.parse(functionCall.arguments)
      console.log('Query:', query)

      console.log('Extracted properties:', extractedDetails)

      try {
        console.log('Received query from OpenAI:', query)

        const whereOperands: Array<{
          operator: 'Like' | 'Equal' | 'GreaterThanEqual' | 'LessThanEqual' | 'And'
          path: string[]
          valueString?: string
          valueText?: string
          valueNumber?: number
          operands?: any[]
        }> = []

        if (extractedDetails['type_of_property']) {
          whereOperands.push({
            operator: 'Like',
            path: ['type_of_property'],
            valueString: '%' + extractedDetails['type_of_property'] + '%'
          })
        }

        // Ensure location filter
        if (extractedDetails['location']) {
          whereOperands.push({
            operator: 'Like',
            path: ['address'],
            valueString: '%' + extractedDetails['location'] + '%'
          })
        }

        // Ensure size filter (only if size_of_property exists)
        if (
          extractedDetails.size_of_property &&
          extractedDetails.size_of_property['size'] &&
          extractedDetails.size_of_property['size'] != 0
        ) {
          const sizeData = extractedDetails.size_of_property

          if (sizeData.type === 'exact') {
            whereOperands.push({
              operator: 'Equal',
              path: ['size_of_property'],
              valueNumber: sizeData.size
            })
          } else if (sizeData.type === 'range' && sizeData.min_size) {
            whereOperands.push({
              operator: 'GreaterThanEqual',
              path: ['size_of_property'],
              valueNumber: sizeData.min_size
            })
          } else if (sizeData.type === 'range' && sizeData.max_size) {
            whereOperands.push({
              operator: 'LessThanEqual',
              path: ['size_of_property'],
              valueNumber: sizeData.max_size
            })
          } else if (sizeData.type === 'approximate') {
            // Add ±10% tolerance for approximate values
            const tolerance = Math.round(sizeData.size * 0.1)
            whereOperands.push({
              operator: 'GreaterThanEqual',
              path: ['size_of_property'],
              valueNumber: sizeData.size - tolerance
            })
            whereOperands.push({
              operator: 'LessThanEqual',
              path: ['size_of_property'],
              valueNumber: sizeData.size + tolerance
            })
          }
        }

        // Ensure price filter (only if price exists)
        if (extractedDetails.price) {
          const priceData = extractedDetails.price

          if (priceData.type === 'exact') {
            whereOperands.push({
              operator: 'Equal',
              path: ['price'],
              valueNumber: priceData.price
            })
          } else if (priceData.type === 'range' && priceData.min_price) {
            whereOperands.push({
              operator: 'GreaterThanEqual',
              path: ['price'],
              valueNumber: priceData.min_price
            })
          } else if (priceData.type === 'range' && priceData.max_price) {
            whereOperands.push({
              operator: 'LessThanEqual',
              path: ['price'],
              valueNumber: priceData.max_price
            })
          } else if (priceData.type === 'approximate') {
            // Add ±10% tolerance for approximate values
            const tolerance = Math.round(priceData.price * 0.1)
            whereOperands.push({
              operator: 'GreaterThanEqual',
              path: ['price'],
              valueNumber: priceData.price - tolerance
            })
            whereOperands.push({
              operator: 'LessThanEqual',
              path: ['price'],
              valueNumber: priceData.price + tolerance
            })
          }
        }

        // Ensure price filter (only if price exists)
        if (extractedDetails.price_per_month) {
          const priceData = extractedDetails.price_per_mont

          if (priceData.type === 'exact') {
            whereOperands.push({
              operator: 'Equal',
              path: ['price_per_month'],
              valueNumber: priceData.price
            })
          } else if (priceData.type === 'range' && priceData.min_price) {
            whereOperands.push({
              operator: 'GreaterThanEqual',
              path: ['price_per_month'],
              valueNumber: priceData.min_price
            })
          } else if (priceData.type === 'range' && priceData.max_price) {
            whereOperands.push({
              operator: 'LessThanEqual',
              path: ['price_per_month'],
              valueNumber: priceData.max_price
            })
          } else if (priceData.type === 'approximate') {
            // Add ±10% tolerance for approximate values
            const tolerance = Math.round(priceData.price * 0.1)
            whereOperands.push({
              operator: 'GreaterThanEqual',
              path: ['price_per_month'],
              valueNumber: priceData.price - tolerance
            })
            whereOperands.push({
              operator: 'LessThanEqual',
              path: ['price_per_month'],
              valueNumber: priceData.price + tolerance
            })
          }
        }

        console.log(whereOperands)

        // Step 4: Use the Weaviate client to search for real estate listings based on the query
        const weaviateResponse: WeaviateResponse = await client.graphql
          .get()
          .withClassName('RealEstateListings') 
          .withFields(
            'listing_id title address type_of_property size_of_property price price_per_m price_per_month price_per_m_per_month description_text chunk_index image url transaction_type clean_phone_number _additional { score }'
          )
          .withWhere({
            operator: 'And',
            operands: whereOperands
          })
          .withHybrid({
            query: query, // Semantic search query
            alpha: 0.5 // Balance between keyword and vector search
          })
          .withLimit(10)
          .do()

        // Step 5: Summarize the results using OpenAI
        const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'Napíš malú odpoveď ktorú vsunieme pred nájdené nehnuteľnosti'
              },
              { role: 'user', content: JSON.stringify(weaviateResponse.data) }
            ],
            model: 'gpt-4o-mini' 
          })
        })

        if (!summaryResponse.ok) {
          const summaryErrorData = await summaryResponse.json()
          console.error('OpenAI summarization error:', summaryErrorData)
          return res.status(summaryResponse.status).json({ error: summaryErrorData })
        }

        const data = await summaryResponse.json()
        const returned_listings_tmp = weaviateResponse.data.Get.RealEstateListings

        const returned_listings = returned_listings_tmp.reduce(
          (acc: { listing_id: any }[], current: { listing_id: any }) => {
            const isDuplicate = acc.some(
              (listing: { listing_id: any }) => listing.listing_id === current.listing_id
            )
            if (!isDuplicate) {
              acc.push(current)
            }
            return acc
          },
          []
        )

        console.log(returned_listings)

        // Step 6: Return both the summary and the raw search data to the user
        return res.status(200).json({
          data,
          returned_listings
        })
      } catch (error: any) {
        console.error('Error in Weaviate search:', error)
        return res.status(500).json({ error: error.message })
      }
    }

    const data = refinedQueryData
    return res.status(200).json({ data })
  } catch (error: any) {
    console.error('Error during OpenAI API call:', error)
    return res.status(500).json({ error: error.message })
  }
}
