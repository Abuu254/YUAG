import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

const ArtDetailSkeleton = () => {
  const renderSkeletonList = (title) => (
    <>
      <Typography variant="h6" component="div" gutterBottom >
        <Skeleton width="80%" />
      </Typography>
      <List>
        {[1, 2].map((index) => (
          <ListItem key={index} sx={{ paddingLeft: 0 }}>
            <Typography variant="body1" color="text.secondary">
              <Skeleton width="60%" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Skeleton width="60%" />
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
    </>
  );

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto' }}>
      <CardMedia
        component="div"
        sx={{ height: 400, justifyContent:'center', display: 'flex', alignItems:'center' }}
      >
        <Skeleton variant="rectangular" width="80%" height="100%" />
      </CardMedia>
      <CardContent>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body1" color="text.secondary">
            <Skeleton width="50%" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <Skeleton width="30%" />
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderSkeletonList('Artists')}
            {renderSkeletonList('Departments')}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderSkeletonList('Classifiers')}
            {renderSkeletonList('Places')}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ArtDetailSkeleton;
