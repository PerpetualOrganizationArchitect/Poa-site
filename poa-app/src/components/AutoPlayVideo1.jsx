import React, { useEffect, useRef } from 'react';
import { Box, AspectRatio } from '@chakra-ui/react';

const AutoPlayVideo1 = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true; // Mute the video to ensure autoplay
      setTimeout(() => video.play(), 5000); // Small delay before playing
    }
  }, []); // Only run when the component mounts

  return (
    <Box mt="5%" w ={["96%","78%","69%"]} zIndex={1} mb="8">
        <video
          ref={videoRef}
          autoPlay
          loop
          controls
          playsInline
          muted
          src="/video/demo.mp4" 
        />
    </Box>
  );
};

export default AutoPlayVideo1;
