import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

type StabilityState = 'stable' | 'neutral' | 'unstable';

const FloatingBody: React.FC<{
  stabilityState: StabilityState;
  rotation: number;
}> = ({ stabilityState, rotation }) => {
  // Calculate positions based on stability state
  const getPositions = () => {
    const baseHeight = 0;
    switch (stabilityState) {
      case 'stable':
        return {
          g: [0, -0.5, 0],
          b: [0, 0.5, 0],
        };
      case 'neutral':
        return {
          g: [0, 0, 0],
          b: [0, 0, 0],
        };
      case 'unstable':
        return {
          g: [0, 0.5, 0],
          b: [0, -0.5, 0],
        };
    }
  };

  const positions = getPositions();

  return (
    <group rotation={[0, 0, rotation]}>
      {/* Main body - semi-transparent */}
      <mesh position={[0, baseHeight, 0]}>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial transparent opacity={0.6} color="#4a90e2" />
      </mesh>

      {/* Center of Gravity (G) */}
      <mesh position={positions.g}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Text
        position={[0.3, positions.g[1], 0]}
        fontSize={0.2}
        color="red"
      >
        G
      </Text>

      {/* Center of Buoyancy (B) */}
      <mesh position={positions.b}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Text
        position={[0.3, positions.b[1], 0]}
        fontSize={0.2}
        color="blue"
      >
        B
      </Text>
    </group>
  );
};

const FluidStabilitySimulation: React.FC = () => {
  const [stabilityState, setStabilityState] = useState<StabilityState>('stable');
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();

  // Animation logic based on stability state
  const animate = () => {
    setRotation((prev) => {
      let newRotation = prev;
      
      switch (stabilityState) {
        case 'stable':
          // Return to vertical position
          newRotation *= 0.95;
          break;
        case 'unstable':
          // Continue rotating
          newRotation += 0.01;
          break;
        case 'neutral':
          // Stay at current position
          break;
      }

      return newRotation;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  useState(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stabilityState]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} style={{ height: '600px' }}>
          <Canvas camera={{ position: [5, 5, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloatingBody stabilityState={stabilityState} rotation={rotation} />
            <OrbitControls />
            {/* Water surface representation */}
            <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#a8e6ff" transparent opacity={0.3} />
            </mesh>
          </Canvas>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Control Panel
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              variant={stabilityState === 'stable' ? 'contained' : 'outlined'}
              onClick={() => setStabilityState('stable')}
            >
              Stable
            </Button>
            <Button
              variant={stabilityState === 'neutral' ? 'contained' : 'outlined'}
              onClick={() => setStabilityState('neutral')}
            >
              Neutral
            </Button>
            <Button
              variant={stabilityState === 'unstable' ? 'contained' : 'outlined'}
              onClick={() => setStabilityState('unstable')}
            >
              Unstable
            </Button>
          </Box>
          <Box mt={4}>
            <Typography variant="body1" gutterBottom>
              Current State: {stabilityState}
            </Typography>
            <Typography variant="body2">
              Rotation: {(rotation * 180 / Math.PI).toFixed(1)}°
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FluidStabilitySimulation; 