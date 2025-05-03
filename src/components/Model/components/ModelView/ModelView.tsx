import { RefObject, Suspense } from 'react';
import { Model } from '@/components/Model/types/model';
import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei';
import { Lights } from './components/Lights';
import { IPhone } from './components/IPhone';
import { Loader } from './components/Loader';
import * as THREE from 'three';

interface ModelViewProps {
    index: number;
    groupRef: RefObject<THREE.Group | null>;
    gsapType: string;
    controlRef: RefObject<typeof OrbitControls | null>;
    setRotationState: (_: number) => void;
    item: Model;
    size: string;
}

const ModelView = ({
    index,
    groupRef,
    gsapType,
    controlRef,
    setRotationState,
    size,
    item,
}: ModelViewProps) => {
    return (
        <View
            index={index}
            id={gsapType}
            className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
        >
            <ambientLight intensity={0.3} />

            <PerspectiveCamera makeDefault position={[0, 0, 4]} />

            <Lights />

            <OrbitControls
                makeDefault
                // @ts-expect-error: object is that i need
                ref={controlRef}
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.4}
                target={new THREE.Vector3(0, 0, 0)}
                onEnd={() => {
                    if (controlRef.current) {
                        setRotationState(
                            // @ts-expect-error: object is that i need
                            controlRef.current.getAzimuthalAngle(),
                        );
                    }
                }}
            />

            <group
                ref={groupRef}
                name={index === 1 ? 'small' : 'large'}
                position={[0, 0, 0]}
            >
                <Suspense fallback={<Loader />}>
                    <IPhone
                        scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
                        item={item}
                        size={size}
                    />
                </Suspense>
            </group>
        </View>
    );
};

export default ModelView;
