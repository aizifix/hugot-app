import SideNav from '../../components/SideNav';
import ProfileCard from '../../components/ProfileCard';
import Hugoteros from '../../components/Hugoteros';

export default function ProfilePage() {
    return(
        <>
         <div className="flex max-w-[1540px] my-0 mx-auto">
            <SideNav />
            <ProfileCard />
            <Hugoteros />
         </div>

        </>
    );
} 