import { useState } from 'react';
import { useSpring } from 'react-spring';

const LoadingAnimation = (onFinished) => {
    const [start, setStart] = useState(false); // Control when to start the animation

    const scale =
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 10;

    const animation = useSpring({
        to: start ? { opacity: 0, transform: `scale(${scale})` } : {},
        from: { opacity: 0.5, transform: 'scale(1)' },
        config: { duration: 1000 },
        onRest: start ? onFinished : undefined, // Only call onFinished if the animation was started
        reset: !start,
    });

    // Return both the animation styles and a function to trigger the start
    return { style: animation, start: () => setStart(true) };
};

export default LoadingAnimation;
