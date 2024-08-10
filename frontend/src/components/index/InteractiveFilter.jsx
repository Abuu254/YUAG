import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const InteractiveFilter = () => {
    const typedJSRef = useRef(null);
    const [showTyping, setShowTyping] = useState(true); // State to control typing effect

    useEffect(() => {
        let hideTimeout, showTimeout;
        const options = {
            strings: [
                "Object or Art Title",
                "Name of Artist or Maker",
                "Place",
                "Type of Object or Classifier"
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
                setShowTyping(false); // Hide the typing effect
                typedJS.destroy(); // Stop Typed.js when hiding the animation
                showTimeout = setTimeout(() => {
                    setShowTyping(true); // Show the typing effect again
                    cycleVisibility(); // Continue the cycle
                }, 180000); // Show again after 5 minutes (300000ms)
            }, 180000); // Hide after 15 seconds (15000ms)
        };

        cycleVisibility();

        return () => {
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            typedJS.destroy();
        };
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            <Box sx={{ color: 'dark-grey', display: "inline-block", fontSize: "20px", mt: 2, fontWeight: 'bold' }}>
                <Box sx={{ p: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 28 }}>
                        The Gallery has over 180,000 artworks, you can prioritize your search by
                    </Typography>
                </Box>

                {showTyping ? (
                    <Typography gutterBottom variant="h6" component="div">
                        <span ref={typedJSRef} style={{ color: 'black' }}> </span>
                    </Typography>
                ) : (
                    <Typography gutterBottom variant="h6" component="div" style={{ color: 'black' }}>
                        Object or Art Title, Name of Artist or Maker, Place, Type of Object or Classifier
                    </Typography>
                )}

                <Typography gutterBottom variant="h5" component="div" style={{ fontSize: 28 }}>
                    to narrow down your search!
                </Typography>
            </Box>
        </Box>
    );
};
export default InteractiveFilter;
