import type { ITourItem, TourItem } from 'src/types/tour';

import { ChangeEvent, useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { TourItem as ItemTour } from './tour-item';
import { deleteTour } from 'src/actions/tour';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination, Typography } from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';

// ----------------------------------------------------------------------

type Props = {
  tours: TourItem[];
  onMutate?: () => void;
  page: number;
  rowsPerPage: number;
  pagination?: {
    totalPages?: number;
    totalRecord?: number;
  };
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function TourList({
  tours,
  onMutate,
  page,
  rowsPerPage,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const openDeleteState = useBoolean();
  const handleDelete = useCallback(async () => {
    if (!selectedId) return;

    try {
      await deleteTour(selectedId);
      toast.success('Xóa tour thành công!');
      openDeleteState.onFalse();
      await onMutate?.();
    } catch (error) {
      console.error(error);
      toast.error('Xóa tour thất bại!');
    }
  }, [selectedId, deleteTour, onMutate, openDeleteState]);

  const deleteDialog = () => (
    <Dialog open={openDeleteState.value} onClose={openDeleteState.onFalse}>
      <DialogTitle>Xác nhận xóa tour này?</DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="warning">
          Tour là dữ liệu quan trọng, khi xóa rồi sẽ không thể hoàn tác!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="warning" onClick={handleDelete}>
          Có, tôi muốn xóa
        </Button>
        <Button variant="outlined" onClick={openDeleteState.onFalse}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );

  const deleteTourConfirm = (id: number) => {
    setSelectedId(id);
    openDeleteState.onTrue();
  };

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {tours.map((tour) => (
          <ItemTour
            key={tour.id}
            tour={tour}
            editHref={paths.dashboard.tour.edit(String(tour.id))}
            detailsHref={paths.dashboard.tour.details(String(tour.id))}
            onDelete={() => deleteTourConfirm(tour.id)}
          />
        ))}
      </Box>

      {pagination?.totalRecord && pagination.totalRecord > 1 && (
        <Box
          sx={{
            mt: { xs: 5, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TablePagination
            component="div"
            count={pagination.totalRecord}
            page={page}
            onPageChange={onChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </Box>
      )}

      {deleteDialog()}
    </>
  );
}
