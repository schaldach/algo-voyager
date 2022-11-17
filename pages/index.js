import Link from 'next/link'
import Image from 'next/image'

export default function Home({changePage}) {
  return (
    <div className="homescreen">
      <div>Este projeto é sobre a visualização de diferentes algoritmos empregados na Ciência da Computação.</div>
      <div className='algorithms'>
        <Link href='/sorting'><div onClick={() => changePage('sorting')}><div className='algoimg'><Image src='/sorting.png' layout='fill' objectFit='cover'/></div>Sorting</div></Link>
        <Link href='/pathfinding'><div onClick={() => changePage('pathfinding')}><div className='algoimg'><Image src='/pathfinding.png' layout='fill' objectFit='cover'/></div>Path Finding</div></Link>
        <Link href='/noise'><div onClick={() => changePage('noise')}><div className='algoimg'><Image src='/noise.png' layout='fill' objectFit='cover'/></div>Geração de Ruídos</div></Link>
      </div>
      <div>Desenvolvido por Schaldach.</div>
    </div>
  )
}
