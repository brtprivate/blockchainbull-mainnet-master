import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Skeleton, 
  Paper 
} from '@mui/material';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  headers?: string[];
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4, 
  headers = [] 
}) => {
  return (
    <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }}>
      <Table>
        {headers.length > 0 && (
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} sx={{ color: '#ffffff', borderBottom: '1px solid #333' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} sx={{ borderBottom: '1px solid #333' }}>
                  <Skeleton 
                    variant="text" 
                    width={`${Math.random() * 50 + 50}%`} 
                    height={20} 
                    sx={{ bgcolor: '#333' }} 
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
