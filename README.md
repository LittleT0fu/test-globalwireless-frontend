# GlobalWireless Frontend

โปรเจคนี้เป็นเว็บแอปพลิเคชันที่พัฒนาด้วย [Next.js](https://nextjs.org)

## ⚠️ คำเตือนก่อนเริ่มต้น

ก่อนที่จะรันโปรเจคนี้ ต้องแน่ใจว่าได้:

1. รัน Backend Project ก่อน
2. เปิด MAMP และรัน MySQL Server

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค และกำหนดค่าต่อไปนี้:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

```

## การติดตั้ง

1. ติดตั้ง dependencies:

```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
```

## การรันโปรเจค

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

## เทคโนโลยีที่ใช้

-   [Next.js](https://nextjs.org) - React framework
-   [Geist Font](https://vercel.com/font) - ฟอนต์ที่ใช้ในโปรเจค

## การ Deploy

วิธีที่ง่ายที่สุดในการ deploy คือการใช้ [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

ดูรายละเอียดเพิ่มเติมได้ที่ [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## secure

XSS protection

-   Input Sanitization -> dompurify
-   Content Security Policy (CSP) -> add meta data to head to prevent thirdparty scritp load
-   Output Encoding


HttpOnly Cookies