import React from 'react';
import Testimonials from './Footer/Testimonials';
import Pricing from './Footer/Pricing';
import ReachOut from './Footer/ReachOut';
import FooterMain from './Footer/FooterMain';

export { FooterMain };

export const FooterSection: React.FC = () => (
    <>
        <Testimonials />
        <Pricing />
        <ReachOut />
        <FooterMain />
    </>
);
