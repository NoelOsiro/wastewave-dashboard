import type { ICustomerItem } from 'src/types/customer';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCustomerStore } from 'src/store/customerStore';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  building: zod.string().min(1, { message: 'Building is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  phone: zod.string().min(1, { message: 'Phone is required!' }),
});

// ----------------------------------------------------------------------



type AccountGeneralProps = {
  customer?: ICustomerItem;
};

export function AccountGeneral({ customer }: AccountGeneralProps) {
  const customers = useCustomerStore((state) => state.customers);
  const editCustomer = useCustomerStore((state) => state.editCustomer);
  const addCustomer = useCustomerStore((state) => state.addCustomer);

  // If customer prop is provided, try to find the latest from store by id
  const storeCustomer = useMemo(() => {
    if (customer?.id) {
      return customers.find((c) => c.id === customer.id) || customer;
    }
    return undefined;
  }, [customer, customers]);

  // Pick a random avatar if missing
  function getAvatarUrl(cust: any) {
    if (cust?.avatarUrl) return cust.avatarUrl;
    // Use a random avatar from public/assets/images/mock/avatar/avatar-1..20.webp
    const randomIndex = Math.floor(Math.random() * 20) + 1;
    return `/assets/images/mock/avatar/avatar-${randomIndex}.webp`;
  }

  const currentUser: UpdateUserSchemaType = storeCustomer
    ? {
        name: storeCustomer.name,
        email: storeCustomer.email,
        building: storeCustomer.building,
        status: storeCustomer.status,
        address: storeCustomer.address,
        phone: storeCustomer.phone,
      }
    : {
        name: '',
        email: '',
        building: '',
        status: '',
        address: '',
        phone: '',
      };

  const defaultValues: UpdateUserSchemaType = {
    name: '',
    email: '',
    building: '',
    status: '',
    address: '',
    phone: '',
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Map form data to ICustomerItem
      const customerPayload: ICustomerItem = {
        id: storeCustomer?.id ?? '',
        name: data.name,
        email: data.email,
        building: data.building,
        status: data.status,
        address: data.address,
        phone: data.phone,
      };
      if (storeCustomer) {
        await editCustomer(customerPayload);
        toast.success('Customer updated!');
      } else {
        await addCustomer(customerPayload);
        toast.success('Customer created!');
      }
    } catch (error) {
      toast.error('Operation failed!');
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            {/* Avatar, public profile, and delete button removed to match ICustomerItem */}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Name" />
              <Field.Text name="email" label="Email address" />
              <Field.Text name="building" label="Building" />
              <Field.Text name="status" label="Status" />
              <Field.Text name="address" label="Address" />
              <Field.Text name="phone" label="Phone number" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              {/* About field removed to match ICustomerItem */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </Form>
  );
}
