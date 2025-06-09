import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Progress } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './LearningPathGenerator.css';

const LearningPathGenerator = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [learningPath, setLearningPath] = useState([]);
    const [userLevel, setUserLevel] = useState('beginner');
    const [timeCommitment, setTimeCommitment] = useState('medium');
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const API_URL = 'http://localhost:5003';

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${API_URL}/blogs`);
            setBlogs(response.data);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            setError('Failed to fetch blogs. Please try again later.');
        }
    };

    const handleTopicSelect = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    const generateLearningPath = async () => {
        if (selectedTopics.length === 0) {
            setError('Please select at least one topic');
            return;
        }

        setGenerating(true);
        setProgress(0);
        setError('');

        // Simulate progress while generating path
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            console.log('Sending request with:', { selectedTopics, userLevel, timeCommitment });
            
            const response = await axios.post(`${API_URL}/api/learning-path/generate`, {
                selectedTopics,
                userLevel,
                timeCommitment
            });

            console.log('Received response:', response.data);

            if (response.data.success) {
                if (response.data.learningPath.length === 0) {
                    setError('No blogs found matching your selected topics. Please try different topics.');
                } else {
                    setLearningPath(response.data.learningPath);
                }
                setProgress(100);
            } else {
                throw new Error(response.data.message || 'Failed to generate learning path');
            }
        } catch (error) {
            console.error('Failed to generate learning path:', error);
            setError(error.response?.data?.message || error.message || 'Failed to generate learning path. Please try again.');
            setLearningPath([]);
        } finally {
            setGenerating(false);
            clearInterval(progressInterval);
        }
    };

    const sortBlogsByComplexity = (blogs, level) => {
        return blogs.sort((a, b) => {
            const complexityA = calculateComplexity(a);
            const complexityB = calculateComplexity(b);
            
            if (level === 'beginner') {
                return complexityA - complexityB;
            } else if (level === 'advanced') {
                return complexityB - complexityA;
            }
            return 0;
        });
    };

    const calculateComplexity = (blog) => {
        // Simple complexity calculation based on content length and technical terms
        const technicalTerms = ['algorithm', 'function', 'variable', 'class', 'object', 'api', 'database'];
        const content = blog.content.toLowerCase();
        const termCount = technicalTerms.reduce((count, term) => 
            count + (content.match(new RegExp(term, 'g')) || []).length, 0
        );
        return termCount + (blog.content.length / 1000);
    };

    const createTimeBasedPath = (blogs, commitment) => {
        const timeEstimates = {
            short: 2,
            medium: 4,
            long: 6
        };
        
        const targetHours = timeEstimates[commitment];
        let currentHours = 0;
        const path = [];

        for (const blog of blogs) {
            const estimatedTime = calculateReadingTime(blog.content);
            if (currentHours + estimatedTime <= targetHours) {
                path.push({
                    ...blog,
                    estimatedTime,
                    order: path.length + 1
                });
                currentHours += estimatedTime;
            }
        }

        return path;
    };

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return wordCount / wordsPerMinute / 60; // Convert to hours
    };

    return (
        <>
            <Header />
            <section className="learning-path-section">
                <Container>
                    <div className="learning-path-header">
                        <h1>Personalized Learning Path Generator</h1>
                        <p>Create your custom learning journey based on your interests and goals</p>
                    </div>

                    <Row>
                        <Col lg="4">
                            <div className="path-settings">
                                <h3>Your Preferences</h3>
                                
                                <div className="setting-group">
                                    <label>Experience Level</label>
                                    <select 
                                        value={userLevel}
                                        onChange={(e) => setUserLevel(e.target.value)}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="setting-group">
                                    <label>Time Commitment</label>
                                    <select 
                                        value={timeCommitment}
                                        onChange={(e) => setTimeCommitment(e.target.value)}
                                    >
                                        <option value="short">Short (2 hours)</option>
                                        <option value="medium">Medium (4 hours)</option>
                                        <option value="long">Long (6 hours)</option>
                                    </select>
                                </div>

                                <div className="setting-group">
                                    <label>Select Topics</label>
                                    <div className="topic-tags">
                                        {['Programming', 'Web Development', 'Data Science', 'AI', 'Machine Learning', 'Cybersecurity'].map(topic => (
                                            <button
                                                key={topic}
                                                className={`topic-tag ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                                                onClick={() => handleTopicSelect(topic)}
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    color="primary"
                                    className="generate-btn"
                                    onClick={generateLearningPath}
                                    disabled={selectedTopics.length === 0 || generating}
                                >
                                    {generating ? 'Generating...' : 'Generate Learning Path'}
                                </Button>

                                {generating && (
                                    <div className="progress-container">
                                        <Progress value={progress} />
                                        <small>Creating your personalized learning path...</small>
                                    </div>
                                )}

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </Col>

                        <Col lg="8">
                            {learningPath.length > 0 ? (
                                <div className="learning-path-content">
                                    <h3>Your Learning Path</h3>
                                    <div className="path-timeline">
                                        {learningPath.map((item, index) => (
                                            <div key={item._id} className="path-item">
                                                <div className="path-number">{item.order}</div>
                                                <div className="path-details">
                                                    <h4>{item.title}</h4>
                                                    <p>{item.content.substring(0, 150)}...</p>
                                                    <div className="path-meta">
                                                        <span className="time-estimate">
                                                            ~{Math.round(item.estimatedTime * 60)} minutes
                                                        </span>
                                                        <Button
                                                            color="link"
                                                            onClick={() => navigate(`/blogs/${item._id}`)}
                                                        >
                                                            Start Learning
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <h3>No Learning Path Generated</h3>
                                    <p>Select your preferences and topics to generate a personalized learning path.</p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default LearningPathGenerator; 