import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Highlights } from '@/components/Highlights';
import { Model } from '@/components/Model';
import { Features } from '@/components/Features';
import { Chip } from '@/components/Chip';
import { Footer } from '@/components/Footer';
import { MetrikaCounter } from 'react-metrika';
import { YM_COUNTER_ID } from '@/config/ym';

const App = () => {
    return (
        <main className="bg-black">
            <Navbar />
            <Hero />
            <Highlights />
            <Model />
            <Features />
            <Chip />
            <Footer />
            <MetrikaCounter
                id={YM_COUNTER_ID}
                options={{
                    trackHash: true,

                    webvisor: true,
                    trackLinks: true,
                    clickmap: true,
                    accurateTrackBounce: true,
                }}
            />
        </main>
    );
};

export default App;
