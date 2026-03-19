import React, { useState } from 'react';
import './SignUp.css'; 
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        place: "",
        pincode: "",
        photo: null,
        password: "",
        confirmPassword: "",
        gender: "",
        dob: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
        isLongEnough: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const nav = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const validatePassword = (password) => {
        const strength = {
            score: 0,
            hasLower: /[a-z]/.test(password),
            hasUpper: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            isLongEnough: password.length >= 8
        };

        // Calculate score
        strength.score = [
            strength.hasLower,
            strength.hasUpper,
            strength.hasNumber,
            strength.hasSpecial,
            strength.isLongEnough
        ].filter(Boolean).length;

        setPasswordStrength(strength);
        return strength;
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        } else if (formData.name.length > 50) {
            newErrors.name = "Name must be less than 50 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email address is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (formData.mobile && !mobileRegex.test(formData.mobile)) {
            newErrors.mobile = "Please enter a valid 10-digit mobile number";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else {
            const strength = validatePassword(formData.password);
            if (!strength.isLongEnough) {
                newErrors.password = "Password must be at least 8 characters long";
            } else if (!strength.hasLower || !strength.hasUpper) {
                newErrors.password = "Password must contain both uppercase and lowercase letters";
            } else if (!strength.hasNumber) {
                newErrors.password = "Password must contain at least one number";
            } else if (!strength.hasSpecial) {
                newErrors.password = "Password must contain at least one special character";
            }
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Pincode validation
        if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Please enter a valid 6-digit pincode";
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = "Please select your gender";
        }

        // DOB validation
        if (!formData.dob) {
            newErrors.dob = "Date of birth is required";
        } else {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 13) {
                newErrors.dob = "You must be at least 13 years old";
            } else if (age > 120) {
                newErrors.dob = "Please enter a valid date of birth";
            }
        }

        // Photo validation
        if (formData.photo && formData.photo.size > 5 * 1024 * 1024) {
            newErrors.photo = "Photo size should be less than 5MB";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'photo' && files[0]) {
            setFormData(prev => ({ ...prev, photo: files[0] }));
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            
            // Validate password in real-time
            if (name === 'password') {
                validatePassword(value);
            }
        }

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const getPasswordStrengthColor = () => {
        const { score } = passwordStrength;
        if (score <= 2) return '#ff6b6b'; // Weak - Red
        if (score === 3) return '#ffd93d'; // Medium - Yellow
        if (score === 4) return '#6b8cff'; // Good - Blue
        return '#51cf66'; // Strong - Green
    };

    const getPasswordStrengthText = () => {
        const { score } = passwordStrength;
        if (score <= 2) return 'Weak';
        if (score === 3) return 'Medium';
        if (score === 4) return 'Good';
        return 'Strong';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '' && key !== 'confirmPassword') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const res = await axios.post(`${apiUrl}usersigup`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.status === "ok") {
                alert(res.data.message);
                nav('/');
            }
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred during signup");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="hospital-bg-overlay"></div>
            <div className="signup-card glass-effect">
                <div className="signup-header">
                    <div className="hospital-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v3h3v2h-3v3h-2v-3H8v-2h3V7z"/>
                        </svg>
                    </div>
                    <h2>Patient Registration</h2>
                    <p>Join our healthcare network for better care</p>
                </div>

                <form onSubmit={onSubmit} className="signup-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Full Name <span className="required">*</span>
                            </label>
                            <input
                                id="username"
                                name="name"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email Address <span className="required">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                name="mobile"
                                className={`form-input ${errors.mobile ? 'error' : ''}`}
                                type="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter 10-digit mobile number"
                                maxLength="10"
                            />
                            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="gender">
                                Gender <span className="required">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className={`form-select ${errors.gender ? 'error' : ''}`}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="dob">
                                Date of Birth <span className="required">*</span>
                            </label>
                            <input
                                id="dob"
                                name="dob"
                                className={`form-input ${errors.dob ? 'error' : ''}`}
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.dob && <span className="error-message">{errors.dob}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="place">City / Location</label>
                            <input
                                id="place"
                                name="place"
                                className="form-input"
                                type="text"
                                value={formData.place}
                                onChange={handleChange}
                                placeholder="Enter your city"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="pincode">Pincode</label>
                            <input
                                id="pincode"
                                name="pincode"
                                className={`form-input ${errors.pincode ? 'error' : ''}`}
                                type="text"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter 6-digit pincode"
                                maxLength="6"
                            />
                            {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group password-group">
                            <label className="form-label" htmlFor="password">
                                Password <span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            {/* Password strength indicator */}
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar-container">
                                        <div 
                                            className="strength-bar"
                                            style={{
                                                width: `${(passwordStrength.score / 5) * 100}%`,
                                                backgroundColor: getPasswordStrengthColor()
                                            }}
                                        ></div>
                                    </div>
                                    <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                                        {getPasswordStrengthText()}
                                    </span>
                                </div>
                            )}

                            {/* Password requirements checklist */}
                            {formData.password && (
                                <div className="password-requirements">
                                    <p className="requirements-title">Password must contain:</p>
                                    <ul className="requirements-list">
                                        <li className={passwordStrength.isLongEnough ? 'valid' : 'invalid'}>
                                            <span className="requirement-icon">
                                                {passwordStrength.isLongEnough ? '✓' : '○'}
                                            </span>
                                            At least 8 characters
                                        </li>
                                        <li className={passwordStrength.hasLower && passwordStrength.hasUpper ? 'valid' : 'invalid'}>
                                            <span className="requirement-icon">
                                                {passwordStrength.hasLower && passwordStrength.hasUpper ? '✓' : '○'}
                                            </span>
                                            Uppercase & lowercase letters
                                        </li>
                                        <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
                                            <span className="requirement-icon">
                                                {passwordStrength.hasNumber ? '✓' : '○'}
                                            </span>
                                            At least one number
                                        </li>
                                        <li className={passwordStrength.hasSpecial ? 'valid' : 'invalid'}>
                                            <span className="requirement-icon">
                                                {passwordStrength.hasSpecial ? '✓' : '○'}
                                            </span>
                                            At least one special character (!@#$%^&*)
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">
                                Confirm Password <span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="form-group photo-upload-group">
                        <label className="form-label" htmlFor="photo">Profile Photo</label>
                        <div className="photo-upload-container">
                            {previewImage && (
                                <div className="photo-preview glass-effect">
                                    <img src={previewImage} alt="Preview" />
                                </div>
                            )}
                            <div className="upload-controls">
                                <input
                                    id="photo"
                                    name="photo"
                                    className={`file-input ${errors.photo ? 'error' : ''}`}
                                    type="file"
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                                <small className="file-hint">Maximum size: 5MB (JPG, PNG)</small>
                            </div>
                        </div>
                        {errors.photo && <span className="error-message">{errors.photo}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className="signup-submit-btn glass-effect"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Register as Patient'
                        )}
                    </button>

                    <p className="login-link">
                        Already have an account? <Link to="/">Sign in to Patient Portal</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;