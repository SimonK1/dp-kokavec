import NavbarMain from '../components/NavbarMain'
import HomePage from 'components/HomePage'
import { NextPage } from 'next'
import { MessagesProvider } from 'utils/useMessages'
import { ListingsProvider } from 'utils/useMessages'
import Layout from '../components/Layout'

const IndexPage: NextPage = () => {
  return (
    <ListingsProvider>
      <MessagesProvider>
        <Layout>
          <NavbarMain />
          <HomePage />
        </Layout>
      </MessagesProvider>
    </ListingsProvider>
  )
}

export default IndexPage
