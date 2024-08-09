import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const InteractiveFilter = () => {
    const typedJSRef = useRef(null);

    useEffect(() => {
        let hideTimeout, showTimeout;
        const options = {
            strings: [
                " Object or Art Title",
                " Name of Artist or Maker",
                " Place",
                " Type of Object or Classifier"
            ],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 400,
            startDelay: 600,
            loop: true,
        };

        const typedJS = new Typed(typedJSRef.current, options);

        const cycleVisibility = () => {
            hideTimeout = setTimeout(() => {
                setShowTyping(false);
                showTimeout = setTimeout(() => {
                    setShowTyping(true);
                    cycleVisibility();
                }, 300000); // Show again after 5 minutes (300000ms)
            }, 15000); // Hide after 15 seconds (15000ms)
        };

        cycleVisibility();

        return () => {
            typedJS.destroy();
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
        };
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // height: "80px",
                textAlign: "center",
            }}
        >
            <Box sx={{ color: 'dark-grey', display: "inline-block", fontSize: "20px", mt: 2, fontWeight: 'bold', }}>
                <Box sx={{ p: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 28 }}>
                        The Gallery has over 180,000 artworks, you can prioritize your search by
                    </Typography>
                </Box>

                <Typography gutterBottom variant="h6" component="div">
                    <span ref={typedJSRef} style={{ color: 'black' }}> </span>
                </Typography>
                <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 28 }}>
                    to narrow down you search!
                </Typography>
            </Box>
        </Box>
    );
};

export default InteractiveFilter;
