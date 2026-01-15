import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Exam = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Dashboard'dan gelen başlık (Sadece görüntü amaçlı)
    const skillType = location.state?.skill || "Genel Test"; 

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- 1. ADIM: TÜM SORULARI HAVUZDAN ÇEK ---
    useEffect(() => {
        const fetchAllQuestions = async () => {
            try {
                console.log("Veritabanındaki tüm sorular isteniyor...");

                // 👇 KRİTİK DEĞİŞİKLİK:
                // /exams/start yerine /questions endpoint'ini kullanıyoruz.
                // Bu endpoint genellikle veritabanındaki HER ŞEYİ verir.
                // Router prefix'i "/exams" olduğu için yeni adresimiz "/exams/all" oldu.
                const response = await api.get('/exams/all');
                
                // Eğer cevap boşsa veya dizi değilse
                if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                    alert("Veritabanından soru çekilemedi! (Liste boş)");
                    navigate('/dashboard');
                    return;
                }

                console.log(`Toplam ${response.data.length} adet soru geldi.`);

                // Soruları Karıştır (Shuffle) 🎲
                // Backend karıştırmıyorsa biz karıştırırız!
                const mixedQuestions = response.data.sort(() => 0.5 - Math.random());

                // İstersen soru sayısını sınırlayabilirsin (Örn: Sadece 10 soru sor)
                // const finalQuestions = mixedQuestions.slice(0, 10); 
                
                setQuestions(mixedQuestions);
                setLoading(false);

            } catch (error) {
                console.error("Soru Çekme Hatası:", error);
                
                // Eğer /questions endpoint'i yoksa (404) kullanıcıyı uyaralım
                if (error.response && error.response.status === 404) {
                    alert("Hata: Backend'de '/questions' adında bir listeleme sayfası bulunamadı.");
                } else {
                    alert("Sorular yüklenirken bir hata oluştu.");
                }
                navigate('/dashboard');
            }
        };

        fetchAllQuestions();
    }, [navigate]);

    // --- CEVAPLAMA İŞLEMLERİ (AYNI) ---
    const handleOptionSelect = (key) => setSelectedOption(key);

    const handleNext = async () => {
        const currentQuestion = questions[currentIndex];
        const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOption };
        setUserAnswers(newAnswers);

        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentIndex(nextIndex);
            setSelectedOption(null);
        } else {
            await submitExam(newAnswers);
        }
    };

    const submitExam = async (finalAnswers) => {
        try {
            // Sınav sonucu yine eski endpoint'e gidiyor (orası çalışıyor)
            const response = await api.post('/exams/submit', {
                skill_type: "Mixed", // Karma test olduğu için
                difficulty: "Mixed",
                answers: finalAnswers
            });
            setScore(response.data.score);
            setIsFinished(true);
        } catch (error) {
            console.error("Sonuç hatası:", error);
            // Hata olsa bile kullanıcıyı bitiş ekranında tut
            setIsFinished(true); 
        }
    };

    // --- EKRANLAR ---
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <h2 className="text-xl font-bold">Sorular Hazırlanıyor...</h2>
        </div>
    );

    if (isFinished) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100">
                    <div className="text-6xl mb-6">🎉</div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Sınav Tamamlandı!</h2>
                    <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                        <span className="block text-sm text-blue-600 font-bold uppercase tracking-wide">Puanın</span>
                        <span className="text-6xl font-black text-blue-700">{score}</span>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
                        Ana Menüye Dön
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return <div>Hata oluştu.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-3xl flex justify-between items-center mb-8">
                <span className="text-gray-500 font-medium">Mod: <span className="text-gray-900 font-bold">{skillType}</span></span>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
                    Soru {currentIndex + 1} / {questions.length}
                </span>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-3xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
                    {currentQuestion.question_text}
                </h2>

                <div className="space-y-4">
                    {/* Backend options nesnesi {A:..., B:...} geliyor */}
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <div 
                            key={key}
                            onClick={() => handleOptionSelect(key)}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center
                                ${selectedOption === key ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-100 hover:border-blue-200'}`}
                        >
                            <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold mr-4
                                ${selectedOption === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {key}
                            </span>
                            <span className="text-lg font-medium text-gray-700">{value}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-end">
                    <button 
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl
                            ${selectedOption ? 'bg-blue-600 hover:bg-blue-700 scale-105' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        {currentIndex + 1 === questions.length ? 'Bitir' : 'İleri →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Exam;