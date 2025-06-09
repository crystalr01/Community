import React, { useState, useEffect } from 'react';
import './Tutorials.css';

// Vimeo video links
const videoLinks = [
    'https://vimeo.com/1028276603/e0af5499c4',
    'https://vimeo.com/1022467742/e004b71cf9',
    'https://vimeo.com/1022380234/07809a122e',
    'https://vimeo.com/1022379847/a069d9ee8a',
    'https://vimeo.com/1022375491/e16fe1d350',
    'https://vimeo.com/1022375446/c5a3e12da8',
    'https://vimeo.com/1022366821/9a8b385f10',
    'https://vimeo.com/1022366929/22b9e6fe52',
    'https://vimeo.com/1022361053/556799b1fa',
    'https://vimeo.com/1021999186/b5c8afa37f',
    'https://vimeo.com/1021995878/426dab9679',
    'https://vimeo.com/1021996278/82cd5a3c3c',
    'https://vimeo.com/1021993857/8dd638019f',
    'https://vimeo.com/1021993668/68ed7665e9',
];

// Format duration from seconds to "1m 34s"
const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

// Format views to be more readable (e.g., 1234567 -> 1.2M)
const formatViews = (views) => {
    if (views === 'N/A' || !views) return 'N/A views';
    const numViews = parseInt(views, 10);
    if (isNaN(numViews)) return 'N/A views';

    if (numViews >= 1000000) {
        return (numViews / 1000000).toFixed(1) + 'M views';
    }
    if (numViews >= 1000) {
        return (numViews / 1000).toFixed(0) + 'K views'; // Use toFixed(0) for whole numbers of K
    }
    return numViews.toLocaleString() + ' views';
};

// Fetch metadata via oEmbed
const fetchVideoMetadata = async (url) => {
    const apiUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
    console.log('Fetching metadata from:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Extract video ID and hash from the HTML embed code provided by oEmbed
        const match = data.html.match(/player\.vimeo\.com\/video\/(\d+)\?h=([a-zA-Z0-9]+)/);
        if (!match) throw new Error('Unable to extract embed URL or hash.');

        return {
            id: match[1],
            hash: match[2], // This is the 'h' parameter for privacy
            title: data.title,
            description: data.description || 'No description available.',
            thumbnail: data.thumbnail_url,
            duration: formatDuration(data.duration),
            views: formatViews(data.stats_number_of_plays), // Use formatted views
        };
    } catch (error) {
        console.error(`Failed to load metadata for ${url}`, error);
        return null;
    }
};

const Tutorials = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const loadVideos = async () => {
            const metadataList = await Promise.all(videoLinks.map(fetchVideoMetadata));
            const validVideos = metadataList.filter(Boolean);
            setVideos(validVideos);
            setSelectedVideo(validVideos[0]);
        };
        loadVideos();
    }, []);

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top with smooth animation
    };

    if (!selectedVideo) return <div>Loading videos...</div>;

    return (
        <div className="tutorials-container">
            <div className="main-video">
                <div className="video-player">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://player.vimeo.com/video/${selectedVideo.id}?h=${selectedVideo.hash}&autoplay=1`}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="video-details">
                    <h2 className="video-title">{selectedVideo.title}</h2>
                    <p className="video-description">{selectedVideo.description}</p>
                    <div className="video-meta">
                        <span className="video-duration">Duration: {selectedVideo.duration}</span>
                        <span className="video-views">{selectedVideo.views}</span> {/* Display views */}
                        <button className="share-button">
                            <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
            </div>
            <div className="video-sidebar">
                <h3 className="sidebar-title">Recommended Tutorials</h3>
                <div className="video-list">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className={`video-item ${video.id === selectedVideo.id ? 'active' : ''}`}
                            onClick={() => handleVideoSelect(video)}
                        >
                            <div className="thumbnail-container">
                                <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                                <span className="thumbnail-duration">{video.duration}</span>
                            </div>
                            <div className="video-info">
                                <h4>{video.title}</h4>
                                {/* Display views and other metadata like YouTube */}
                                <div className="video-meta-secondary">
                                    <span className="video-views">{video.views}</span>
                                    {/* You can add upload date here if available from oEmbed */}
                                </div>
                                {/* <p>{video.description}</p> -- Description is typically hidden in sidebar for YouTube style */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tutorials;