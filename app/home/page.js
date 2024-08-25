"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNav from '../../components/SideNav';
import Timeline from '../../components/Timeline';
import Hugoteros from '../../components/Hugoteros';

export default function Homepage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
            // Redirect to login page if session does not exist
            router.push('/');
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div className="flex max-w-[1540px] my-0 mx-auto">
            <SideNav />
            <Timeline />
            <Hugoteros />
        </div>
    );
}
