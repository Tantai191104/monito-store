import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const PetsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const pets = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      color: 'Golden',
      age: 3,
      owner: 'John Smith',
      status: 'Available',
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 2,
      name: 'Whiskers',
      breed: 'Persian Cat',
      color: 'White',
      age: 2,
      owner: 'Sarah Johnson',
      status: 'Adopted',
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 3,
      name: 'Max',
      breed: 'German Shepherd',
      color: 'Brown',
      age: 5,
      owner: 'Mike Davis',
      status: 'Available',
      image: '/placeholder.svg?height=40&width=40',
    },
  ];

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pets</h1>
          <p className="text-gray-600">Manage pet records and information</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Pet
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Pets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pet Records</CardTitle>
          <CardDescription>{filteredPets.length} pets found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Pet</th>
                  <th className="p-4 text-left">Breed</th>
                  <th className="p-4 text-left">Color</th>
                  <th className="p-4 text-left">Age</th>
                  <th className="p-4 text-left">Owner</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map((pet) => (
                  <tr key={pet.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={pet.image || '/placeholder.svg'}
                            alt={pet.name}
                          />
                          <AvatarFallback>{pet.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{pet.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{pet.breed}</td>
                    <td className="p-4">{pet.color}</td>
                    <td className="p-4">{pet.age} years</td>
                    <td className="p-4">{pet.owner}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          pet.status === 'Available' ? 'default' : 'secondary'
                        }
                      >
                        {pet.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetsManagement;
