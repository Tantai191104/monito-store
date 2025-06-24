import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Heart,
  Shield,
  Award,
  Zap,
  Package,
  MoreHorizontal,
  Share2,
  Download,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePet,
  useDeletePet,
  useUpdatePetAvailability,
} from '@/hooks/usePets';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Hooks
  const { data: pet, isLoading, error } = usePet(id!);
  const deletePet = useDeletePet();
  const updateAvailability = useUpdatePetAvailability();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePet.mutateAsync(id);
      navigate('/staff/pets');
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleToggleAvailability = async () => {
    if (!pet) return;
    try {
      await updateAvailability.mutateAsync({
        id: pet._id,
        isAvailable: !pet.isAvailable,
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleBack = () => {
    navigate('/staff/pets');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-32" />
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-1 h-4 w-64" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Card>
                <CardContent className="space-y-4 p-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or no pet found
  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Pets
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Pet Not Found
                  </h1>
                  <p className="text-sm text-gray-500">
                    The requested pet could not be found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600">
                  Pet not found or an error occurred while loading.
                </p>
                <Button className="mt-4" onClick={handleBack}>
                  Return to Pet List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const healthItems = [
    {
      key: 'isVaccinated',
      label: 'Vaccinated',
      icon: Shield,
      checked: pet.isVaccinated,
    },
    {
      key: 'isDewormed',
      label: 'Dewormed',
      icon: Heart,
      checked: pet.isDewormed,
    },
    { key: 'hasCert', label: 'Certified', icon: Award, checked: pet.hasCert },
    {
      key: 'hasMicrochip',
      label: 'Microchipped',
      icon: Zap,
      checked: pet.hasMicrochip,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pets
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                <p className="text-sm text-gray-500">
                  {pet.breed.name} • {pet.gender} • {pet.age}
                </p>
              </div>
              <Badge variant={pet.isAvailable ? 'default' : 'destructive'}>
                {pet.isAvailable ? 'Available' : 'Sold'}
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/staff/pets/${pet._id}/edit`}
                      className="flex items-center"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Pet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleToggleAvailability}
                    disabled={updateAvailability.isPending}
                  >
                    {pet.isAvailable ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Mark as Sold
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Available
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Pet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Images and Description */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {pet.images && pet.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-video bg-gray-100">
                      <img
                        src={pet.images[selectedImageIndex]}
                        alt={`${pet.name} - Image ${selectedImageIndex + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/800x600?text=Image+Not+Found';
                        }}
                      />
                    </div>

                    {/* Thumbnail Navigation */}
                    {pet.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto p-4">
                        {pet.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                              index === selectedImageIndex
                                ? 'border-blue-500'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${pet.name} thumbnail ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://via.placeholder.com/80x80?text=Error';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <Package className="mx-auto mb-2 h-12 w-12" />
                      <p>No images available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {pet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {pet.description ? (
                  <p className="leading-relaxed text-gray-700">
                    {pet.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No description available
                  </p>
                )}

                {pet.additionalInfo && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Additional Information
                    </h4>
                    <p className="text-sm text-gray-700">
                      {pet.additionalInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Health & Certifications</CardTitle>
                <CardDescription>
                  Medical records and health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {healthItems.map(({ key, label, icon: Icon, checked }) => (
                    <div
                      key={key}
                      className={`flex items-center space-x-3 rounded-lg border p-3 ${
                        checked
                          ? 'border-green-200 bg-green-50 text-green-800'
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs">
                          {checked ? 'Completed' : 'Not available'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pet Details */}
          <div className="space-y-6">
            {/* Price and Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pet Information
                  <span className="text-2xl font-bold text-blue-600">
                    {pet.price.toLocaleString('vi-VN')} ₫
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Breed
                    </span>
                    <div className="font-medium">{pet.breed.name}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Size
                    </span>
                    <div className="font-medium">{pet.size}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Gender
                    </span>
                    <div className="font-medium">{pet.gender}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Age
                    </span>
                    <div className="font-medium">{pet.age}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <span className="text-sm font-medium text-gray-500">
                    Color
                  </span>
                  <div className="mt-1 flex items-center space-x-2">
                    <div
                      className="h-6 w-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: pet.color.hexCode }}
                    />
                    <span className="font-medium">{pet.color.name}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <span className="flex items-center text-sm font-medium text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    Location
                  </span>
                  <div className="mt-1 font-medium">{pet.location}</div>
                </div>
              </CardContent>
            </Card>

            {/* Status and Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Availability</span>
                  <Badge variant={pet.isAvailable ? 'default' : 'destructive'}>
                    {pet.isAvailable ? 'Available' : 'Sold'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Link to={`/staff/pets/${pet._id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Pet Information
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleToggleAvailability}
                    disabled={updateAvailability.isPending}
                  >
                    {updateAvailability.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : pet.isAvailable ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    {pet.isAvailable ? 'Mark as Sold' : 'Mark as Available'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Record Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="font-medium">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(pet.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="font-medium">Updated:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(pet.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <span className="text-xs font-medium text-gray-500">
                    Pet ID:
                  </span>
                  <div className="mt-1 rounded bg-gray-50 p-2 font-mono text-xs text-gray-600">
                    {pet._id}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pet.name}"? This action cannot
              be undone and will permanently remove all pet information from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePet.isPending}
            >
              {deletePet.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Pet'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PetDetail;
