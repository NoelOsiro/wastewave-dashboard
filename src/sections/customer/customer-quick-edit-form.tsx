
import type { ICustomerItem } from 'src/types/customer';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useCustomerStore } from 'src/store/customerStore';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type CustomerQuickEditSchemaType = zod.infer<typeof CustomerQuickEditSchema>;

type Props = {
  currentCustomer: ICustomerItem;
  open: boolean;
  onClose: () => void;
};

export const CustomerQuickEditSchema = zod.object({
  id: zod.string().optional(),
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().min(1, 'Email is required'),
    building: zod.string().min(1, 'Building is required'),
    status: zod.string().min(1, 'Status is required'),
    address: zod.string().min(1, 'Address is required'),
    phone: zod.string().min(1, 'Phone is required'),
});

export function CustomerQuickEditForm({ currentCustomer, open, onClose }: Props) {
  const editCustomer = useCustomerStore((state) => state.editCustomer);
  const defaultValues: CustomerQuickEditSchemaType = {
    id: '',
      name: '',
      email: '',
      building: '',
      status: '',
      address: '',
      phone: '',
  };

  const methods = useForm<CustomerQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(CustomerQuickEditSchema),
    defaultValues,
    values: currentCustomer,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      toast.promise(
        editCustomer({ ...currentCustomer, ...data }),
        {
          loading: 'Updating customer...',
          success: 'Update success!',
          error: 'Update error!'
        }
      );
      await editCustomer({ ...currentCustomer, ...data });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose} PaperProps={{ sx: { maxWidth: 720 } }}>
      <DialogTitle>Edit Customer</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
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
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
