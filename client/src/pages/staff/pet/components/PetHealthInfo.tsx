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
import { Info } from 'lucide-react';
import type { Control } from 'react-hook-form';
import type { AddPetFormValues } from '../AddPet';

interface PetHealthInfoProps {
  control: Control<AddPetFormValues>;
}

const PetHealthInfo = ({ control }: PetHealthInfoProps) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5 text-purple-600" />
          Health & Specifications
        </CardTitle>
        <CardDescription>
          Add health records and availability status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <FormField
            control={control}
            name="isVaccinated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Vaccinated</FormLabel>
                  <FormDescription className="text-xs">
                    Has received vaccinations
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isDewormed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dewormed</FormLabel>
                  <FormDescription className="text-xs">
                    Has been dewormed
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasCert"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Certificate</FormLabel>
                  <FormDescription className="text-xs">
                    Has health certificate
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasMicrochip"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Microchip</FormLabel>
                  <FormDescription className="text-xs">
                    Has microchip implanted
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Available for Sale</FormLabel>
                <FormDescription>
                  Check if this pet is currently available for purchase
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about the pet..."
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PetHealthInfo;
