/**
 * Node modules
 */
import { ArrowRightIcon } from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

const WhatNewSection = () => {
  return (
    <section className="bg-white px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-600">What's new?</p>
            <h2 className="text-2xl font-bold text-[#003459]">
              Take A Look At Some Of Our Pets
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-[#003459] bg-transparent text-[#003459] hover:bg-[#003459] hover:text-white"
          >
            View more
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'MO231',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Pomeranian White',
              gene: 'Male',
              age: '02 months',
              price: '6,900,000 VND',
            },
            {
              id: 'MO502',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Poodle Tiny Yellow',
              gene: 'Female',
              age: '02 months',
              price: '3,900,000 VND',
            },
            {
              id: 'MO102',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Poodle Tiny Sepia',
              gene: 'Male',
              age: '02 months',
              price: '4,000,000 VND',
            },
            {
              id: 'MO512',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Alaskan Malamute Grey',
              gene: 'Male',
              age: '02 months',
              price: '8,900,000 VND',
            },
            {
              id: 'MO231',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Pembroke Corgi Cream',
              gene: 'Male',
              age: '02 months',
              price: '7,900,000 VND',
            },
            {
              id: 'MO502',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Pembroke Corgi Tricolor',
              gene: 'Female',
              age: '02 months',
              price: '9,000,000 VND',
            },
            {
              id: 'MO231',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Pomeranian White',
              gene: 'Female',
              age: '02 months',
              price: '6,500,000 VND',
            },
            {
              id: 'MO512',
              url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
              name: 'Poodle Tiny Grey Cute',
              gene: 'Male',
              age: '02 months',
              price: '5,000,000 VND',
            },
          ].map((pet, index) => (
            <Card
              key={index}
              className="gap-3 overflow-hidden rounded-md p-2 transition-shadow hover:shadow-lg"
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-gray-200">
                <img
                  src={pet.url}
                  alt={pet.name}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <CardContent className="px-2 pb-2">
                <CardTitle className="mb-2 font-bold">
                  {pet.id} - {pet.name}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex justify-start gap-2 text-sm text-gray-600">
                    <span>
                      Gene: <strong>{pet.gene}</strong>
                    </span>
                    <span>&#8226;</span>
                    <span>
                      Age: <strong>{pet.age}</strong>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-black">
                    {pet.price}
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatNewSection;
