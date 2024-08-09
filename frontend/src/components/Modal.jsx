import { useState, useRef } from 'react';
import ArtDetail from "./ArtDetail.jsx";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

export default function CustomModal({ show, onHide, art }) {
  const [showExpandIcon, setShowExpandIcon] = useState(true);
  const dialogContentRef = useRef(null);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      setShowExpandIcon(false);
    } else {
      setShowExpandIcon(true);
    }
  };

  const handleExpandClick = () => {
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTo({
        top: dialogContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth='md'
      open={show}
      onClose={onHide}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="div"
          sx={{
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            display: 'inline-block',
            textAlign: 'center',
            width: '80%',
          }}
        >
          {art.label}
        </Typography>

        <IconButton
          aria-label="close"
          onClick={onHide}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>


      <DialogContent
        onScroll={handleScroll}
        ref={dialogContentRef}
        sx={{ overflowY: 'auto' }}>
        <ArtDetail art={art} onClose={onHide} />
      </DialogContent>

      {/* Conditionally render ExpandMoreIcon */}
      {showExpandIcon && (
        <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
          <ExpandMoreIcon onClick={handleExpandClick} style={{ cursor: 'pointer' }} />
        </Box>
      )}

      <DialogActions>
        <Button onClick={onHide}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
