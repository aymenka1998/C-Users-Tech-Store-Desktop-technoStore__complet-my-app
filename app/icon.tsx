import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* جسم الحقيبة */}
          <path
            d="M40 70C40 64.4772 44.4772 60 50 60H150C155.523 60 160 64.4772 160 70V150C160 166.569 146.569 180 130 180H70C53.4315 180 40 166.569 40 150V70Z"
            fill="#FF7F5C"
          />
          {/* يد الحقيبة */}
          <path
            d="M70 60V50C70 33.4315 83.4315 20 100 20C116.569 20 130 33.4315 130 50V60"
            stroke="black"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* الكرة الأرضية */}
          <circle cx="100" cy="120" r="25" stroke="black" strokeWidth="3" />
          <line x1="100" y1="95" x2="100" y2="145" stroke="black" strokeWidth="2" />
          <ellipse cx="100" cy="120" rx="12" ry="25" stroke="black" strokeWidth="2" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  )
}