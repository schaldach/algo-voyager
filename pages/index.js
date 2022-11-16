import Link from 'next/link'

export default function Home({changePage}) {
  return (
    <div className="homescreen">
      <div>Este projeto é sobre a visualização de diferentes algoritmos empregados na Ciência da Computação.</div>
      <div className='algorithms'>
        <Link href='/sorting'><div onClick={() => changePage('sorting')}>Sorting</div></Link>
        <Link href='/pathfinding'><div onClick={() => changePage('pathfinding')}>Path Finding</div></Link>
        <Link href='/noise'><div onClick={() => changePage('noise')}>Geração de Ruídos</div></Link>
      </div>
      <div>Desenvolvido por Schaldach.</div>
    </div>
  )
}
