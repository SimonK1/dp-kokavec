import Navbar from '../components/Navbar'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import Feedback from '../components/Feedback'

const FeedbackPage: NextPage = () => {
  return (
        <Layout>
          <Navbar />
          <Feedback />
        </Layout>
    
  )
}

export default FeedbackPage
