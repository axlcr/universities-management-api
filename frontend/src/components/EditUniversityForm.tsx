import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { University } from '../types/University';

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  location: z.string().nonempty('Location is required'),
  website: z.string().url('Invalid website URL'),
  contact_emails: z
    .array(z.object({ email: z.string().email('Invalid email') }))
    .min(1, 'At least one email is required'),
});

type FormData = z.infer<typeof schema>;

const EditUniversityForm = ({
  university,
  onUpdate,
  onClose,
}: {
  university: University;
  onUpdate: () => void;
  onClose: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: university.name,
      location: university.location,
      website: university.website,
      contact_emails: university.contact_emails.map((email) => ({ email })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contact_emails',
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsSubmitting(true);
    const transformedData = {
      ...data,
      contact_emails: data.contact_emails.map((item) => item.email),
    };

    api.put(`/universities/${university.id}`, transformedData)
      .then(() => {
        setIsSubmitting(false);
        onUpdate();
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input {...register('name')} className="border p-2 w-full" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Location</label>
        <input {...register('location')} className="border p-2 w-full" />
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label>Website</label>
        <input {...register('website')} className="border p-2 w-full" />
        {errors.website && (
          <p className="text-red-500">{errors.website.message}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Contact Emails</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                {...register(`contact_emails.${index}.email` as const)}
                className="border border-gray-300 p-2 w-full rounded"
                defaultValue={field.email}
                placeholder={`Email ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ email: '' })}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Email
        </button>
        {errors.contact_emails && (
          <p className="text-red-500 mt-2">{errors.contact_emails.message}</p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200 mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            'Update University'
          )}
        </button>
      </div>
    </form>
  );
};

export default EditUniversityForm;
