// SignUp.jsx - Updated with background image and centered branding
import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import bg from '../bg.jpg';

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
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            newErrors.name = "Name should contain only letters and spaces";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email address is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
           alert("Please enter a valid email address")
        }

        // Mobile validation
        const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

        if (formData.mobile && !mobileRegex.test(formData.mobile)) {
            newErrors.mobile = "Enter a valid Indian mobile number (with optional +91)";
            alert("Enter a valid Indian mobile number (with optional +91)")
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

            if (age < 0) {
                newErrors.dob = "Please enter a valid date of birth";
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

            if (name === 'password') {
                validatePassword(value);
            }
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const getPasswordStrengthColor = () => {
        const { score } = passwordStrength;
        if (score <= 2) return '#ef4444';
        if (score === 3) return '#f59e0b';
        if (score === 4) return '#3b82f6';
        return '#10b981';
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
                if (
                    formData[key] !== null &&
                    formData[key] !== '' &&
                    key !== 'confirmPassword'
                ) {
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
            console.log(error);

            if (error.response) {
                const message = error.response.data.message;

                if (message === "Email already registered") {
                    setErrors(prev => ({
                        ...prev,
                        email: "Email already exists"
                    }));
                } else {
                    alert(message);
                }

            } else {
                alert("Network error. Please try again.");
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            {/* Background Image */}
            <div className="signup-bg-image"></div>
            <div className="bg-overlay"></div>

            {/* Signup Card */}
            <div className="signup-card glass-effect">
                {/* Centered Brand Header */}
                <div className="brand-header-centered">
                    <div className="brand-logo-centered">
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <h1 className="brand-name-centered">AROVIA</h1>
                    <p className="brand-tagline-centered">Healthcare Excellence</p>
                </div>

                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">Join our healthcare network for better care</p>

                <form onSubmit={onSubmit} className="signup-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-user"></i>
                                Full Name <span className="required">*</span>
                            </label>
                            <input
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
                            <label className="form-label">
                                <i className="fas fa-envelope"></i>
                                Email Address <span className="required">*</span>
                            </label>
                            <input
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
                            <label className="form-label">
                                <i className="fas fa-phone"></i>
                                Phone Number
                            </label>
                            <input
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
                            <label className="form-label">
                                <i className="fas fa-venus-mars"></i>
                                Gender <span className="required">*</span>
                            </label>
                            <select
                                name="gender"
                                className={`form-select ${errors.gender ? 'error' : ''}`}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-calendar"></i>
                                Date of Birth <span className="required">*</span>
                            </label>
                            <input
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
                            <label className="form-label">
                                <i className="fas fa-map-marker-alt"></i>
                                City / Location
                            </label>
                            <input
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
                            <label className="form-label">
                                <i className="fas fa-mail-bulk"></i>
                                Pincode
                            </label>
                            <input
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
                            <label className="form-label">
                                <i className="fas fa-lock"></i>
                                Password <span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
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
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>

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
                            <label className="form-label">
                                <i className="fas fa-check-circle"></i>
                                Confirm Password <span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
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
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="form-group photo-upload-group">
                        <label className="form-label">
                            <i className="fas fa-camera"></i>
                            Profile Photo
                        </label>
                        <div className="photo-upload-container">
                            {previewImage && (
                                <div className="photo-preview">
                                    <img src={previewImage} alt="Preview" />
                                </div>
                            )}
                            <div className="upload-controls">
                                <input
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
                        className="btn-signup"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus"></i>
                                Register as Patient
                            </>
                        )}
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <p className="login-link">
                        Already have an account? <Link to="/">Sign in to Patient Portal</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;