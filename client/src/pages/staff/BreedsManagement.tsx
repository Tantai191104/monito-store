import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

const BreedsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [breeds, setBreeds] = useState([
    {
      id: 1,
      name: 'Golden Retriever',
      type: 'Dog',
      size: 'Large',
      petCount: 12,
    },
    { id: 2, name: 'Persian Cat', type: 'Cat', size: 'Medium', petCount: 8 },
    {
      id: 3,
      name: 'German Shepherd',
      type: 'Dog',
      size: 'Large',
      petCount: 15,
    },
    { id: 4, name: 'Siamese Cat', type: 'Cat', size: 'Medium', petCount: 6 },
    { id: 5, name: 'Labrador', type: 'Dog', size: 'Large', petCount: 18 },
    { id: 6, name: 'Maine Coon', type: 'Cat', size: 'Large', petCount: 4 },
  ]);

  const filteredBreeds = breeds.filter(
    (breed) =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breed.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Breeds</h1>
          <p className="text-gray-600">Manage pet breeds and classifications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Breed
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Breeds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by breed name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breed List</CardTitle>
          <CardDescription>
            {filteredBreeds.length} breeds found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Breed Name</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Size</th>
                  <th className="p-4 text-left">Pet Count</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreeds.map((breed) => (
                  <tr key={breed.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{breed.name}</td>
                    <td className="p-4">
                      <Badge
                        variant={breed.type === 'Dog' ? 'default' : 'secondary'}
                      >
                        {breed.type}
                      </Badge>
                    </td>
                    <td className="p-4">{breed.size}</td>
                    <td className="p-4">{breed.petCount}</td>
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

export default BreedsManagement;
