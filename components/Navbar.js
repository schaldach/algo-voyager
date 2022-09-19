import Link from 'next/link'
import React, {useState} from 'react';

function NavBar() {
    const[selectedPage, changePage] = useState('introduction')
    return (
        <div className="navbar">
            <Link href='/'><div onClick={() => changePage('introduction')} className={selectedPage==='introduction'?'selectednav':''}>Introdução</div></Link>
            <Link href='/sorting'><div onClick={() => changePage('sorting')} className={selectedPage==='sorting'?'selectednav':''}></div>Sorting</Link>
            <Link href='/pathfinding'><div onClick={() => changePage('pathfinding')} className={selectedPage==='pathfinding'?'selectednav':''}>Path Finding</div></Link>
        </div>
    );
}

export default NavBar;