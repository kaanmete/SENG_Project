import axios from 'axios';

// Backend adresi
const api = axios.create({
    baseURL: 'https://backend-production-6792.up.railway.app/',
});

// --- 1. İSTEK (REQUEST) INTERCEPTOR ---
// Her istek gönderilmeden önce buraya uğrar ve Token ekler.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 2. CEVAP (RESPONSE) INTERCEPTOR ---
// Backend'den hata dönerse burası yakalar.
api.interceptors.response.use(
    (response) => {
        // Cevap başarılıysa olduğu gibi devam et
        return response;
    },
    (error) => {
        // Eğer hata 401 (Yetkisiz) ise, Token geçersiz demektir.
        if (error.response && error.response.status === 401) {
            console.warn("Oturum süresi doldu, çıkış yapılıyor...");
            
            // Tokenları temizle
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Kullanıcıyı Login sayfasına at (React Router hook'ları burada çalışmaz, window kullanıyoruz)
            // Eğer login sayfasındaysak tekrar yönlendirme yapma
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
