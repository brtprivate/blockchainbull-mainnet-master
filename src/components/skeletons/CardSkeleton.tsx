import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface CardSkeletonProps {
  height?: number;
  showHeader?: boolean;
  lines?: number;
  variant?: 'default' | 'stats' | 'action';
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  height = 200,
  showHeader = true,
  lines = 3,
  variant = 'default'
}) => {
  if (variant === 'stats') {
    return (
      <Card sx={{
        background: '#1e1e1e',
        color: 'white',
        border: '1px solid #333',
        height: height || 'auto'
      }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: '#333' }} />
            <Skeleton variant="circular" width={30} height={30} sx={{ bgcolor: '#333' }} />
          </Box>
          <Skeleton variant="text" width={80} height={32} sx={{ bgcolor: '#333', mb: 1 }} />
          <Skeleton variant="text" width={60} height={16} sx={{ bgcolor: '#333' }} />
          <Skeleton variant="text" width={100} height={14} sx={{ bgcolor: '#333', mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'action') {
    return (
      <Card sx={{
        p: 3,
        background: '#2d2d2d',
        border: '1px solid #444',
        borderRadius: 3,
        height: height || 'auto'
      }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: '#333', mr: 2 }} />
          <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: '#333' }} />
        </Box>
        <Skeleton variant="text" width="100%" height={16} sx={{ bgcolor: '#333', mb: 2 }} />
        <Skeleton variant="text" width="80%" height={16} sx={{ bgcolor: '#333', mb: 2 }} />
        <Box display="flex" alignItems="center" gap={0.5}>
          <Skeleton variant="text" width={100} height={14} sx={{ bgcolor: '#333' }} />
          <Skeleton variant="circular" width={16} height={16} sx={{ bgcolor: '#333' }} />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{
      bgcolor: '#1a1a1a',
      border: '1px solid #333',
      height: height,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ flex: 1 }}>
        {showHeader && (
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width={180} height={24} sx={{ bgcolor: '#333' }} />
            <Skeleton variant="text" width={120} height={16} sx={{ bgcolor: '#333', mt: 0.5 }} />
          </Box>
        )}

        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={`${Math.random() * 40 + 60}%`}
            height={20}
            sx={{ bgcolor: '#333', mb: 1 }}
          />
        ))}

        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: '#333' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
