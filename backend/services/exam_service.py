# Diğer oluşturacağın class dosyalarını buraya çağırıyoruz
# (Bu dosyaları henüz oluşturmadıysan bu satırlar hata verebilir, şimdilik yorum satırı yapabilirsin)
from question_repository import QuestionRepository
from response_repository import ResponseRepository
from ai_diagnostic_engine import AIDiagnosticEngine

class ExamService:
    def __init__(self):
        """
        Class ilk oluştuğunda çalışır. Gerekli araçları (Repo'ları) hazırlar.
        """
        # Diğer class'ları 'self' içine kaydediyoruz ki aşağıda kullanabilelim.
        self.questionRepo = QuestionRepository()
        self.responseRepo = ResponseRepository()
        self.aiEngine = AIDiagnosticEngine()
        
        # Sınavın durumunu takip etmek için basit bir değişken
        self.is_exam_active = False

    # 1. METHOD: initializeExam
    def initializeExam(self):
        """
        Sınavı başlatan fonksiyon.
        Görselde dönüş tipi 'void' (boş) olduğu için 'return' yapmıyoruz.
        """
        print("Sınav başlatılıyor...")
        
        # questionRepo'dan soruları çekebiliriz
        # (Burada fetch_questions diye hayali bir fonksiyon çağırdım)
        questions = self.questionRepo.fetch_questions()
        
        self.is_exam_active = True
        print("Sorular yüklendi ve sınav aktif hale getirildi.")

    # 2. METHOD: processAnswer
    def processAnswer(self, answerData):
        """
        Kullanıcıdan gelen cevabı işleyen fonksiyon.
        Parametre olarak 'answerData' alır.
        """
        if not self.is_exam_active:
            print("Hata: Sınav aktif değil, cevap işlenemez.")
            return

        print(f"Cevap işleniyor: {answerData}")
        
        # Gelen cevabı responseRepo aracılığıyla veritabanına kaydediyoruz
        self.responseRepo.save_response(answerData)
        
        # Belki burada AI motoruna bu cevabı analiz ettirebiliriz
        self.aiEngine.analyze(answerData)

    # 3. METHOD: finalizeSession
    def finalizeSession(self):
        """
        Sınavı bitiren ve oturumu kapatan fonksiyon.
        """
        print("Oturum sonlandırılıyor...")
        
        self.is_exam_active = False
        
        # Sonuçları hesaplatıp kaydedebiliriz
        print("Sınav tamamlandı. Geçmiş olsun!")