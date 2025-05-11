import Head from 'next/head'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title?: string
  description?: string
  favicon?: string
}

const Layout = ({
  children,
  title = 'Realia - AI powered search',
  description = 'Realia is an AI powered real estate searching platform that makes indexing and searching easy',
  favicon = '/img/favicon.png'
}: Props) => (
  <div className="font-basier-circle h-dvh">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href={favicon} />
      <meta name="theme-color" content="#1F2028" />
    </Head>
    <div className="h-dvh overflow-y-hidden">{children}</div>
  </div>
)

export default Layout
