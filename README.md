# Final-Exam
Final exam 
ชื่อ - นามสกุล (Full Name): Sai Shang Hlang
รหัสนักศึกษา (Student ID): 6631503129
ชื่อแอป (App Name): Mood Tracker
ประเภทแอป (App Type): Mobile App
Framework ที่ใช้ (Framework Used): React Native & Firebase
ลิงก์ GitHub Repository: https://github.com/Leng201202/Mood.git
ลิงก์ไฟล์ติดตั้ง (APK/IPA): https://expo.dev/accounts/6631503129/projects/Mood/builds/5089dde4-1811-4cb6-8b6c-d97ad7c9b5a1

1. การออกแบบแอป | App Concept and Design (2 คะแนน / 2 pts)
1.1 ผู้ใช้งานเป้าหมาย | User Personas
ตัวอย่าง (Example): 
Username: Student123
Password: Password123
Email: student123@gmail.com


1.2 เป้าหมายของแอป | App Goals
Mood Tracker: The Mood Tracker app is designed to help users monitor and track their emotional well-being over time. It serves as a personal emotional diary that allows users to:

1. Record daily mood states and emotions
2. Track emotional patterns and trends
3. Maintain a digital journal of their emotional journey
4. Get insights into their emotional well-being
5. Set reminders for mood check-ins


1.3 โครงร่างหน้าจอ / Mockup
ใส่รูปภาพ หรือคำอธิบายแต่ละหน้าหลัก 3 หน้า | Attach image or describe 3 main pages

1.4 การไหลของผู้ใช้งาน | User Flow
ตัวอย่าง (Example): Mood Tracker
- User opens the app
- User logs in or creates an account
- User navigates to the mood tracking screen
- User selects a mood state
- User enters additional notes
- User saves the mood entry
- User views their mood history
- User navigates to the settings screen
- User updates their account information
- User logs out
2. การพัฒนาแอป | App Implementation (4 คะแนน / 4 pts)
2.1 รายละเอียดการพัฒนา | Development Details
เครื่องมือที่ใช้ / Tools used:

- React native
- Javascript
- Firebase
- Package: Provider, SharedPreferences
2.2 ฟังก์ชันที่พัฒนา | Features Implemented
Checklist:

- [x] Add, Edit, Delete Account
- [x] Store Mood detail as a History
- [x] Retrieve Mood detail from Firebase
- [ ] Google Calendar
2.3 ภาพหน้าจอแอป | App Screenshots
แนบภาพหรือ URL (Attach images or image links):

- [Home](/Mood/assets/Home.jpg)
- [AddMood](/Mood/assets/AddMood.jpg)
- [Profile](/Mood/assets/Profile.jpg)
3. การ Build และติดตั้งแอป | Deployment (2 คะแนน / 2 pts)
3.1 ประเภท Build | Build Type
[x] Debug
[x] Release
3.2 แพลตฟอร์มที่ทดสอบ | Platform Tested
[x] Android
[ ] iOS
3.3 ไฟล์ README และวิธีติดตั้ง | README & Install Guide
แนบไฟล์หรือคำอธิบายการติดตั้งแอป | Insert steps

1. app-release.apk
2. cd android/app/build/outputs/apk/release/app-release.apk
3. adb install app-release.apk
Reflection (2 คะแนน / 2 pts)
ตัวอย่างหัวข้อ | Suggested points:

Developing the Mood Tracker app has been a rewarding learning experience. Throughout the project, I encountered challenges with managing asynchronous operations in React Native, especially when updating state after interacting with Firebase. This led me to explore and adopt Provider for more effective state management, which improved the reliability and maintainability of the app.

Integrating Firebase for authentication and data storage allowed me to implement secure user accounts and real-time mood history tracking. Building features such as adding, editing, and deleting accounts, as well as storing and retrieving mood details, helped me deepen my understanding of both React Native and Firebase.

Additionally, I leveraged AI tools to assist with idea generation, UI design, debugging, and deployment. This not only accelerated development but also provided valuable insights and solutions to technical problems.

If I had more time, I would enhance the app by adding Google Calendar integration, more advanced analytics for mood trends, and further improving the user interface. Overall, this project strengthened my skills in mobile app development and gave me practical experience in delivering a complete application from concept to deployment.

5. การใช้ AI ช่วยพัฒนา | AI Assisted Development (Bonus / ใช้ประกอบการพิจารณา)
5.1 ใช้ AI ช่วยคิดไอเดีย | Idea Generation
Prompt ที่ใช้:  
"Suggest mobile app ideas for students to manage classes and reminders."

ผลลัพธ์:  
ได้ไอเดียแอปจัดตารางเรียนและระบบเตือนอัตโนมัติ
5.2 ใช้ AI ช่วยออกแบบ UI | UI Layout Prompt
Prompt ที่ใช้:  
"Design a simple layout for a Mood Tracker app in React Native."


ผลลัพธ์:  
AI แนะนำให้ตรวจสอบ null และวิธีแก้ไข
5.5 ใช้ AI ช่วย Deploy | Deployment Prompt
Prompt ที่ใช้:  
"How to build React Native app as APK and test on Android?"

ผลลัพธ์:  
คำสั่ง flutter build apk --release พร้อมวิธีติดตั้ง
✅ Checklist ก่อนส่ง | Final Checklist
[x] กรอกข้อมูลครบทุก Section
[x] แนบ GitHub และไฟล์ติดตั้ง
[x] สะท้อนผล และใช้ AI อย่างมีเหตุผล
