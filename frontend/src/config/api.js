// API Configuration for AI Diagnostic Engine

const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // Relative path for unified deployment
const WS_BASE_URL = import.meta.env.VITE_WS_URL || window.location.origin.replace(/^http/, 'ws');

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/v1/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/api/v1/auth/resend-verification`,
    REQUEST_PASSWORD_RESET: `${API_BASE_URL}/api/v1/auth/request-password-reset`,
    RESET_PASSWORD: `${API_BASE_URL}/api/v1/auth/reset-password`,
    PROFILE: `${API_BASE_URL}/api/v1/users/me`
  },

  // User Management
  USER: {
    UPDATE_LEARNING_PURPOSE: `${API_BASE_URL}/api/v1/users/me/purpose`,
    EXAM_HISTORY: `${API_BASE_URL}/api/v1/users/exam-history`,
    ANALYTICS: `${API_BASE_URL}/api/v1/users/analytics`,
    STUDY_PLAN: `${API_BASE_URL}/api/v1/users/study-plan`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/v1/users/account`
  },

  // Exams
  EXAM: {
    START: `${API_BASE_URL}/api/v1/exams/start`,
    ACTIVE: `${API_BASE_URL}/api/v1/exams/active`,
    TEST_POOL: `${API_BASE_URL}/api/v1/exams/test-pool`,
    NEXT_QUESTION: (examId) => `${API_BASE_URL}/api/v1/exams/${examId}/question`,
    GET_HINT: (examId, questionId) => `${API_BASE_URL}/api/v1/exams/${examId}/question/${questionId}/hint`,
    SUBMIT_ANSWER: (examId) => `${API_BASE_URL}/api/v1/exams/${examId}/answer`
  },

  // Assessments
  ASSESSMENT: {
    SUBMIT_EXAM: (examId) => `${API_BASE_URL}/api/assessments/${examId}/submit`,
    ANALYZE_EXAM: (examId) => `${API_BASE_URL}/api/assessments/${examId}/analyze`,
    GET_RESULTS: (examId) => `${API_BASE_URL}/api/assessments/${examId}/results`,
    WRITING_FEEDBACK: `${API_BASE_URL}/api/assessments/writing-feedback`,
    SPEAKING_FEEDBACK: `${API_BASE_URL}/api/assessments/speaking-feedback`
  },

  // Admin
  ADMIN: {
    SYSTEM_HEALTH: `${API_BASE_URL}/api/v1/admin/health`,
    ALL_USERS: `${API_BASE_URL}/api/v1/admin/users`,
    USER_DETAILS: (userId) => `${API_BASE_URL}/api/v1/admin/users/${userId}`,
    UPDATE_ROLE: (userId) => `${API_BASE_URL}/api/v1/admin/users/${userId}/role`,
    DELETE_USER: (userId) => `${API_BASE_URL}/api/v1/admin/users/${userId}`,
    USAGE_REPORTS: `${API_BASE_URL}/api/v1/admin/reports/usage`,
    METRICS: `${API_BASE_URL}/api/v1/admin/metrics`
  }
};

// WebSocket URL
export const WEBSOCKET_URL = WS_BASE_URL;

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// API request helper with error handling
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default {
  API_ENDPOINTS,
  WEBSOCKET_URL,
  getAuthHeaders,
  apiRequest
};
