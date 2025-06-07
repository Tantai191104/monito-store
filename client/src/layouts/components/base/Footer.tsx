import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-[#FCEED5] px-8 py-12">
      <div className="mx-auto max-w-7xl rounded-md bg-[#003459]">
        <div className="flex items-center justify-between p-7 px-8">
          <h2 className="max-w-[380px] text-2xl font-bold text-white">
            Register Now So You Don't Miss Our Programs
          </h2>
          <div className="flex items-center justify-center gap-2 rounded-md bg-white p-2.5 py-2.5">
            <Input placeholder="Enter your email" className='w-[400px]' />
            <Button className="bg-[#003459] hover:bg-[#003459]/90">
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between py-10">
          <nav className="flex items-center gap-15">
            <a
              href="#"
              className="block font-medium text-[#003459] hover:text-[#003459]/80"
            >
              Home
            </a>
            <a
              href="#"
              className="block font-medium text-[#003459] hover:text-[#003459]/80"
            >
              Category
            </a>
            <a
              href="#"
              className="block font-medium text-[#003459] hover:text-[#003459]/80"
            >
              About
            </a>
            <a
              href="#"
              className="block font-medium text-[#003459] hover:text-[#003459]/80"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-8">
            <FacebookIcon />
            <TwitterIcon />
            <InstagramIcon />
            <YoutubeIcon />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-300 pt-8 text-sm text-gray-600">
          <div>© 2022 Monito. All rights reserved.</div>
          <Logo className="mt-3" />
          <div className="flex space-x-8">
            <a href="#" className="hover:text-[#003459]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#003459]">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
