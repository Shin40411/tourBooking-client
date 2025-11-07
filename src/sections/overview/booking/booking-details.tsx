import type { CardProps } from '@mui/material/Card';
import type { TableHeadCellProps } from 'src/components/table';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';


import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { TableCell, TablePagination, TableRow } from '@mui/material';
import { IBookingList } from 'src/types/booking';
import { ChangeEvent } from 'react';
import { BookingDetailsItem } from './booking-details-item';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headCells: TableHeadCellProps[];
  tableData: IBookingList[];
  page: number;
  rowsPerPage: number;
  totalRecord: number;
  onChangePage: (_: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  isEmpty: boolean
};

export function BookingDetails({
  title,
  subheader,
  headCells,
  tableData,
  page,
  rowsPerPage,
  totalRecord,
  onChangePage,
  onChangeRowsPerPage,
  isEmpty,
  sx,
  ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 462 }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHeadCustom headCells={headCells} />

          <TableBody>
            {isEmpty ?
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyContent sx={{ height: '40vh' }} />
                </TableCell>
              </TableRow>
              :
              tableData.map((row) => (
                <BookingDetailsItem key={row.id} row={row} />
              ))
            }
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <TablePagination
          component="div"
          count={totalRecord}
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
    </Card>
  );
}