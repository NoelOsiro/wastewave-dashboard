'use client';

import { useEffect } from 'react';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { _mock } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { useCustomerStore } from 'src/store/customerStore';

import { useAuthContext } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppNewInvoice } from '../app-new-invoice';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { BookingAvailable } from '../../booking/booking-available';

// ----------------------------------------------------------------------


export function OverviewAppView() {
  const { user } = useAuthContext();
  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'paid').length;
  const pendingCustomers = customers.filter((c) => c.status === 'pending').length;
  const _appFeatured = [
    {
      id: '0',
      title: 'Total Customers',
      description: `${totalCustomers}`,
      coverUrl: _mock.image.cover(0),
    },
    {
      id: '1',
      title: 'Active Customers',
      description: `${activeCustomers}`,
      coverUrl: _mock.image.cover(1),
    },
    {
      id: '2',
      title: 'Pending Customers',
      description: `${pendingCustomers}`,
      coverUrl: _mock.image.cover(2),
    },
  ];

  const theme = useTheme();




  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="Fill your Profile to get started"
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary" href='user/'>
                Profile
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>

          <AppWidgetSummary
            title="Total Paid Customers"
            percent={2.6}
            total={activeCustomers}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppWidgetSummary
            title="Total Not paid"
            percent={-0.1}
            total={pendingCustomers}
            chart={{
              colors: [theme.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="Client Distribution"
            subheader=""
            chart={{
              series: [
                { label: 'Paid', value: activeCustomers },
                { label: 'Not Paid', value: pendingCustomers },
              ],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <BookingAvailable
                          title="Papers sheets"
                          chart={{
                            series: [
                              { label: 'Houses', value: totalCustomers },
                              { label: 'Available', value: totalCustomers * 6},
                            ],
                          }}
                        />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>

          <AppNewInvoice
            title="Payments"
            tableData={[]}
            headCells={[
              { id: 'id', label: 'Message ID' },
              { id: 'category', label: 'Type' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>


      </Grid>
    </DashboardContent >
  );
}
