import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>stardew.app</title>
        <meta name="description" content="Keep track of your stardew progression." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>stardew.app</h1>
      </main>
    </div>
  )
}

export default Home
