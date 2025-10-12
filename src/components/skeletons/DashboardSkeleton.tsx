import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

const DashboardSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ bgcolor: '#333' }} />
        <Skeleton variant="text" width={500} height={20} sx={{ bgcolor: '#333', mt: 1 }} />
      </Box>

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }}>
              <CardContent>
                <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: '#333' }} />
                <Skeleton variant="text" width={80} height={32} sx={{ bgcolor: '#333', mt: 1 }} />
                <Skeleton variant="text" width={100} height={16} sx={{ bgcolor: '#333', mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Skeleton */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333', mb: 3 }}>
            <CardContent>
              <Skeleton variant="text" width={200} height={24} sx={{ bgcolor: '#333', mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: '#333' }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }}>
            <CardContent>
              <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: '#333', mb: 2 }} />
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: '#333' }} />
                  <Skeleton variant="text" width="80%" height={16} sx={{ bgcolor: '#333', mt: 0.5 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;
