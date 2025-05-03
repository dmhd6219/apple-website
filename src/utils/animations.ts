import * as THREE from 'three';
import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export const animateWithGSAPTimeline = (
    tl: gsap.core.Timeline,
    rotationRef: React.RefObject<THREE.Group>,
    rotationState: number,
    firstTarget: string,
    secondTarget: string,
    animationProps: Record<string, string>,
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

export const animateWithGSAP = (
    target: string,
    animationProps?: Record<string, string | number>,
    scrollProps?: Record<string, string | number>,
) => {
    gsap.to(target, {
        ...animationProps,
        scrollTrigger: {
            trigger: target,
            toggleActions: 'restart reverse restart reverse',
            start: 'top 85%',
            ...scrollProps,
        },
    });
};
