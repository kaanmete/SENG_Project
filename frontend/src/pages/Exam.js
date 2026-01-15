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
    // --- 1. ADIM: TÜM SORULARI ÇEK ---
    // --- 1. ADIM: SORULARI ÇEK VE FİLTRELE ---
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // 1. Backend'den TÜM soruları iste (Hepsini getirir)
                const response = await api.get('/exams/all'); 
                
                if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                    alert("Veritabanı boş, soru bulunamadı.");
                    navigate('/dashboard');
                    return;
                }

                // 2. TEMİZLİK: Bozuk (şıksız) soruları ele
                const validQuestions = response.data.filter(q => 
                    q.options && Object.keys(q.options).length > 0
                );

                // 3. KATEGORİ FİLTRESİ: Sadece seçilen dersin sorularını al 🎯
                // (Örn: Sen 'vocabulary' seçtiysen, sadece 'vocabulary' olanları alır)
                // skillType Dashboard'dan geliyor, q.skill_type Backend'den geliyor.
                // Büyük/küçük harf hatası olmasın diye ikisini de küçültüp bakıyoruz.
                const categoryQuestions = validQuestions.filter(q => 
                    q.skill_type && q.skill_type.toLowerCase() === skillType.toLowerCase()
                );

                console.log(`Toplam: ${validQuestions.length}, ${skillType} için bulunan: ${categoryQuestions.length}`);

                if (categoryQuestions.length === 0) {
                    // Eğer o kategoride hiç soru yoksa uyar
                    alert(`"${skillType}" kategorisinde henüz soru eklenmemiş. Diğer dersleri deneyebilirsin.`);
                    navigate('/dashboard');
                    return;
                }

                // 4. KARIŞTIR: Bulunan soruları rastgele sırala 🎲
                const mixedQuestions = categoryQuestions.sort(() => 0.5 - Math.random());
                
                setQuestions(mixedQuestions);
                setLoading(false);

            } catch (error) {
                console.error("Hata:", error);
                alert("Sorular yüklenirken bir hata oluştu.");
                navigate('/dashboard');
            }
        };

        fetchQuestions();
    }, [navigate, skillType]); // skillType değişirse tekrar çalışsın

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

            {/* Soru Kartı */}
            {/* Soru Kartı */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-3xl border border-gray-100">
                
                {/* 👇 GÜNCELLENEN KISIM: Sütun adı 'context_text' olarak düzeltildi */}
                {/* context_text (veya yedek olarak paragraph) varsa ekrana bas */}
                {(currentQuestion.context_text || currentQuestion.paragraph) && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 text-gray-700 text-lg leading-relaxed italic shadow-inner">
                        <h4 className="text-blue-800 font-bold mb-2 not-italic text-sm uppercase tracking-wide">
                            {skillType === 'listening' ? '🔊 Metin (Script)' : '📖 Okuma Parçası'}
                        </h4>
                        {/* Metni burada gösteriyoruz */}
                        {currentQuestion.context_text || currentQuestion.paragraph}
                    </div>
                )}
                {/* 👆 GÜNCELLENEN KISIM BİTTİ */}

                {/* Soru Metni */}
                <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
                    {currentQuestion.question_text}
                </h2>
                
                {/* ... (Şıklar ve Butonlar aynı kalacak) ... */}

                {/* Şıklar */}
                <div className="space-y-4">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <div 
                            key={key}
                            onClick={() => handleOptionSelect(key)}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center group
                                ${selectedOption === key 
                                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                        >
                            <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold mr-4 transition-colors
                                ${selectedOption === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white'}
                            `}>
                                {key}
                            </span>
                            <span className={`text-lg font-medium ${selectedOption === key ? 'text-blue-900' : 'text-gray-700'}`}>
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Buton */}
                <div className="mt-10 flex justify-end">
                    <button 
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-md
                            ${selectedOption 
                                ? 'bg-blue-600 hover:bg-blue-700 scale-105' 
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {currentIndex + 1 === questions.length ? 'Bitir' : 'İleri →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Exam;