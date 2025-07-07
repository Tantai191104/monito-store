import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImg from '@/assets/hero-section.png';

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-col items-center gap-4">
            <img src={heroImg} alt="About Monito Pet Shop" className="w-32 h-32 rounded-full object-cover shadow" />
            <CardTitle className="text-3xl font-bold text-[#003459]">About Monito Pet Shop</CardTitle>
            <CardDescription className="text-lg text-gray-600 text-center">
              Your trusted destination for healthy pets and quality pet products.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2 text-[#003459]">Our Mission</h2>
              <p className="text-gray-700">
                At Monito Pet Shop, we believe every pet deserves a loving home and the best care. Our mission is to connect families with healthy, happy pets and provide top-quality products to keep them thriving.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2 text-[#003459]">Why Choose Us?</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Wide selection of adorable, healthy pets</li>
                <li>Premium pet food, toys, and accessories</li>
                <li>Expert staff passionate about animal care</li>
                <li>Clean, safe, and friendly environment</li>
                <li>Support for new pet owners every step of the way</li>
              </ul>
            </section>
            <section className="text-center pt-4">
              <p className="mb-4 text-lg text-[#003459] font-medium">
                Ready to find your new best friend or the perfect product for your pet?
              </p>
              <Button className="bg-[#003459] hover:bg-[#003459]/90" onClick={() => navigate('/pets')}>
                Explore Our Pets
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage; 