import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Package,
  Heart,
  Shield,
  Award,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ImageGallery from '@/components/ImageGallery';
import {
  usePet,
  useDeletePet,
  useUpdatePetAvailability,
} from '@/hooks/usePets';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: pet, isLoading, error } = usePet(id!);
  const deletePet = useDeletePet();
  const updateAvailability = useUpdatePetAvailability();

  const handleDelete = async () => {
    if (!pet) return;
    try {
      await deletePet.mutateAsync(pet._id);
      toast.success('Pet deleted successfully!');
      navigate('/staff/pets');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete pet');
    }
  };

  const handleToggleAvailability = async () => {
    if (!pet) return;
    try {
      await updateAvailability.mutateAsync({
        id: pet._id,
        isAvailable: !pet.isAvailable,
      });
      toast.success(
        `Pet has been ${pet.isAvailable ? 'marked as sold' : 'made available'}.`,
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update pet status.');
    }
  };

  const handleBack = () => {
    navigate('/staff/pets');
  };

  if (isLoading) {
    return <PetDetailSkeleton />;
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Pet Not Found
          </h3>
          <p className="mb-4 text-gray-600">
            The pet you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pets
          </Button>
        </div>
      </div>
    );
  }

  const petInfo = [
    { label: 'SKU', value: `#${pet._id.slice(-8).toUpperCase()}` },
    { label: 'Breed', value: pet.breed.name },
    { label: 'Gender', value: pet.gender },
    { label: 'Age', value: pet.age },
    { label: 'Size', value: pet.size },
    { label: 'Color', value: pet.color.name, hex: pet.color.hexCode },
    { label: 'Location', value: pet.location },
    {
      label: 'Created Date',
      value: new Date(pet.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      label: 'Last Updated',
      value: new Date(pet.updatedAt).toLocaleDateString('vi-VN'),
    },
  ];

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
    <div className="container mx-auto py-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
          <p className="text-muted-foreground">
            Pet Details • SKU: #{pet._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={pet.isAvailable ? 'outline' : 'default'}
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

          <Button variant="outline" asChild>
            <Link to={`/staff/pets/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Pet</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{pet.name}"? This action
                  cannot be undone.
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
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Pet Images */}
            <Card className="!rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Pet Images</CardTitle>
                <CardDescription>
                  {pet.images.length} image(s) uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageGallery images={pet.images} name={pet.name} />
              </CardContent>
            </Card>

            {/* Pet Description */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>About {pet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {pet.description || 'No description provided.'}
                  </p>
                  {pet.additionalInfo && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800">
                        Additional Information
                      </h4>
                      <p className="text-sm text-gray-600">
                        {pet.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status & Price */}
            <Card className="!rounded-sm shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pet Status
                  <Badge variant={pet.isAvailable ? 'default' : 'destructive'}>
                    {pet.isAvailable ? 'Available' : 'Sold'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-3xl font-bold text-blue-600">
                  {pet.price.toLocaleString('vi-VN')} ₫
                </div>
              </CardContent>
            </Card>

            {/* Pet Information */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
                <CardDescription>Basic details and metadata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="">
                  {petInfo.map((info) => (
                    <div
                      key={info.label}
                      className="flex justify-between border-b py-3 text-sm"
                    >
                      <span className="text-gray-600">{info.label}</span>
                      <span className="flex items-center gap-2 font-medium text-gray-900">
                        {info.hex && (
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: info.hex }}
                          />
                        )}
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health & Certifications */}
            <Card className="!gap-2 !rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Health & Certifications</CardTitle>
                <CardDescription>
                  Medical records and health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {healthItems.map(({ key, label, icon: Icon, checked }) => (
                    <div
                      key={key}
                      className={`flex items-center space-x-2 rounded-md border p-2 text-sm ${
                        checked
                          ? 'border-green-200 bg-green-50 font-medium text-green-800'
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const PetDetailSkeleton = () => (
  <div className="container mx-auto py-0">
    {/* Header Skeleton */}
    <div className="mb-3 flex items-center justify-between border-b p-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
    {/* Content Skeleton */}
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default PetDetail;
