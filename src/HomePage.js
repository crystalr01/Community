// src/HomePage.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { FaThumbsUp, FaEye, FaTag, FaUsers, FaClock, FaUser } from 'react-icons/fa';

function HomePage() {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const db = getDatabase();
        const communityRef = ref(db, 'CommunityChats/');

        const unsubscribe = onValue(
            communityRef,
            (snapshot) => {
                const data = snapshot.val();
                let allThreads = [];

                if (data) {
                    Object.entries(data).forEach(([district, districtData]) => {
                        const threadsData = districtData?.Threads;
                        if (threadsData) {
                            Object.entries(threadsData).forEach(([id, thread]) => {
                                allThreads.push({
                                    ...thread,
                                    id,
                                    community: district,
                                });
                            });
                        }
                    });

                    allThreads.sort((a, b) => b.timestamp - a.timestamp);
                }

                setThreads(allThreads);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleThreadClick = (community, id) => {
        const encodedCommunity = encodeURIComponent(community);
        navigate(`/community/${encodedCommunity}/${id}`);
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return postDate.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="homepage-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Discovering amazing threads...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="homepage-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <p className="error-text">Oops! Something went wrong</p>
                    <p className="error-details">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-container">
            <div className="hero-section">
                <h1 className="homepage-title">
                    <span className="title-gradient">🌟 Discover</span>
                    <span className="title-highlight">Community Threads</span>
                </h1>
                <p className="hero-subtitle">
                    Connect, share, and explore with your school community
                </p>
                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-number">{threads.length}</span>
                        <span className="stat-label">Active Threads</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{new Set(threads.map(t => t.community)).size}</span>
                        <span className="stat-label">Communities</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{threads.reduce((sum, t) => sum + (t.likeCount || 0), 0)}</span>
                        <span className="stat-label">Total Likes</span>
                    </div>
                </div>
            </div>

            {threads.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No threads yet</h3>
                    <p>Be the first to start a conversation!</p>
                </div>
            ) : (
                <div className="thread-card-grid">
                    {threads.map((thread, index) => (
                        <div
                            key={thread.id}
                            className={`thread-card ${index < 3 ? 'featured-card' : ''}`}
                            onClick={() => handleThreadClick(thread.community, thread.id)}
                        >
                            {thread.imageUrl && (
                                <div className="thread-image-container">
                                    <img src={thread.imageUrl} alt={thread.title} className="thread-image" />
                                    <div className="image-overlay">
                                        <span className="category-badge">{thread.category}</span>
                                    </div>
                                </div>
                            )}

                            <div className="thread-card-content">
                                <div className="thread-header">
                                    <h3 className="thread-title">{thread.title}</h3>
                                    {index < 3 && <span className="trending-badge">🔥 Trending</span>}
                                </div>

                                <p className="thread-desc">{thread.desc}</p>

                                <div className="meta-row">
                                    <div className="meta-block">
                                        <FaUsers className="meta-icon user-icon" />
                                        <span className="meta-text">{thread.community}</span>
                                    </div>

                                    {!thread.imageUrl && (
                                        <div className="meta-block">
                                            <FaTag className="meta-icon tag-icon" />
                                            <span className="meta-text">{thread.category}</span>
                                        </div>
                                    )}
                                </div>


                                <div className="thread-stats-row">
                                    <div className="stats-left">
                                        <div className="stat-pill likes">
                                            <FaThumbsUp className="stat-icon" />
                                            <span>{thread.likeCount || 0}</span>
                                        </div>
                                        <div className="stat-pill views">
                                            <FaEye className="stat-icon" />
                                            <span>{thread.viewCount || 0}</span>
                                        </div>
                                    </div>
                                    <div className="time-ago">
                                        <FaClock className="time-icon" />
                                        <span>{getTimeAgo(thread.timestamp)}</span>
                                    </div>
                                </div>

                                <div className="thread-footer">
                                    <div className="author-info">
                                        <FaUser className="author-icon" />
                                        <span className="author-name">
                                            {['8055514368', '8600876577'].includes(thread.senderUser)
                                                ? 'Expert Guruji'
                                                : thread.senderUser}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;