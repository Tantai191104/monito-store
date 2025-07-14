/**
 * Node modules
 */
import { Mail, Phone, MapPin, MessageCircle, Heart, Shield, Truck, Users } from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactPage = () => {
  const handleZaloContact = () => {
    window.open('https://zalo.me/0352195876', '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FCEED5] to-[#FFE7BA] px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <h1 className="relative z-[5] text-5xl font-bold text-[#003459]">
                Get in Touch
              </h1>
              <div className="absolute -top-2 -left-4 h-16 w-16 rotate-12 rounded-2xl bg-[#F7DBA7]" />
            </div>
            <p className="max-w-2xl mx-auto text-xl text-[#003459]/80">
              We're here to help you find the perfect companion and provide the best pet care products. 
              Reach out to us anytime!
            </p>
          </div>
        </div>
        <div className="absolute right-8 -bottom-8 z-[5] aspect-square w-32 rotate-[25deg] rounded-2xl bg-[#F7DBA7]" />
        <div className="absolute left-8 -bottom-4 aspect-square w-24 rotate-[10deg] rounded-2xl bg-[#002A48]" />
      </section>

      {/* Contact Information Section */}
      <section className="px-8 py-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#003459] mb-4">
              Let's Connect
            </h2>
            <p className="text-[#003459]/70 text-lg">
              Have questions about our pets or products? We'd love to hear from you. 
              Contact us through any of the methods below and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#F7DBA7] rounded-full">
                    <MessageCircle className="h-6 w-6 text-[#003459]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003459]">Zalo Chat</h3>
                    <p className="text-[#003459]/70">Quick response via Zalo</p>
                    <Button 
                      onClick={handleZaloContact}
                      className="mt-2 bg-[#003459] hover:bg-[#003459]/90"
                    >
                      Chat Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#F7DBA7] rounded-full">
                    <Phone className="h-6 w-6 text-[#003459]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003459]">Phone</h3>
                    <p className="text-[#003459]/70">+84 352 195 876</p>
                    <p className="text-sm text-[#003459]/60">Mon-Fri 8AM-6PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#F7DBA7] rounded-full">
                    <Mail className="h-6 w-6 text-[#003459]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003459]">Email</h3>
                    <p className="text-[#003459]/70">info@monito-store.com</p>
                    <p className="text-sm text-[#003459]/60">We'll reply within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#F7DBA7] rounded-full">
                    <MapPin className="h-6 w-6 text-[#003459]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003459]">Visit Us</h3>
                    <p className="text-[#003459]/70">123 Pet Street, District 1</p>
                    <p className="text-[#003459]/70">Ho Chi Minh City, Vietnam</p>
                    <p className="text-sm text-[#003459]/60">Store hours: 9AM-8PM daily</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-8 py-16 bg-gradient-to-br from-[#FCEED5] to-[#FFE7BA]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#003459] mb-4">
              Why Choose Monito Store?
            </h2>
            <p className="text-[#003459]/70 text-lg max-w-2xl mx-auto">
              We're committed to providing the best experience for you and your pets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-[#F7DBA7] rounded-full w-fit mx-auto mb-4">
                  <Heart className="h-8 w-8 text-[#003459]" />
                </div>
                <h3 className="font-semibold text-[#003459] mb-2">Pet Care Experts</h3>
                <p className="text-[#003459]/70 text-sm">
                  Our team has years of experience in pet care and can provide expert advice
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-[#F7DBA7] rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[#003459]" />
                </div>
                <h3 className="font-semibold text-[#003459] mb-2">Quality Guaranteed</h3>
                <p className="text-[#003459]/70 text-sm">
                  All our pets and products meet the highest quality standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-[#F7DBA7] rounded-full w-fit mx-auto mb-4">
                  <Truck className="h-8 w-8 text-[#003459]" />
                </div>
                <h3 className="font-semibold text-[#003459] mb-2">Fast Delivery</h3>
                <p className="text-[#003459]/70 text-sm">
                  Quick and safe delivery to your doorstep across Vietnam
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-[#F7DBA7] hover:border-[#003459] transition-colors">
              <CardContent className="p-6">
                <div className="p-3 bg-[#F7DBA7] rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#003459]" />
                </div>
                <h3 className="font-semibold text-[#003459] mb-2">24/7 Support</h3>
                <p className="text-[#003459]/70 text-sm">
                  Round-the-clock customer support to assist you anytime
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#003459] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#003459]/70 text-lg">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-[#F7DBA7]">
              <CardHeader>
                <CardTitle className="text-[#003459] text-lg">
                  How do I adopt a pet from Monito Store?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#003459]/70">
                  You can browse our available pets online or visit our store. Once you find your perfect companion, 
                  contact us via Zalo or phone to schedule a meeting and complete the adoption process.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F7DBA7]">
              <CardHeader>
                <CardTitle className="text-[#003459] text-lg">
                  Do you ship pet products nationwide?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#003459]/70">
                  Yes! We offer nationwide shipping for all our pet products. Delivery typically takes 2-3 business days 
                  within major cities and 3-5 days for other areas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F7DBA7]">
              <CardHeader>
                <CardTitle className="text-[#003459] text-lg">
                  What if I have questions about pet care?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#003459]/70">
                  Our pet care experts are always available to help! Contact us via Zalo for instant support, 
                  or call us during business hours for detailed consultations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F7DBA7]">
              <CardHeader>
                <CardTitle className="text-[#003459] text-lg">
                  Can I return or exchange products?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#003459]/70">
                  We offer a 30-day return policy for most products in their original condition. 
                  Contact our customer service team for assistance with returns and exchanges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 