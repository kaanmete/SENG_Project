from app.database import SessionLocal
from app.models import Question

# Database connection
db = SessionLocal()

# 15 Guarantee Writing Topics
topics = [
    # Technology and Society
    "Do you think social media brings people together or drives them apart? Explain your opinion.",
    "Discuss the advantages and disadvantages of artificial intelligence in our daily lives.",
    "Should children be allowed to own smartphones? Why or why not?",
    "How has the internet changed the way we learn/educate ourselves?",
    
    # Work and Education
    "What are the pros and cons of remote working (working from home)?",
    "Should university education be free for everyone? Discuss.",
    "Is it better to work in a team or alone? Explain your preference.",
    "What is your dream job and why would you be good at it?",
    
    # Personal & Life
    "Describe a person who has had a major influence on your life.",
    "Describe your favorite holiday destination and why you like it.",
    "What is the most important quality in a friend? Trust, humor, or intelligence?",
    "If you could live anywhere in the world, where would it be and why?",
    
    # Current Issues
    "How can we solve the traffic problem in big cities?",
    "Do you think plastic bags should be completely banned to save the environment?",
    "Should public transport be free for everyone to reduce pollution?"
]

print("Data entry is starting...")
added_count = 0

for text in topics:
    # 1. First, check if this question already exists (Let's not add the same one again). 
    # We check for both 'Writing' and 'writing'.
    exists = db.query(Question).filter(Question.question_text == text).first()
    
    if not exists:
        new_q = Question(
            skill_type="Writing",  
            difficulty="Medium",   
            question_text=text,
            context_text=None,     
            options={},            
            correct_option=None    
        )
        db.add(new_q)
        added_count += 1
        print(f" + Added: {text[:40]}...")
    else:
        print(f" - It already exists: {text[:40]}...")

db.commit()
print(f"\n✅ Operation Complete! A total of {added_count} new questions have been added.")
print("Now you can go to the Writing page and click the 'Try a New Topic' button.")

db.close()
