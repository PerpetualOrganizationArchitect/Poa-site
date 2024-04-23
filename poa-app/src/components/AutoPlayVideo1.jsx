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
    <Box mt="7%" w ="69%">
        <video
          ref={videoRef}
          autoPlay
          loop
          controls
          playsInline
          muted
          src="/video/demo.mp4" // Check if this path is correct
        />
    </Box>
  );
};

export default AutoPlayVideo1;
