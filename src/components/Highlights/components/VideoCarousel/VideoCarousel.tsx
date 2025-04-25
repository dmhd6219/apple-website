import { hightlightsSlides } from '@/constants';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { pauseImg, playImg, replayImg } from '@/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

enum ActionTypes {
    RESET,
    PLAY,
    PAUSE,

    VIDEO_END,
    VIDEO_LAST,
}

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
    const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
    const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
    const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

    useGSAP(() => {
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none',
            },
            onComplete: () => {
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });

        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut',
        });
    }, [isEnd, videoId]);

    const [loadedData, setLoadedData] = useState<
        SyntheticEvent<HTMLVideoElement, Event>[]
    >([]);

    useEffect(() => {
        if (loadedData.length > 3) {
            if (videoRef.current[videoId]) {
                if (!isPlaying) {
                    videoRef.current[videoId].pause();
                } else if (startPlay) {
                    videoRef.current[videoId].play();
                }
            }
        }
    }, [videoId, startPlay, isPlaying, loadedData]);

    const handleLoadedMetaData = (
        event: SyntheticEvent<HTMLVideoElement, Event>,
    ) => {
        setLoadedData((prevData) => [...prevData, event]);
    };

    useEffect(() => {
        let currentProgress = 0;
        const span = videoSpanRef.current;
        if (span[videoId]) {
            const anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                    }
                    gsap.to(videoDivRef.current[videoId], {
                        width: window.innerWidth < 1200 ? '10vw' : '4vw',
                    });
                    gsap.to(videoSpanRef.current[videoId], {
                        width: `${currentProgress}%`,
                        backgroundColor: 'white',
                    });
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px',
                        });
                        gsap.to(videoSpanRef.current[videoId], {
                            backgroundColor: '#afafaf',
                        });
                    }
                },
            });

            if (videoId === 0) {
                anim.restart();
            }

            const animUpdate = () => {
                if (videoRef.current[videoId]) {
                    anim.progress(
                        videoRef.current[videoId].currentTime /
                            hightlightsSlides[videoId].videoDuration,
                    );
                }
            };

            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay]);

    const handleProcess = (type: ActionTypes, index?: number) => {
        switch (type) {
            case ActionTypes.VIDEO_END:
                if (index === undefined) return;
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isEnd: true,
                    videoId: index + 1,
                }));
                break;
            case ActionTypes.VIDEO_LAST:
                setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
                break;
            case ActionTypes.RESET:
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isLastVideo: false,
                    videoId: 0,
                }));
                break;
            case ActionTypes.PLAY:
                setVideo((prevVideo) => ({
                    ...prevVideo,
                    isPlaying: !isPlaying,
                }));
                break;
            case ActionTypes.PAUSE:
                break;
        }
    };

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((slide, index) => (
                    <div id="slider" key={slide.id} className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline
                                    preload="auto"
                                    muted
                                    ref={(el) => {
                                        videoRef.current[index] = el;
                                    }}
                                    onPlay={() =>
                                        setVideo((prevVideo) => ({
                                            ...prevVideo,
                                            isPlaying: true,
                                        }))
                                    }
                                    onLoadedMetadata={(event) => {
                                        handleLoadedMetaData(event);
                                    }}
                                    onEnded={() =>
                                        index !== 3
                                            ? handleProcess(
                                                  ActionTypes.VIDEO_END,
                                                  index,
                                              )
                                            : handleProcess(
                                                  ActionTypes.VIDEO_LAST,
                                              )
                                    }
                                    className={`${slide.id === 2 && 'translate-x-44'} pointer-events-none`}
                                >
                                    <source
                                        src={slide.video}
                                        type="video/mp4"
                                    />
                                </video>
                            </div>
                            <div className="absolute top-12 left-[5%] z-10">
                                {slide.textLists.map((text) => (
                                    <p
                                        key={text}
                                        className="md:text-2xl text-xl font-medium"
                                    >
                                        {' '}
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300  backdrop-blur rounded-full">
                    {videoRef.current.map((_, index) => (
                        <span
                            key={index}
                            ref={(el) => {
                                videoDivRef.current[index] = el;
                            }}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                        >
                            <span
                                className="absolute h-full w-full rounded-full"
                                ref={(el) => {
                                    videoSpanRef.current[index] = el;
                                }}
                            ></span>
                        </span>
                    ))}
                </div>

                <button
                    className="control-btn cursor-pointer"
                    onClick={
                        isLastVideo
                            ? () => handleProcess(ActionTypes.RESET)
                            : () => handleProcess(ActionTypes.PLAY)
                    }
                >
                    <img
                        src={
                            isLastVideo
                                ? replayImg
                                : !isPlaying
                                  ? playImg
                                  : pauseImg
                        }
                        alt={
                            isLastVideo
                                ? 'Replay'
                                : !isPlaying
                                  ? 'Play'
                                  : 'Pause'
                        }
                    />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;
