import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { database } from './firebase';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

// Import the dedicated CSS file
import './CommunityDetails.css';

// --- Enhanced Theme Configuration with Premium Colors ---
const categoryThemes = {
    News: {
        bgGradient: 'linear-gradient(135deg, #0F0F23 0%, #1a1a2e 50%, #16213e 100%)',
        textColor: '#E8E9F3',
        accentColor: '#FFD700',
        accentTextColor: '#0F0F23',
        borderColor: '#4F46E5',
        shadowColor: 'rgba(79, 70, 229, 0.4)',
        glowColor: 'rgba(255, 215, 0, 0.3)',
    },
    Speech: {
        bgGradient: 'linear-gradient(135deg, #0C2722 0%, #1a4037 50%, #2d5a4d 100%)',
        textColor: '#F0FDF4',
        accentColor: '#FF8C42',
        accentTextColor: '#0C2722',
        borderColor: '#10B981',
        shadowColor: 'rgba(16, 185, 129, 0.4)',
        glowColor: 'rgba(255, 140, 66, 0.3)',
    },
    Poem: {
        bgGradient: 'linear-gradient(135deg, #4C1D95 0%, #7C2D92 50%, #BE185D 100%)',
        textColor: '#FAE8FF',
        accentColor: '#E879F9',
        accentTextColor: '#4C1D95',
        borderColor: '#EC4899',
        shadowColor: 'rgba(236, 72, 153, 0.4)',
        glowColor: 'rgba(232, 121, 249, 0.3)',
    },
    'Day Special': {
        bgGradient: 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)',
        textColor: '#FFFBEB',
        accentColor: '#EF4444',
        accentTextColor: '#FFFFFF',
        borderColor: '#FACC15',
        shadowColor: 'rgba(250, 204, 21, 0.4)',
        glowColor: 'rgba(239, 68, 68, 0.3)',
    },
    Stories: {
        bgGradient: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #DC2626 100%)',
        textColor: '#FEE2E2',
        accentColor: '#C084FC',
        accentTextColor: '#FFFFFF',
        borderColor: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.4)',
        glowColor: 'rgba(192, 132, 252, 0.3)',
    },
    Essay: {
        bgGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)',
        textColor: '#F9FAFB',
        accentColor: '#60A5FA',
        accentTextColor: '#111827',
        borderColor: '#6B7280',
        shadowColor: 'rgba(107, 114, 128, 0.4)',
        glowColor: 'rgba(96, 165, 250, 0.3)',
    },
    'Good Thoughts': {
        bgGradient: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 50%, #0284C7 100%)',
        textColor: '#F0F9FF',
        accentColor: '#4ADE80',
        accentTextColor: '#0C4A6E',
        borderColor: '#06B6D4',
        shadowColor: 'rgba(6, 182, 212, 0.4)',
        glowColor: 'rgba(74, 222, 128, 0.3)',
    },
};

const categoryIcons = {
    News: '📰',
    Speech: '🎤',
    Poem: '📜',
    'Day Special': '🎉',
    Stories: '📚',
    Essay: '✍️',
    'Good Thoughts': '💭',
};

// Helper function to get theme colors
const getTheme = (category, themes) => themes[category] || themes['News'];

// --- Main Component ---
function CommunityDetails() {
    const { communityName, threadId } = useParams();
    const [thread, setThread] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This useEffect handles fetching data from Firebase
    useEffect(() => {
        const threadRef = ref(database, `CommunityChats/${communityName}/Threads/${threadId}`);
        const unsubscribe = onValue(threadRef, (snapshot) => {
            if (snapshot.exists()) {
                setThread(snapshot.val());
                setError(null);
            } else {
                setError('Thread not found. It might have been moved or deleted. Please ensure the URL is correct or try a different thread.');
            }
            setLoading(false);
        }, (dbError) => {
            setError(`Failed to load content: ${dbError.message}. This could be a network issue or missing data.`);
            setLoading(false);
        });

        return () => off(threadRef, 'value', unsubscribe);
    }, [communityName, threadId]);

    // Determine the current theme based on the fetched thread's category.
    const currentTheme = getTheme(thread?.category, categoryThemes);

    // This useEffect applies CSS variables based on the determined theme.
    useEffect(() => {
        if (currentTheme) {
            document.documentElement.style.setProperty('--bg-gradient', currentTheme.bgGradient);
            document.documentElement.style.setProperty('--text-color', currentTheme.textColor);
            document.documentElement.style.setProperty('--accent-color', currentTheme.accentColor);
            document.documentElement.style.setProperty('--accent-text-color', currentTheme.accentTextColor);
            document.documentElement.style.setProperty('--border-color', currentTheme.borderColor);
            document.documentElement.style.setProperty('--shadow-color', currentTheme.shadowColor);
            document.documentElement.style.setProperty('--glow-color', currentTheme.glowColor);

            // Dynamic button colors for contrast
            document.documentElement.style.setProperty('--button-text-color',
                currentTheme.accentTextColor === '#FFFFFF' ? '#FFFFFF' : currentTheme.textColor);
            document.documentElement.style.setProperty('--button-bg-color',
                currentTheme.accentTextColor === '#FFFFFF' ? currentTheme.accentColor : 'transparent');

            // Lighter accent text color for meta labels
            document.documentElement.style.setProperty('--accent-text-color-light',
                currentTheme.accentTextColor === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : currentTheme.accentTextColor);
        }
    }, [currentTheme]);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <motion.div
                    className="spinner-container"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="spinner" />
                    <div className="spinner-glow" />
                </motion.div>
                <motion.p
                    className="loading-text"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                >
                    Summoning the content from the cloud...
                </motion.p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <motion.div
                    className="error-box"
                    initial={{ scale: 0.9, opacity: 0, y: -30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="error-icon">⚠️</div>
                    <h2 className="error-title">Content Unavailable</h2>
                    <p className="error-message">{error}</p>
                    <p className="error-hint">If you believe this is an error, please contact support with the URL you're trying to access.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {/* Animated Background Elements */}
            <div className="background-elements">
                <div className="floating-orb orb-1" />
                <div className="floating-orb orb-2" />
                <div className="floating-orb orb-3" />
            </div>

            {/* Download App Banner */}
            <motion.header
                className="download-banner"
                initial={{ y: -100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            >
                <div className="banner-content">
                    <motion.div
                        className="banner-icon-wrapper"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <ArrowDownTrayIcon className="download-icon" />
                    </motion.div>
                    <div className="banner-text-wrapper">
                        <span className="banner-text-main">Unlock the full potential</span>
                        <span className="banner-text-sub">Get the SmartGuruji App!</span>
                    </div>
                </div>
                <motion.a
                    href="https://play.google.com/store/apps/details?id=com.spark.smartguruji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <span>Download on Play Store</span>
                    <div className="button-shine" />
                </motion.a>
            </motion.header>

            {/* Main Content Area */}
            <div className="content-grid">
                {/* Left Side: Thread Content */}
                <motion.div
                    className="main-content-panel base-panel"
                    initial={{ x: -100, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                    <div className="content-header">
                        <motion.div
                            className="category-tag"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        >
                            <span className="category-icon">📝</span>
                            {thread.category || 'General Discussions'}
                            <div className="category-glow" />
                        </motion.div>

                        <motion.h2
                            className="thread-title"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            {thread.title || 'Insightful Community Thread'}
                        </motion.h2>
                    </div>

                    {thread.imageUrl && (
                        <motion.div
                            className="image-container"
                            initial={{ y: 30, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
                            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                        >
                            <img
                                src={thread.imageUrl}
                                alt={thread.title || 'Thread Image'}
                                className="thread-image"
                            />
                            <div className="image-overlay" />
                        </motion.div>
                    )}

                    <motion.div
                        className="description-container"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <p className="thread-description">
                            {thread.desc || 'Awaiting captivating content for this thread. Stay tuned for more engaging discussions!'}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Right Side: Meta Information */}
                <motion.div
                    className="meta-sidebar base-panel"
                    initial={{ x: 100, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                    <motion.h3
                        className="sidebar-title"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <span className="title-icon">📊</span>
                        Content Insights
                    </motion.h3>

                    <div className="meta-items">
                        {[
                            { label: 'Authored By', value: thread.senderUser || 'Community Expert', icon: '👤' },
                            { label: 'Published On', value: formatTimestamp(thread.timestamp), icon: '📅' },
                            { label: 'Engagements (Likes)', value: thread.likeCount || 0, icon: '❤️' },
                            { label: 'Total Views', value: thread.viewCount || 0, icon: '👁️' }
                        ].map((item, index) => (
                            <motion.div
                                key={item.label}
                                className="meta-item-container"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <span className="meta-label">
                                    <span className="meta-icon">{item.icon}</span>
                                    {item.label}:
                                </span>
                                <span className="meta-value">{item.value}</span>
                                <div className="meta-underline" />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="sidebar-decoration"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}

export default CommunityDetails;