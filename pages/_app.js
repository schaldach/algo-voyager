import '../styles/index.css'
import NavBar from '../components/Navbar'
import React, {useState} from 'react'

function MyApp({ Component, pageProps }) {
  const[darkMode, setDark] = useState(false)
  return (
  <>
  <div className='pagelayout' data-theme={darkMode?'dark':'light'}>
    <NavBar/>
    <main>
      <Component {...pageProps} />
    </main>
  </div>
  </>)
}

export default MyApp
