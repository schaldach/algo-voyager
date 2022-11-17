import Link from 'next/link'
import Router from 'next/router';
import React, {useEffect, useState} from 'react';

function NavBar({selectedPage, changePage}) {
    useEffect(() => {
        const router = Router
        let {pathname} = router
        changePage(pathname.substring(1, pathname.length))
    }, [])

    return (
        <div className="navbar">
            <Link href='/'><div onClick={() => changePage('')} className={selectedPage===''?'selectednav':''}><div>Introdução</div></div></Link>
            <Link href='/sorting'><div onClick={() => changePage('sorting')} className={selectedPage==='sorting'?'selectednav':''}><div>Sorting</div></div></Link>
            <Link href='/pathfinding'><div onClick={() => changePage('pathfinding')} className={selectedPage==='pathfinding'?'selectednav':''}><div>Path Finding</div></div></Link>
            <Link href='/noise'><div onClick={() => changePage('noise')} className={selectedPage==='noise'?'selectednav':''}><div>Gerador de Ruído</div></div></Link>
        </div>
    );
}

export default NavBar;