import '../styles/index.css'
import NavBar from '../components/Navbar'
import Head from 'next/head'
import React, {useState} from 'react'

function MyApp({ Component, pageProps }) {
  const[darkMode, setDark] = useState(false)
  return (
  <>
  <Head>
    <title>Algoritmos</title>
  </Head>
  <div className='pagelayout' data-theme={darkMode?'dark':'light'}>
    <NavBar/>
    <main>
      <Component {...pageProps} />
    </main>
  </div>
  </>)
}

export default MyApp
