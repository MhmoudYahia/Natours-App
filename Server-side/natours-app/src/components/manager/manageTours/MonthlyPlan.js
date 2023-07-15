import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  styled,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useState } from 'react';
import { useFetch } from '../../utils/useFetch';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  fontWeight: 'bold',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

export const MonthlyPlanTable = () => {
  const [yearSlected, setYear] = useState(null);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 10 },
    (_, index) => currentYear - 1 - index
  )
    .concat(Array.from({ length: 5 }, (_, index) => currentYear + index))
    .sort();

  const {
    data: plan,
    status,
    loading,
    message,
  } = useFetch(
    `http://localhost:1444/api/v1/tours/monthly-plan/${yearSlected}`
  );

  return (
    <div>
      <Typography
        variant="h4"
        component="h1"
        // className="my-bookings-h1"
        style={{
          textAlign: 'center',
          margin: '10px 25px 50px',
          textTransform: 'uppercase',
          textDecoration: 'underline'
        }}
        gutterBottom
      >
        Monthly Plan
      </Typography>
      <FormControl
        fullWidth
        sx={{
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
        }}
      >
        <InputLabel id="demo-simple-select-label">Choose a Year</InputLabel>
        <StyledSelect
          value={yearSlected}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleYearChange}
          label="Choose a Year"
          sx={{
            marginBottom: 10,
            marginLeft: 0,
          }}
        >
          {years &&
            years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
        </StyledSelect>
      </FormControl>
      {yearSlected && plan.plan.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Month</StyledTableCell>
              <StyledTableCell>Tours</StyledTableCell>
              <StyledTableCell>Number of Tour Starts</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {yearSlected &&
              plan.plan.map((item, index) => (
                <TableRow key={index}>
                  <TableCell width="250px">
                    {new Date(yearSlected, item.month - 1).toLocaleString(
                      'default',
                      {
                        month: 'long',
                      }
                    )}
                  </TableCell>
                  <TableCell>{item.tours.join(', ')}</TableCell>
                  <TableCell width="300px">{item.numTourStarts}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <Typography
          variant="h5"
          component="h5"
          // className="my-bookings-h1"
          style={{
            textAlign: 'center',
          }}
          gutterBottom
        >
          No Plans this Year
        </Typography>
      )}
    </div>
  );
};
