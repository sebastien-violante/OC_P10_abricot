'use client'

import { trackDynamicHoleInStaticShell } from 'next/dist/server/app-render/dynamic-rendering';
import Cookies from "js-cookie"


export default function Login() {
    
    // Récupération du token dans les cookies
    const token = Cookies.get('token');
    console.log(token);

    return (
        <p>Dashboard</p>
    )
}