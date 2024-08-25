import NavLogo from "@/components/NavLogo";
import LoginForm from  "@/components/LoginForm";
import RecentHugots from "@/components/RecentHugots";

export default function Home() {
  return (
   <>
    <div className="h-[100vh] max-w-[1200px] my-0 mx-[auto] py-5">
      <NavLogo/>   
        <div className="p-4 flex flex-col justify-center items-center lg:flex-row lg:items-start">  
          <LoginForm />
          <div className="hidden lg:block">
            <RecentHugots />
          </div>
        </div>
    </div>
   </>
  );
}
