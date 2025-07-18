/**
 * Node modules
 */
import { Link, Outlet } from 'react-router-dom';

/**
 * Assets
 */
import DogsBanner from '@/assets/dogs-banner.png';

/**
 * Components
 */
import { Logo } from '@/components/Logo';

const AuthLayout = () => {
  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-r from-[#FCEED5] from-6% via-[#FCEED5] via-75% to-[#FFE7BA] to-100% subpixel-antialiased">
      <div className="absolute -top-[12%] -right-[25%] aspect-square h-[150vh] rotate-[60deg] rounded-[10%] bg-[#002A48]" />
      <img
        src={DogsBanner}
        alt="Dogs banner"
        className="absolute bottom-0 left-0 aspect-auto w-[800px]"
      />
      <div className="absolute -top-[580px] -left-[290px] aspect-square w-[635px] rotate-[25deg] rounded-[99px] bg-[#F7DBA7]" />
      <div className="flex w-full">
        <div className="text-[#003459] z-10 flex-1 space-y-4 p-18 pt-10">
          <Link to="/">
            <Logo className="relative z-10" />
          </Link>
          <div className="relative mt-20 flex">
            <h1 className="z-10 text-6xl font-bold">One More Friend</h1>
            <div className="absolute -top-3 -left-5 size-20 rotate-12 rounded-2xl bg-[#F7DBA7]" />
          </div>
          <h2 className="text-4xl font-bold">Thousands More Fun!</h2>
          <p className="w-[70%] text-pretty">
            Having a pet means you have more joy, a new friend, a happy person
            who will always be with you to have fun. We have 200+ different pets
            that can meet your needs!
          </p>
        </div>
        <div className="z-10 flex h-screen w-2/5 flex-col items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
