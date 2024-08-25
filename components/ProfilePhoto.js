import Image from "next/image";
import defaultPfp from "../public/default_pfp.jpg"; 
import defaultCover from "../public/default-cover.png"; 

export default function ProfileCard() {
    return (
        <>
            <div className="relative w-[100%]">
                <div className="border border-[#262629] h-[180px] my-3 rounded-xl relative overflow-hidden">
                    <Image 
                        src={defaultCover}
                        alt="Cover Photo"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="h-[120px] w-[120px] bg-slate-500 rounded-full absolute z-10 bottom-[-30%] left-[3%] overflow-hidden">
                    <Image 
                        src={defaultPfp}  
                        alt="Profile Picture"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
        </>
    );
}
