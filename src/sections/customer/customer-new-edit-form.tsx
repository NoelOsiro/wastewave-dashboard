import type { ICustomerItem } from 'src/types/customer';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Grid2 } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCustomerStore } from 'src/store/customerStore';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
export const NewCustomerSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().min(1, 'Email is required'),
  building: zod.string().min(1, 'Building is required'),
  status: zod.string().min(1, 'Status is required'),
  address: zod.string().min(1, 'Address is required'),
  phone: zod.string().min(1, 'Phone is required'),
});

export type NewCustomerSchemaType = zod.infer<typeof NewCustomerSchema>;

// ----------------------------------------------------------------------


type Props = {
  currentCustomer?: ICustomerItem;
};

export default function CustomerNewEditForm({ currentCustomer }: Props) {
  const router = useRouter();

  const methods = useForm<NewCustomerSchemaType>({
    resolver: zodResolver(NewCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      building: '',
      status: '',
      address: '',
      phone: '',
      ...currentCustomer,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const editCustomer = useCustomerStore((state) => state.editCustomer);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentCustomer && currentCustomer.id) {
        await toast.promise(
          editCustomer({ ...currentCustomer, ...data }),
          {
            loading: 'Updating customer...',
            success: 'Update success!',
            error: 'Update error!'
          }
        );
      } else {
        toast.promise(
          addCustomer({
            name: data.name,
            email: data.email,
            building: data.building,
            status: data.status,
            address: data.address,
            phone: data.phone,
          } as Partial<ICustomerItem>),
          {
            loading: 'Creating customer...',
            success: 'Create success!',
            error: 'Create error!'
          }
        );
      }
      reset();
      router.push(paths.dashboard.customer.list);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Name" />
              <Field.Text name="email" label="Email" />
              <Field.Text name="building" label="Building" />
              <Field.Text name="status" label="Status" />
              <Field.Text name="address" label="Address" />
              <Field.Text name="phone" label="Phone" />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentCustomer ? 'Save Changes' : 'Create Customer'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </Form>
  );
}
