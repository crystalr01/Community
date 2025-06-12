import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import './DistrictCommunities.css';

function DistrictCommunities() {
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const db = getDatabase();
        const communityRef = ref(db, 'CommunityChats/');

        const unsubscribe = onValue(
            communityRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const districtNames = Object.keys(data).filter(
                        district => !/^\d+$/.test(district) // Filter out all-digit district names
                    );
                    setDistricts(districtNames);
                } else {
                    setDistricts([]);
                }
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedCommunity) return;
        setLoading(true);
        setError(null);

        const db = getDatabase();
        const threadsRef = ref(db, `CommunityChats/${selectedCommunity}/Threads`);

        const unsubscribe = onValue(
            threadsRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const threadList = Object.entries(data).map(([id, thread]) => ({
                        id,
                        ...thread,
                    }));
                    setThreads(threadList);
                } else {
                    setThreads([]);
                }
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [selectedCommunity]);

    const handleDistrictClick = (district) => {
        setSelectedDistrict(district);
        setSelectedCommunity(district);
    };

    const handleBackToDistricts = () => {
        setSelectedDistrict(null);
        setSelectedCommunity(null);
        setThreads([]);
    };

    const handleThreadClick = (threadId) => {
        const encodedDistrict = encodeURIComponent(selectedCommunity);
        navigate(`/community/${encodedDistrict}/${threadId}`);
    };

    return (
        <div className="district-communities-container">
            <div className="header-section">
                <h1 className="main-heading">District Communities</h1>
                <p className="sub-heading">Connect with your local education community</p>
            </div>

            {!selectedDistrict && (
                <div className="district-section">
                    <div className="section-header">
                        <h2>Select Your District</h2>
                        <div className="divider"></div>
                    </div>

                    {loading && <div className="loading-spinner"></div>}
                    {error && <div className="error-message">Error: {error}</div>}

                    <div className="district-grid">
                        {districts.map((district, index) => (
                            <div
                                key={district}
                                className="district-card"
                                onClick={() => handleDistrictClick(district)}
                            >
                                <div className="card-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <h3>{district}</h3>
                                <p>Explore community discussions</p>
                                <div className="card-footer">
                                    <span class="view-threads">View Threads  <svg viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                    </svg> </span>

                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && districts.length === 0 && (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <p>No districts available at this time</p>
                        </div>
                    )}
                </div>
            )}

            {selectedCommunity && (
                <div className="threads-section">
                    <button onClick={handleBackToDistricts} className="back-button">
                        <ArrowLeftIcon className="toggle-icon" />
                        Back to Districts
                    </button>

                    <div className="section-header">
                        <h2>{selectedCommunity} Community Discussions</h2>
                        <div className="divider"></div>
                    </div>

                    {loading && <div className="loading-spinner"></div>}
                    {error && <div className="error-message">Error: {error}</div>}

                    {threads.length > 0 ? (
                        <div className="threads-grid">
                            {threads.map((thread) => (
                                <div
                                    key={thread.id}
                                    className="thread-card"
                                    onClick={() => handleThreadClick(thread.id)}
                                >
                                    <div className="card-header">
                                        {/* {thread.imageUrl && (
                                            <img
                                                src={thread.imageUrl}
                                                alt={thread.title}
                                                className="thread-image"
                                            />
                                        )} */}
                                        <div className="category-badge">{thread.category}</div>
                                    </div>
                                    <div className="card-body">
                                        <h3>{thread.title}</h3>
                                        <p className="thread-desc">{thread.desc}</p>
                                    </div>
                                    <div className="card-footer">
                                        <div className="meta-info">
                                            <div className="user-info">
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                <span>{["8055514368", "8600876577"].includes(thread.senderUser) ? "Expert Guruji" : thread.senderUser}</span>

                                            </div>
                                            <div className="date-info">
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                                                </svg>
                                                <span>{new Date(thread.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="meta-info">
                                            <div className="user-info">
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
                                                </svg>
                                                <span>{thread.likeCount || 0}</span>
                                            </div>
                                            <div className="user-info">
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                </svg>
                                                <span>{thread.viewCount || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="empty-state">
                                <svg viewBox="0 0 24 24">
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                                <p>No discussions found in this community</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default DistrictCommunities;