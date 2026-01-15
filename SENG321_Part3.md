Use Case ID: UC- 18

Primary Actor: User

Goal: To receive an AI-generated study plan with prioritized skills, resources, and schedule
suggestions based on recent performance.

Goal in Context

 To receive an AI-generated study plan with prioritized skills, resources, and schedule
suggestions based on recent performance.
Stakeholders and Interests

 User: Wants a clear, achievable roadmap to improve weak areas.
 System: Produces accurate, realistic plans and keeps them up to date.
Preconditions

 The user is logged in; recent assessment/practice results are available.
Success Guarantee

 A personalized plan is generated and presented in an understandable format.
Basic Flow (Main Success Scenario)

The user opens "My Study Plan."
The system aggregates recent results and learning goals.
The AI ranks weak skills and selects matching activities/resources.
The system displays the plan (goals, weekly tasks, estimated time, links).
The user can accept, adjust, or regenerate the plan.
Alternative / Exceptional Flows (Extensions)

A1 Connection error

 (a) Connection error → The system shows an error and offers retry.
A2 Insufficient data

 (b) Insufficient data → The system requests a short diagnostic to personalize the plan.
System Components (Sequence Diagram Lifelines)

 Actor: User
 Controller: LearningController
 Service: ReportingService
 Repository: ResultRepository, UserRepository
 External Modules / APIs: AIDiagnosticEngine
UC-02 SETTING LEARNING PURPOSE
Use Case Name: Setting Learning Purpose

Use Case ID: UC- 02

Primary Actor: User

Goal: The user sets or updates their learning purpose (e.g., career goal, course preference, study
focus).

Trigger

 User selects "Learning Purpose Settings" from the application.
Preconditions

 User must already be logged in.
 System must have an existing user profile.
Postconditions

 Success:
o The user's learning purpose is saved or updated.
o System stores the preferences for personalization.
 Failure:
o No changes are saved.
o System keeps the old learning purpose.
Basic Flow (Main Success Scenario)

User selects Learning Purpose Settings. (Trigger)
System retrieves the current learning purpose preferences.
System displays the existing values (if any).
User selects or edits learning purpose fields (e.g., language, skill goal, study frequency).
User clicks Save Purpose.
System validates the inputs.
System updates the learning purpose in the database.
System displays a Success Confirmation.
Alternative / Exceptional Flows

A1 Missing/Invalid Input (alt fragment) - Occurs at Step 6

 6a. System detects empty or invalid fields.
 6b. System displays "Invalid or incomplete information."
 6c. User corrects input and retries.
A2 Unsupported Purpose Option (alt fragment) - Occurs at Step 6

 6d. User selects a purpose or option that the system does not support.
 6e. System shows a warning or disables the option.
 6f. User selects a valid purpose.
A3 System/Database Update Failure (exception) - Occurs at Step 7

 7a. System fails to save the data (e.g., database down).
 7b. System shows an error message: "Could not save changes."
 7c. System keeps previous learning purpose.
Synchronous / Asynchronous / Return Message

Synchronous Messages

 User → LearningController: openLearningPurpose()
 LearningController → UserProfileService: getPurpose()
 UserProfileService → UserRepository: fetchPurpose()
 LearningController → UserProfileService: validatePurpose()
 UserProfileService → UserRepository: updatePurpose()
Asynchronous Messages

 saveLearningPurposeAsync(): Once the user selects the learning intent, the system
records it in the background and updates the AI model.
Return Messages

 learningPurpose.saved(): message indicating that the selected learning objective has
been saved.
System Components (Sequence Diagram Lifelines)

 Actor: User
 Controller: LearningController
 Service: UserProfileService
 Repository: UserRepository (database interface)
 External Modules / APIs: AIDiagnosticEngine
UC-03 Taking the AI-Compiled Integrated Exam
Use Case Name: Taking the AI-Compiled Integrated Exam

Use Case ID: UC- 03

Primary Actor: User

Goal: Start and complete the adaptive, CEFR-based integrated exam.

Trigger

 User launches the AI-compiled multi-skill exam from the application.
Preconditions

 User is logged into the system.
 User has access rights to take the integrated exam.
 The system has a pool of questions ready for the adaptive test.
Postconditions

 Success:
o User completes the exam.
o All responses are recorded and available for evaluation.
 Failure:
o Exam cannot start due to system error or network issues.
o User cannot proceed and is shown an error message.
Basic Flow (Main Success Scenario)

User selects "Start Exam".
System initializes the adaptive exam and presents the first question.
User answers the question.
System evaluates the answer and selects the next question adaptively. (Steps 3-4 repeat
until the exam is completed.)
System records all responses and calculates preliminary scores.
Exam completion confirmation is displayed to the user.
Alternative / Exceptional Flows

A1 User requests to pause the exam

 1. User selects "Pause Exam".
 2. System saves the current state and allows resume later.
A2 User loses internet connection

 1. System detects connectivity loss.
 2. Exam is paused automatically.
 3. User reconnects; system resumes exam from last saved state.
A3 System error during exam

 1. System encounters an unexpected error.
 2. Exam session is terminated.
 3. User is notified of failure and advised to retry later.
Synchronous / Asynchronous / Return Message

Synchronous Messages

 startExam()
 initializeExam()
 submitAnswer()
 processAnswer()
 fetchQuestionContent()
 finalizeSession()
 markSessionCompleted()
Asynchronous Messages

 saveProgressAsync(): The system records exam progress in the background while the
user enters answers.
Return Messages

 exam.startConfirmation(): exam started confirmation
 question.display(): question viewed message
 exam.submitConfirmation(): Exam successfully completed confirmation
System Components (Sequence Diagram Lifelines)

 Actor: User
 Controller: ExamController
 Service: ExamService
 Repository: QuestionRepository, ResponseRepository
 External Modules: AIDiagnosticEngine
UC-06 RECEIVING A HINT DURING THE EXAM
Use Case Name: Receiving a Hint During the Exam

Use Case ID: UC- 06

Primary Actor: User

Goal: Get an AI hint without revealing the answer.

Trigger

 User taps the "Get Hint" button while answering a question.
Preconditions

 User is actively taking an exam.
 System is able to generate AI-based hints.
Postconditions

 Success: User receives a hint relevant to the current question.
 Failure: Hint cannot be generated due to system error or AI module failure.
Basic Flow (Main Success Scenario)

User taps "Get Hint".
System sends the question to the AI module.
AI generates a hint without revealing the correct answer.
System displays the hint to the user.
User continues answering the question.
Alternative / Exceptional Flows

A1 AI module unavailable

 1. System detects AI module failure.
 2. Displays message: "Hint unavailable at this time."
A2 User requests multiple hints exceeding limit

 1. System tracks number of hints used.
 2. Denies further hints and notifies user.
Synchronous / Asynchronous / Return Message

Synchronous Messages

 requestHint()
 processHintRequest()
 getQuestionContext()
Asynchronous Messages

 fetchHintAsync(): When the user requests a hint, the system prepares the hint and sends
it back.
Return Messages

 hint.display(): AI hint displayed to user message
System Components (Sequence Diagram Lifelines)

 Actor: User
 Controller: ExamController
 Service: HintService
 Repository: QuestionRepository
 External Modules: AIDiagnosticEngine
UC-07 RECEIVING EXAM RESULT REPORT AND FEEDBACK
Use Case Name: Receiving Exam Result Report and Feedback

Use Case ID: UC- 07

Primary Actor: User

Goal: To view the detailed exam result and AI-generated feedback.

Trigger

 User finishes the exam and selects "View Results".
Preconditions

 User has completed the exam.
 System has calculated scores and performance metrics.
Postconditions

 Success: Detailed report and AI feedback are displayed.
 Failure: Report cannot be generated due to calculation or system error.
Basic Flow (Main Success Scenario)

User selects "View Results".
System retrieves exam responses.
AI analyzes responses and calculates CEFR levels for each skill.
System generates a detailed report with feedback.
Report and feedback are presented to the user.
Alternative / Exceptional Flows

A1 Report calculation fails

 1. System detects error in analysis.
 2. Notifies user that results are temporarily unavailable.
Synchronous / Asynchronous / Return Message

Synchronous Messages

 viewResults()
 generateReport()
 getExamResponses()
 analyzePerformance()
 saveResult()
Asynchronous Messages

 sendFeedbackAsync(): The AI-generated feedback report is sent to the user.
Return Messages

 resultReport.display(): Detailed exam report displayed message
 feedback.display(): AI-generated feedback displayed message
System Components (Sequence Diagram Lifelines)

 Actor: User
 Controller: ResultController
 Service: ReportingService
 Repository: ResponseRepository, ResultRepository
 External Modules: AIDiagnosticEngine
UC-22 MONITOR SYSTEM HEALTH AND MANAGE USERS
Use Case Name: Monitor System Health and Manage Users

Use Case ID: UC- 22

Primary Actor: System Administrator

Goal: Enables administrators to monitor system performance, manage user accounts and roles,
and generate usage reports.

Trigger

 Administrator logs into the system and selects the admin dashboard.
Preconditions

 Admin is authenticated and authorized.
 System monitoring modules are active.
Postconditions

 Success: Admin can monitor system health, manage users, and generate reports.
 Failure:
o System health data cannot be retrieved.
o Admin actions fail due to authorization or system errors.
Basic Flow (Main Success Scenario)

Admin logs into the system.
Admin selects "System Health Monitoring".
System displays server load, error logs, and performance metrics.
Admin selects "Manage Users".
Admin creates, deletes, or updates user accounts/roles.
Admin generates reports on system usage.
Alternative / Exceptional Flows

A1 System monitoring module offline

 1. Admin requests health metrics.
 2. System reports "Monitoring unavailable".
A2 Unauthorized user attempts admin actions

 1. System blocks action and logs the attempt.
 2. Admin is notified of failed operation.
Synchronous / Asynchronous / Return Message

Synchronous Messages

 accessAdminDashboard()
 viewSystemHealth()
 getHealthMetrics()
 fetchCurrentLoad()
 updateUserRole()
 modifyUserRole()
 updateUser()
Asynchronous Messages

 monitorHealthAsync(): Monitors system performance and error logs in the background.
 updateUserRolesAsync(): User authorization changes are applied in the background.
Return Messages

 systemStatus.report(): system status report sent message
 userManagement.confirmation(): user action completed confirmation
 usageReport.generated(): Usage report created message
System Components (Sequence Diagram Lifelines)

 Actor: System Administrator
 Controller: AdminController
 Service: AdminService
 Repository: UserRepository, SystemMetricsRepository
Class Diagram
This section presents the static structure of the Level Assessment AI Diagnostic Engine system.
The class diagram defines the objects, their attributes, operations (methods), and the
relationships between them. This design ensures full consistency with the Sequence Diagrams
presented in Section 1.

Class Names
Based on the Use Case scenarios (UC- 02 - UC-22) detailed in the project documentation and the
corresponding Sequence Diagrams, the following classes have been defined:

 User: Represents the base entity for all system users.
 Administrator: Represents the privileged user managing the system (derived from the
User class).
 Controllers: LearningController, ExamController, ResultController, AdminController.
 Services: UserProfileService, ExamService, HintService, ReportingService, AdminService.
 Repositories: UserRepository, QuestionRepository, ResponseRepository,
ResultRepository, SystemMetricsRepository.
 AIDiagnosticEngine: External system interface used for adaptive logic and analysis.
 Domain Entities: Question, UserResponse, ResultReport, StudyPlan.
Attributes & Methods
Class Name Attributes Methods
User
userID: int
email: String
role: String
learningPurpose: String
+ register(): boolean
+ login(): boolean
Administrator (Inherits from User) (Inherits methods)
LearningController
userProfileService:
UserProfileService
+ openLearningPurpose(): void
Class Name Attributes Methods

reportingService:
ReportingService
+ savePurpose(data: Object): void
+ viewStudyPlan(): void
ExamController

examService:
ExamService
hintService: HintService
+ startExam(): void
+ submitAnswer(answerData:
Object): void
+ finishExam(): void
+ requestHint(): void
ResultController -^ reportingService:
ReportingService

+ viewResults(examID: int): void
AdminController -^ adminService:
AdminService

+ accessAdminDashboard(): void
+ viewSystemHealth(): void
+ updateUserRole(userID: int,
newRole: String): void
UserProfileService - UserRepository^ userRepository: + getPurpose(): Object

Class Name Attributes Methods

aiEngine:
AIDiagnosticEngine
+ validatePurpose(data: Object):
boolean
ExamService

questionRepo:
QuestionRepository
responseRepo:
ResponseRepository
aiEngine:
AIDiagnosticEngine
+ initializeExam(): void
+ processAnswer(answerData:
Object): void
+ finalizeSession(): void
HintService

questionRepo:
QuestionRepository
aiEngine:
AIDiagnosticEngine
+processHintRequest(questionID:
int, userID: int): void
ReportingService

responseRepo:
ResponseRepository
resultRepo:
ResultRepository
userRepo:
UserRepository
+ generateReport(examID: int):
Report
+ sendFeedbackAsync(email:
String): void
+generatePersonalizedPlan(userID:
int): Plan
Class Name Attributes Methods

aiEngine:
AIDiagnosticEngine
AdminService

metricsRepo:
SystemMetricsRepository
userRepo:
UserRepository
+ getHealthMetrics(): Metrics
+ modifyUserRole(userID: int,
newRole: String): void
+ monitorHealthAsync(): void
UserRepository - connectionString: String

+ fetchPurpose(): Object
+ updatePurpose(data: Object):
void
+ saveStudyPlan(planData: Object):
void
+ updateUser(userID: int, roleData:
Object): void
+updateUserRolesAsync(userID:
int): void
Class Name Attributes Methods

QuestionRepository - connectionString: String

+fetchQuestionContent(questionID:
int): Object
+getQuestionContext(questionID:
int): Object
ResponseRepository - connectionString: String

+saveProgressAsync(answerData:
Object): void
+ markSessionCompleted(): void
+ getExamResponses(examID: int):
List
ResultRepository - connectionString: String

+ saveResult(scores: Object,
feedback: String): void
+ fetchRecentResults(userID: int):
List
SystemMetricsRepo - connectionString: String

+ fetchCurrentLoad(): Object
+ monitorHealthAsync(): void
AIDiagnosticEngine - apiEndpoint: String +saveLearningPurposeAsync(Object): void data:

Class Name Attributes Methods

+ getInitialQuestion(profile:
Object): Question
+getNextAdaptiveQuestion(perf:
Object): Question
+ fetchHintAsync(context: Object):
void
+analyzePerformance(answers:
List): Score
+ createStudyPlan(history: List):
Plan
Question

questionID: int
content: String
difficulty: int
(Data Carrier Object)
UserResponse - questionID: int (Data Carrier Object)
Class Name Attributes Methods
selectedOption: String
timestamp: DateTime
ResultReport
examID: int
totalScore: double
feedback: String
(Data Carrier Object)
StudyPlan
planID: int
tasks: List
(Data Carrier Object)
Relationships Between Classes
To support the interactions modeled in the Sequence Diagrams, the following relationships have
been established between classes:

Administrator - User
 Type: Generalization (Inheritance)
 Multiplicity: N/A (Inheritance)
 Description: The Administrator class is derived from the User class. It inherits all
attributes (e.g., email, password) and methods from User but possesses privileged access
rights to specific controllers.
Actor (User/Admin) - Controller
 Type: Dependency (Usage)
 Multiplicity: 1 to 1..*
 Description: The Actors (User and Administrator) interact with the system by triggering
methods in the Controller classes (e.g., User triggers startExam() in ExamController).
Controller - Service
 Type: Association
 Multiplicity: 1 to 1
 Description: Each Controller class delegates complex business logic execution to a
specific, corresponding Service class (e.g., ExamController calls ExamService).
Service - Repository
 Type: Association
 Multiplicity: 1 to 1
 Description: Service classes utilize specific Repository classes to perform persistent data
read and write operations (e.g., UserProfileService uses UserRepository).
Service - AIDiagnosticEngine
 Type: Dependency
 Multiplicity: 1 to 1
 Description: The Service layer depends on the external AIDiagnosticEngine interface to
request adaptive analysis, hint generation, and study plan creation.
User - UserResponse
 Type: Composition
 Multiplicity: 1 to 0..*
 Description: A User owns their UserResponse objects. This is a strong ownership
relationship; if a User account is deleted, their associated responses are also removed
from the system.
User - ResultReport
 Type: Association
 Multiplicity: 1 to 0..*
 Description: A User is associated with multiple ResultReport objects. The user can view
reports generated after completing exams, but the reports can exist independently for
archival purposes.
ResultReport - StudyPlan
 Type: Association
 Multiplicity: 1 to 1
 Description: There is a one-to-one relationship where a specific ResultReport triggers the
generation of exactly one personalized StudyPlan based on the analysis of that report.
ExamService - Question
 Type: Aggregation
 Multiplicity: 1 to 1..*
 Description: The ExamService aggregates multiple Question objects during an active
exam session. The questions exist independently in the question bank (Repository) but
are temporarily grouped by the service for the session.

This is a offline tool, your data stays locally and is not send to any server!
Feedback & Bug Reports