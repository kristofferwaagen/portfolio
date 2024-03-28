import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import '../InitialLoad.scss';

const InitialLoad = ({ onFinishedLoading }) => {
    const scale =
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 10;

    const [initialAnimationCompleted, setInitialAnimationCompleted] =
        useState(false);

    const [pulsationCompleted, setPulsationCompleted] = useState(false);

    const [pulsationCount, setPulsationCount] = useState(0);

    const initialAnimation = useSpring({
        from: {
            opacity: 0,
            transform: 'scale(1)',
        },
        to: {
            opacity: 1,
            transform: `scale(1)`,
        },
        config: { duration: 1000 },
        delay: 500,
        onRest: () => setInitialAnimationCompleted(true),
    });

    const pulsateAnimationProps = useSpring({
        from: { transform: 'scale(1)' },
        to: async (next, cancel) => {
            await next({ transform: 'scale(1.2)' });
            await next({ transform: 'scale(1)' });
            // Increment the pulsation counter here, after one pulsation has completed
            setPulsationCount((prevCount) => prevCount + 1);
        },
        config: { duration: 250 }, // Duration of each pulsate animation
        onRest: () => {
            // Check if pulsationCount is 2 (which means it has completed two pulsations)
            if (pulsationCount === 2) {
                setPulsationCompleted(true); // Mark pulsation as complete after two pulsations
            }
        },
        reset: pulsationCount < 1, // Reset the animation if less than one pulsation has been completed
        pause: !initialAnimationCompleted, // Pause until initial animation completes
    });

    const loadingAnimationProps = useSpring({
        from: {
            opacity: 1,
            transform: 'scale(1)',
        },
        to: {
            opacity: 0,
            transform: `scale(${scale})`,
        },
        config: { duration: 1000 },
        onRest: onFinishedLoading,
        pause: !pulsationCompleted, // Pause until pulsation animation completes
    });

    return (
        <animated.div
            className="dot"
            style={
                initialAnimationCompleted
                    ? pulsationCompleted
                        ? loadingAnimationProps
                        : pulsateAnimationProps
                    : initialAnimation
            }
        />
    );
};

export default InitialLoad;
