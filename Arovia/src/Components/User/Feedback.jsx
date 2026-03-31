// Feedback.jsx - Redesigned with new color patterns
import React, { useState } from 'react';
import './Feedback.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Feedback() {
    const [formData, setFormData] = useState({
        review: '',
        rating: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleRatingSelect = (rating) => {
        setFormData({ ...formData, rating: rating.toString() });
        if (errors.rating) {
            setErrors({ ...errors, rating: '' });
        }
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.review.trim()) {
            newErrors.review = "Please share your experience";
        } else if (formData.review.length < 5) {
            newErrors.review = "Please write at least 5 characters";
        } else if (formData.review.length > 500) {
            newErrors.review = "Review cannot exceed 500 characters";
        }

        if (!formData.rating) {
            newErrors.rating = "Please select a rating";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const lid = sessionStorage.getItem("lid");
            const res = await axios.post(`${apiUrl}addFeedback`, {
                review: formData.review,
                rating: formData.rating,
                lid: lid
            });

            if (res.data.status === "ok") {
                alert("Thank you for your valuable feedback!");
                setFormData({ review: '', rating: '' });
                setSubmitted(true);
                setTimeout(() => {
                    navigate('/userhome');
                }, 2000);
            } else {
                alert(res.data.message || "Error submitting feedback");
            }

        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert(error.response?.data?.message || "Error submitting feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getRatingLabel = (rating) => {
        const labels = {
            1: { text: "Poor", icon: "😞", color: "#ef4444" },
            2: { text: "Fair", icon: "😐", color: "#f59e0b" },
            3: { text: "Good", icon: "🙂", color: "#3b82f6" },
            4: { text: "Very Good", icon: "😊", color: "#10b981" },
            5: { text: "Excellent", icon: "🤩", color: "#8b5cf6" }
        };
        return labels[rating] || { text: "", icon: "", color: "" };
    };

    const getRatingEmoji = (rating) => {
        const emojis = {
            1: "😞",
            2: "😐",
            3: "🙂",
            4: "😊",
            5: "🤩"
        };
        return emojis[rating] || "";
    };

    return (
        <div className="feedback-container">
            <div className="feedback-card">
                {/* Header */}
                <div className="feedback-header">
                    <div className="header-icon">
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <h2>Your Voice Matters</h2>
                    <p>Help us improve your healthcare experience</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="feedback-form">
                        {/* Rating Section */}
                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-star"></i>
                                How was your experience?
                                <span className="required">*</span>
                            </label>
                            <div className="rating-container">
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const ratingInfo = getRatingLabel(star);
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`star-btn ${formData.rating >= star ? 'active' : ''} ${hoveredRating >= star ? 'hover' : ''}`}
                                                onClick={() => handleRatingSelect(star)}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                title={ratingInfo.text}
                                            >
                                                <span className="star-emoji">{ratingInfo.icon}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {formData.rating && (
                                    <div className="rating-feedback">
                                        <div className="rating-emoji-large">
                                            {getRatingEmoji(parseInt(formData.rating))}
                                        </div>
                                        <div className="rating-info">
                                            <span className={`rating-badge rating-${formData.rating}`}>
                                                {getRatingLabel(parseInt(formData.rating)).text}
                                            </span>
                                            <p className="rating-message">
                                                {formData.rating == 5 && "Amazing! We're thrilled you had a great experience!"}
                                                {formData.rating == 4 && "Great! We're glad you enjoyed your visit!"}
                                                {formData.rating == 3 && "Thanks for your feedback. We'll work to improve!"}
                                                {formData.rating == 2 && "Sorry to hear that. We'll do better!"}
                                                {formData.rating == 1 && "We apologize. Please share how we can improve."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.rating && <span className="error-message">{errors.rating}</span>}
                        </div>

                        {/* Review Section */}
                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-comment-dots"></i>
                                Share Your Story
                                <span className="required">*</span>
                            </label>
                            <div className="textarea-wrapper">
                                <textarea
                                    name="review"
                                    className={`form-textarea ${errors.review ? 'error' : ''} ${focusedField === 'review' ? 'focused' : ''}`}
                                    value={formData.review}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('review')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Tell us about your experience... What did you like? How can we improve?"
                                    rows="6"
                                    maxLength="500"
                                />
                                <div className="textarea-decoration">
                                    <i className="fas fa-quote-left"></i>
                                </div>
                            </div>
                            <div className="character-count">
                                <span className={formData.review.length > 450 ? 'warning' : ''}>
                                    {formData.review.length}/500 characters
                                </span>
                                {formData.review.length > 0 && (
                                    <span className="word-count">
                                        ~{Math.ceil(formData.review.length / 5)} words
                                    </span>
                                )}
                            </div>
                            {errors.review && <span className="error-message">{errors.review}</span>}
                        </div>

                        {/* Tips Section */}
                        <div className="feedback-tips">
                            <div className="tips-header">
                                <i className="fas fa-lightbulb"></i>
                                <span>Writing Great Feedback</span>
                            </div>
                            <div className="tips-grid">
                                <div className="tip-card">
                                    <i className="fas fa-user-md"></i>
                                    <p>Mention doctors or staff who made a difference</p>
                                </div>
                                <div className="tip-card">
                                    <i className="fas fa-clock"></i>
                                    <p>Describe waiting times and service speed</p>
                                </div>
                                <div className="tip-card">
                                    <i className="fas fa-building"></i>
                                    <p>Share thoughts on facility cleanliness and comfort</p>
                                </div>
                                <div className="tip-card">
                                    <i className="fas fa-lightbulb"></i>
                                    <p>Suggest improvements you'd like to see</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => navigate('/userhome')}
                            >
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        Send Feedback
                                        <span className="btn-glow"></span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h3>Thank You for Your Feedback!</h3>
                        <p>Your voice helps us create better healthcare experiences.</p>
                        <div className="success-stats">
                            <div className="stat">
                                <i className="fas fa-star"></i>
                                <span>Rating: {formData.rating}/5</span>
                            </div>
                            <div className="stat">
                                <i className="fas fa-smile"></i>
                                <span>We value your opinion</span>
                            </div>
                        </div>
                        <p className="redirect-note">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Feedback;