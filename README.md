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

Persona 1:  
- ชื่อ: นัท  
- อายุ: 20 ปี  
- อาชีพ: นักศึกษาปี 2  
- ความต้องการ: ต้องการจัดตารางเรียนและเตือนสอบให้มีวินัยมากขึ้น

Persona 2:  
- ชื่อ: แพรว  
- อายุ: 22 ปี  
- อาชีพ: นักศึกษาฝึกงาน  
- ความต้องการ: ต้องการวางแผนงานและกำหนดเป้าหมายประจำสัปดาห์
1.2 เป้าหมายของแอป | App Goals
ตัวอย่าง (Example):

- ช่วยนักศึกษาจัดตารางเรียนรายสัปดาห์
- เพิ่มระบบเตือนสอบและงานที่ต้องส่ง
- มีหน้าแดชบอร์ดรวมกิจกรรมประจำวัน
1.3 โครงร่างหน้าจอ / Mockup
ใส่รูปภาพ หรือคำอธิบายแต่ละหน้าหลัก 3 หน้า | Attach image or describe 3 main pages

1.4 การไหลของผู้ใช้งาน | User Flow
ตัวอย่าง (Example):

เปิดแอป > เข้าหน้าแดชบอร์ด > เลือก "เพิ่มงาน" > บันทึก > ตั้งเตือน
2. การพัฒนาแอป | App Implementation (4 คะแนน / 4 pts)
2.1 รายละเอียดการพัฒนา | Development Details
เครื่องมือที่ใช้ / Tools used:

- Flutter 3.19
- Dart 3.2
- Package: Provider, SharedPreferences
2.2 ฟังก์ชันที่พัฒนา | Features Implemented
Checklist:

- [x] เพิ่ม / แก้ไข / ลบ ตารางเรียน
- [x] ตั้งเตือนกิจกรรม
- [x] บันทึกงานที่ต้องทำ
- [ ] ซิงก์กับ Google Calendar
2.3 ภาพหน้าจอแอป | App Screenshots
แนบภาพหรือ URL (Attach images or image links):

- ![Dashboard](dashboard.png)
- ![Schedule](schedule.png)
- ![Reminder](reminder.png)
3. การ Build และติดตั้งแอป | Deployment (2 คะแนน / 2 pts)
3.1 ประเภท Build | Build Type
[x] Debug
[ ] Release
3.2 แพลตฟอร์มที่ทดสอบ | Platform Tested
[x] Android
[ ] iOS
3.3 ไฟล์ README และวิธีติดตั้ง | README & Install Guide
แนบไฟล์หรือคำอธิบายการติดตั้งแอป | Insert steps

1. ดาวน์โหลดไฟล์ .apk
2. เปิดในอุปกรณ์ Android
3. ติดตั้งผ่าน File Manager
4. การสะท้อนผลลัพธ์ | Reflection (2 คะแนน / 2 pts)
ตัวอย่างหัวข้อ | Suggested points:

- พบปัญหาเวลาใช้ setState กับ async function
- เรียนรู้การใช้ Provider ในการจัดการสถานะ
- หากมีเวลา จะเพิ่มฟีเจอร์ login และ Firebase sync
5. การใช้ AI ช่วยพัฒนา | AI Assisted Development (Bonus / ใช้ประกอบการพิจารณา)
5.1 ใช้ AI ช่วยคิดไอเดีย | Idea Generation
Prompt ที่ใช้:  
"Suggest mobile app ideas for students to manage classes and reminders."

ผลลัพธ์:  
ได้ไอเดียแอปจัดตารางเรียนและระบบเตือนอัตโนมัติ
5.2 ใช้ AI ช่วยออกแบบ UI | UI Layout Prompt
Prompt ที่ใช้:  
"Design a simple layout for a schedule and reminder app in Flutter."

ผลลัพธ์:  
ได้ code structure ของ Scaffold 3 หน้า
5.3 ใช้ AI ช่วยเขียนโค้ด | Code Writing Prompt
Prompt ที่ใช้:  
"Flutter code to create a ListView with editable schedule items."

ผลลัพธ์:  
นำไปปรับกับ logic ของแอป เพิ่มปุ่มแก้ไข
5.4 ใช้ AI ช่วย debug | Debug Prompt
Prompt ที่ใช้:  
"My Flutter app crashes when I try to add an item. Here's the error: [แนบ error log]"

ผลลัพธ์:  
AI แนะนำให้ตรวจสอบ null และวิธีแก้ไข
5.5 ใช้ AI ช่วย Deploy | Deployment Prompt
Prompt ที่ใช้:  
"How to build Flutter app as APK and test on Android?"

ผลลัพธ์:  
คำสั่ง flutter build apk --release พร้อมวิธีติดตั้ง
✅ Checklist ก่อนส่ง | Final Checklist
[x] กรอกข้อมูลครบทุก Section
[x] แนบ GitHub และไฟล์ติดตั้ง
[x] สะท้อนผล และใช้ AI อย่างมีเหตุผล
