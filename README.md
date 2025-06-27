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

### วิธีที่ 2: ใช้ Docker (แนะนำสำหรับอุปกรณ์ใหม่)

#### ความต้องการเบื้องต้น

-   ติดตั้ง [Docker](https://docs.docker.com/get-docker/) บนเครื่องของคุณ
-   ติดตั้ง [Docker Compose](https://docs.docker.com/compose/install/) (มักจะมาพร้อมกับ Docker Desktop)

#### ขั้นตอนการรันด้วย Docker

1. **Clone โปรเจกต์:**

```bash
git clone <repository-url>
cd globalwireless-frontend
```

2. **รันด้วย Docker Compose:**

```bash
# รัน development server
docker-compose up app-dev

# หรือรันใน background
docker-compose up -d app-dev
```

3. **เปิดเบราว์เซอร์และไปที่ [http://localhost:3001](http://localhost:3001)**

#### คำสั่ง Docker ที่ใช้บ่อย

```bash
# หยุดการทำงาน
docker-compose down

# ดู logs
docker-compose logs app-dev

# รีสตาร์ท service
docker-compose restart app-dev

```

#### การใช้ NPM Scripts (แนะนำ)

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

#### การแก้ไขปัญหา

-   **หากพอร์ต 3001 ถูกใช้งานแล้ว:** เปลี่ยนพอร์ตใน `docker-compose.yml`
-   **หากต้องการ rebuild:** รัน `docker-compose build app-dev`
-   **หากต้องการลบ cache:** รัน `docker-compose down --volumes`

## การรันโปรเจค (วิธีปกติ)

1. รัน development server:

```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
```

2. เปิดเบราว์เซอร์และไปที่ [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

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
