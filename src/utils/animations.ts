import * as THREE from 'three';
import * as React from 'react';

interface AnimationProps {
    transform: string;
    duration: number;
}

export const animateWithGSAPTimeline = (
    tl: gsap.core.Timeline,
    rotationRef: React.RefObject<THREE.Group>,
    rotationState: number,
    firstTarget: string,
    secondTarget: string,
    animationProps: AnimationProps,
) => {
    tl.to(rotationRef.current.rotation, {
        y: rotationState,
        duration: 1,
        ease: 'power2.inOut',
    });

    tl.to(
        firstTarget,
        {
            ...animationProps,
            ease: 'power2.inOut',
        },
        '<',
    );

    tl.to(
        secondTarget,
        {
            ...animationProps,
            ease: 'power2.inOut',
        },
        '<',
    );
};
