# GlobalWireless Frontend

โปรเจคนี้เป็นเว็บแอปพลิเคชันที่พัฒนาด้วย [Next.js](https://nextjs.org)

## ⚠️ คำเตือนก่อนเริ่มต้น

ก่อนที่จะรันโปรเจคนี้ ต้องแน่ใจว่าได้:

1. รัน Backend Project ก่อน
2. เปิด MAMP และรัน MySQL Server (if not run backend via docker)

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค และกำหนดค่าต่อไปนี้:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

```

## การติดตั้ง

### วิธีที่ 1: ติดตั้งแบบปกติ

1. ติดตั้ง dependencies:

```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
```

#### ความต้องการเบื้องต้น

-   **Node.js** เวอร์ชัน 18.0.0 หรือสูงกว่า
-   **npm** เวอร์ชัน 9.0.0 หรือสูงกว่า (หรือ yarn, pnpm)
-   **Docker Desktop** เวอร์ชัน 20.10.0 หรือสูงกว่า (สำหรับวิธีที่ 2)

### วิธีที่ 2: ใช้ Docker (แนะนำสำหรับอุปกรณ์ใหม่)

1. **Clone โปรเจกต์:**

```bash
git clone <repository-url>
cd globalwireless-frontend
```

2. **รันด้วย Docker Compose:**

การใช้ NPM Scripts (แนะนำ)

เพื่อความสะดวก คุณสามารถใช้ npm scripts ที่เตรียมไว้แล้ว:

```bash
# การจัดการทั่วไป
npm run docker:up               # รันทั้ง development และ production
npm run docker:down             # หยุดการทำงานทั้งหมด
npm run docker:restart          # รีสตาร์ท services
npm run docker:build            # build images
npm run docker:clean            # ลบ images, containers และ volumes ทั้งหมด

# การรีเซ็ต (แนะนำเมื่อมีปัญหา)
npm run docker:reset            # รีเซ็ตทั้งหมด: ลบ cache, build ใหม่, และรัน
```

3. **เปิดเบราว์เซอร์และไปที่ [http://localhost:3001](http://localhost:3001)**

#### คำสั่ง Docker ที่ใช้บ่อย

```bash
docker-compose up

# หยุดการทำงาน
docker-compose down

# ดู logs
docker-compose logs app-dev

# รีสตาร์ท service
docker-compose restart app-dev

```

#### การแก้ไขปัญหา

-   **หากพอร์ต 3001 ถูกใช้งานแล้ว:** เปลี่ยนพอร์ตใน `docker-compose.yml`
-   **หากต้องการ rebuild:** รัน `docker-compose build app-dev`
-   **หากต้องการลบ cache:** รัน `docker-compose down --volumes`

ถ้าเจอปัญหาเกี่ยวกับ Docker:

-   ตรวจสอบว่า Docker Desktop ทำงานอยู่
-   ตรวจสอบว่า ports 3000, 3306, 8080 ไม่ถูกใช้งาน
-   ตรวจสอบดูว่าได้สร้างไฟล์ .env และใส่ข้อมูลแล้ว
-   ตรวจสอบว่าได้เปิดโปรแกรม Docker Desktop แล้วหรือยัง
-   ลองรัน `docker system prune` เพื่อลบข้อมูลที่ไม่ใช้

## การรันโปรเจค (วิธีปกติ)

1. รัน development server:

```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
```

2. เปิดเบราว์เซอร์และไปที่ [http://localhost:3001](http://localhost:3001) เพื่อดูผลลัพธ์

## การพัฒนา

-   แก้ไขไฟล์ `app/page.tsx` เพื่อเริ่มการพัฒนา
-   หน้าเว็บจะอัพเดทอัตโนมัติเมื่อมีการแก้ไขไฟล์
-   **เมื่อใช้ Docker:** การเปลี่ยนแปลงจะ reflect ทันทีเนื่องจาก volume mounting

## เทคโนโลยีที่ใช้

-   [Next.js](https://nextjs.org) - React framework
-   [Geist Font](https://vercel.com/font) - ฟอนต์ที่ใช้ในโปรเจค
-   [Docker](https://www.docker.com/) - Containerization platform

## Security

XSS protection

-   Input Sanitization -> dompurify
-   Content Security Policy (CSP) -> add meta data to head to prevent thirdparty script load
-   Output Encoding

HttpOnly Cookies

```

```
