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
            <Link href='/'><div onClick={() => changePage('')} className={selectedPage===''?'selectednav':''}>Introdução</div></Link>
            <Link href='/sorting'><div onClick={() => changePage('sorting')} className={selectedPage==='sorting'?'selectednav':''}>Sorting</div></Link>
            <Link href='/pathfinding'><div onClick={() => changePage('pathfinding')} className={selectedPage==='pathfinding'?'selectednav':''}>Path Finding</div></Link>
            <Link href='/noise'><div onClick={() => changePage('noise')} className={selectedPage==='noise'?'selectednav':''}>Gerador de Ruído</div></Link>
        </div>
    );
}

export default NavBar;