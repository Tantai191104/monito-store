// client/src/pages/staff/pet/components/PetHealthInfo.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Shield, Award, Zap } from 'lucide-react';
import type { Control } from 'react-hook-form';
import type { AddPetFormValues } from '../AddPet';
import type { EditPetFormValues } from '../EditPet';

interface PetHealthInfoProps {
  control: Control<AddPetFormValues | EditPetFormValues>;
}

const PetHealthInfo = ({ control }: PetHealthInfoProps) => {
  const healthOptions = [
    {
      name: 'isVaccinated',
      label: 'Vaccinated',
      description: 'Has received required vaccinations',
      icon: Shield,
      color: 'text-green-600',
    },
    {
      name: 'isDewormed',
      label: 'Dewormed',
      description: 'Has been properly dewormed',
      icon: Heart,
      color: 'text-pink-600',
    },
    {
      name: 'hasCert',
      label: 'Certified',
      description: 'Has health certificate',
      icon: Award,
      color: 'text-yellow-600',
    },
    {
      name: 'hasMicrochip',
      label: 'Microchipped',
      description: 'Has microchip implanted',
      icon: Zap,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Health & Certifications */}
      <Card className="!rounded-sm shadow-none">
        <CardHeader>
          <CardTitle>Health & Certifications</CardTitle>
          <CardDescription>Medical records and health status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthOptions.map((option) => {
              const Icon = option.icon;
              return (
                <FormField
                  key={option.name}
                  control={control}
                  name={option.name as keyof AddPetFormValues}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-lg border-2 border-gray-100 p-4 transition-colors hover:border-gray-200">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="flex-1 space-y-1 leading-none">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${option.color}`} />
                          <FormLabel className="font-medium">
                            {option.label}
                          </FormLabel>
                        </div>
                        <FormDescription className="text-xs text-gray-500">
                          {option.description}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="!rounded-sm shadow-none">
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>
            Set the availability status for this pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-lg bg-gray-50 border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">
                    Available for Sale
                  </FormLabel>
                  <FormDescription>
                    Check if this pet is currently available for purchase
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="!rounded-sm shadow-none">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Any extra notes about this pet</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Special care instructions, behavioral notes, training status..."
                    className="min-h-[100px] resize-none transition-colors focus:border-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/300 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PetHealthInfo;
