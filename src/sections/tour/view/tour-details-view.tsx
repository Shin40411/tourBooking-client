import type { ITourItem, TourItem } from 'src/types/tour';

import { useState, useCallback } from 'react';
import { useTabs } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { TOUR_DETAILS_TABS, TOUR_PUBLISH_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';

import { TourDetailsContent } from '../tour-details-content';
import { TourDetailsBookers } from '../tour-details-bookers';
import { TourDetailsToolbar } from '../tour-details-toolbar';
import { useParams } from 'src/routes/hooks';
import { useGetTour } from 'src/actions/tour';
import { redirect } from 'react-router';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { useGetBookedByTour } from 'src/actions/booking';

// ----------------------------------------------------------------------

export function TourDetailsView() {
  const { user } = useAuthContext();
  // const [publish, setPublish] = useState(tour?.publish);
  const { id = '' } = useParams();

  if (!id) redirect(paths.page404);

  const { tour, tourLoading, tourError } = useGetTour(Number(id));

  const { pagination: { totalRecord } } = useGetBookedByTour({
    tourId: Number(id),
    pageSize: 1,
    pageNumber: 999,
    enabled: !!id
  })

  const tabs = useTabs('content');

  // const handleChangePublish = useCallback((newValue: string) => {
  //   setPublish(newValue);
  // }, []);

  const renderToolbar = () => (
    <TourDetailsToolbar
      backHref={paths.dashboard.tour.root}
      editHref={paths.dashboard.tour.edit(`${tour?.id}`)}
      liveHref="#"
      publish={''}
      onChangePublish={() => { }}
      publishOptions={TOUR_PUBLISH_OPTIONS}
    />
  );

  const renderTabs = () => (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'bookers' ? <Label variant="filled">{totalRecord}</Label> : ''
          }
        />
      ))}
    </Tabs>
  );

  return (
    <RoleBasedGuard hasContent currentRole={user?.role} allowedRoles={['ROLE_ADMIN']} sx={{ py: 10 }}>
      <DashboardContent>
        {renderToolbar()}

        {renderTabs()}
        {tabs.value === 'content' && <TourDetailsContent tour={tour} />}
        {tabs.value === 'bookers' && <TourDetailsBookers tourId={tour?.id || 0} />}
      </DashboardContent>
    </RoleBasedGuard>
  );
}
