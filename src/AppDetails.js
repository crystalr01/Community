import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    StarIcon,
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    ShareIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

import './AppDetails.css';

const AppDetails = ({ appData }) => {
    // Default app data if none provided
    const defaultAppData = {
        id: 'com.spark.smartguruji',
        name: 'E-Guruji',
        developer: 'Spark Computers',
        icon: 'https://images.sftcdn.net/images/t_app-icon-s/p/3d153e51-b749-49ef-91df-4be32bdc4efc/2219933606/expert-guruji-logo',
        rating: 4.7,
        ratingsCount: '12.4K',
        downloads: '50K+',
        size: '47 MB',
        age: '4+',
        updated: 'June 10, 2025',
        version: '8.0',
        description: 'Be smart with Expert Guruji !!! It is truly your expert buddy. It handles your class management work very easily.',
        longDescription: 'Expert Guruji offers comprehensive learning solutions with:\n\n• 1000+ interactive lessons\n• Daily quizzes and challenges\n• Personalized learning paths\n• Expert community support\n• Progress tracking\n\nJoin thousands of learners who are upgrading their skills with Expert Guruji!',
        screenshots: [
            'https://play-lh.googleusercontent.com/a-juTUMe0dJT2x9tLphx5B7EUB4VVjwqZ11uOVm6uUiMYB8OzRiFhVVHf_L7T1TM5w=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/mZuuEqaFg1sNoDkvoVQxEBNcMQzZcP7Dsl_0bFShOFbGDsxBWLrfYqwWwrcpijik8clS=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/7E0pmgHM9xNTVVzcD2KyjPvYi3CoIxqXzjdG6gFuEAv8iZJGtDCRjMaTzjSE34SRA_p2=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/_44dCi7f6HYiJhbrtHxqMUj43Z6cF5V3uNY5pPL_zt0Yyr-X_6YqZWM4lNlwS0mQqyyC=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/ZTsFWjdNai0vZ181pSM_On-kOSYHzDzPg6ltigtUX6pTwNNnLNVz-fEUtNhWs2Jiog=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/rr7GW4wE-kD4ZwzdOOxHKNEK5ZB4VeE1MuRbH7p2ouxIRzsWforzp8a2ISNK7IZ-1w=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/dZmPm-lF17Srd-Ku0eV0oDrqtFq8BCF46QolY65eTObS5qnwvMjS_pZdrEwtWZNK0eQ=w2560-h1440-rw',
            'https://play-lh.googleusercontent.com/hx8WcucluiAhGJIZ-J3BWakkoQZa_2uvGdbmqhbzNUBadFosum1TKWK24TD14PWBwP86=w2560-h1440-rw'

        ],
        features: ['Ad-free experience', 'Offline access', 'Daily updates', 'Community forums'],
        category: 'Education',
        price: 'Free',
        inAppPurchases: true,
        containsAds: false,
    };

    const [app, setApp] = useState(appData || defaultAppData);
    const [activeScreenshot, setActiveScreenshot] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScreenshotClick = (index) => {
        setActiveScreenshot(index);
    };

    const formatDownloadNumber = (num) => {
        if (!num) return '0';
        if (num.includes('K')) return num;
        const number = parseInt(num.replace(/[^0-9]/g, ''));
        if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M+`;
        if (number >= 1000) return `${(number / 1000).toFixed(1)}K+`;
        return `${number}+`;
    };

    return (
        <div className="app-details-container">
            {/* Header with back button and app icon */}
            {/* <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    <button className="back-button">
                        <ArrowLeftIcon className="icon" />
                    </button>
                    {isScrolled && (
                        <motion.div
                            className="header-app-info"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <img src={app.icon} alt={app.name} className="header-app-icon" />
                            <div className="header-text">
                                <h3 className="header-app-name">{app.name}</h3>
                                <p className="header-app-developer">{app.developer}</p>
                            </div>
                        </motion.div>
                    )}
                    <div className="header-actions">
                        <button className="icon-button">
                            <ShareIcon className="icon" />
                        </button>
                        <button
                            className={`icon-button ${isFavorite ? 'favorited' : ''}`}
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            <HeartIcon className="icon" />
                        </button>
                    </div>
                </div>
            </header> */}

            {/* Main app content */}
            <main className="app-main-content">
                {/* App hero section */}
                <section className="app-hero">
                    <div className="app-icon-container">
                        <img src={app.icon} alt={app.name} className="app-icon" />
                    </div>

                    <div className="app-basic-info">
                        <h1 className="app-name">{app.name}</h1>
                        <p className="app-developer">{app.developer}</p>

                        <div className="app-meta">
                            <div className="rating-container">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`star ${i < Math.floor(app.rating) ? 'filled' : ''}`}
                                        />
                                    ))}
                                </div>
                                <span className="rating-text">{app.rating} ({app.ratingsCount})</span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-value">{formatDownloadNumber(app.downloads)}</span>
                                <span className="meta-label">Downloads</span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-value">{app.age}</span>
                                <span className="meta-label">Age</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Install button */}
                <section className="install-section">
                    <button
                        className="install-button"
                        onClick={() =>
                            window.open(`https://play.google.com/store/apps/details?id=${app.id}`, '_blank')
                        }
                    >
                        <span>Install</span>
                    </button>

                    <span className="price-badge">{app.price}{app.inAppPurchases && ' • In-app purchases'}</span>
                </section>

                {/* Screenshots carousel */}
                <section className="screenshots-section">
                    <h2 className="section-title">Screenshots</h2>
                    <div className="screenshots-container">
                        <div className="screenshots-scroller">
                            {app.screenshots.map((screenshot, index) => (
                                <motion.div
                                    key={index}
                                    className={`screenshot-thumb ${index === activeScreenshot ? 'active' : ''}`}
                                    onClick={() => handleScreenshotClick(index)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <img
                                        src={screenshot}
                                        alt={`App screenshot ${index + 1}`}
                                        className="screenshot-image"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="active-screenshot-container">
                        <img
                            src={app.screenshots[activeScreenshot]}
                            alt={`App screenshot ${activeScreenshot + 1}`}
                            className="active-screenshot"
                        />
                    </div>
                </section>

                {/* App description */}
                <section className="description-section">
                    <h2 className="section-title">About this app</h2>
                    <div className={`description-text ${showFullDescription ? 'expanded' : ''}`}>
                        {app.description}
                        <br /><br />
                        {app.longDescription.split('\n').map((paragraph, i) => (
                            <React.Fragment key={i}>
                                {paragraph}
                                <br /><br />
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        className="read-more-button"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                        {showFullDescription ? 'Read less' : 'Read more'}
                    </button>
                </section>

                {/* Additional info */}
                <section className="info-section">
                    <h2 className="section-title">Additional information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Updated</span>
                            <span className="info-value">{app.updated}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Size</span>
                            <span className="info-value">{app.size}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Current Version</span>
                            <span className="info-value">{app.version}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Requires Android</span>
                            <span className="info-value">5.0 and up</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Interactive Elements</span>
                            <span className="info-value">Users Interact</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">In-app purchases</span>
                            <span className="info-value">{app.inAppPurchases ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Contains ads</span>
                            <span className="info-value">{app.containsAds ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </section>

                {/* Features */}
                {app.features && app.features.length > 0 && (
                    <section className="features-section">
                        <h2 className="section-title">Features</h2>
                        <ul className="features-list">
                            {app.features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    className="feature-item"
                                    whileHover={{ x: 5 }}
                                >
                                    <span className="feature-bullet">•</span>
                                    {feature}
                                </motion.li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>

            {/* Fixed install button for mobile */}
            <div className="mobile-install-container">
                <button
                    className="mobile-install-button"
                    onClick={() =>
                        window.open(`https://play.google.com/store/apps/details?id=${app.id}`, '_blank')
                    }
                >
                    <ArrowLeftIcon className="icon" />
                    <span>Install</span>
                </button>

            </div>
        </div>
    );
};

export default AppDetails;