import '../styles/index.css'
import NavBar from '../components/Navbar'
import Head from 'next/head'
import React, {useState} from 'react'

function MyApp({ Component, pageProps }) {
  const[darkMode, setDark] = useState(false)
  const[selectedPage, changePage] = useState(null)
  return (
  <>
  <Head>
    <title>Algoritmos</title>
  </Head>
  <div className='pagelayout' data-theme={darkMode?'dark':'light'}>
    <NavBar selectedPage={selectedPage} changePage={changePage}/>
    <main>
      <Component changePage={changePage} {...pageProps} />
    </main>
  </div>
  </>)
}

export default MyApp
