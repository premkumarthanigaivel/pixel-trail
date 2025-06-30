"use client"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
        id="experience-pixel-tracker"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Experience.com pixel script loaded successfully")
        }}
        onError={error => {
          console.error("Experience.com pixel script failed to load:", error)
        }}
      >
        {`
          (function() {
            // Configuration
            const domainKey = '684a741aca1fc468ea05ecfb';
            const proApiUrl = 'https://proapi.qa.experience.com';
            
            // Utility functions
            const getSessionCookie = name => {
              const matches = document.cookie.match(
                new RegExp(\`(?:^|;)\\s*\${name}=([^;]*)\`)
              );
              return matches ? decodeURIComponent(matches[1]) : "";
            };
            
            const generateSessionId = () => {
              const randomString =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
              const timestamp = Date.now().toString(36);
              return randomString + timestamp;
            };
            
            const getSessionId = () => {
              let sessionId = getSessionCookie("ExpSessionId");
              if (!sessionId) {
                sessionId = generateSessionId();
                document.cookie = \`ExpSessionId=\${sessionId}; path=/; SameSite=Lax; Secure\`;
              }
              return sessionId;
            };
            
            const fetchPixel = async () => {
              try {
                const params = new URLSearchParams({
                  domain: domainKey,
                  ownerType: "agent",
                  type: "other",
                  requestPageUrl: encodeURIComponent(window.location.href),
                  userSessionId: getSessionId(),
                  cookieConsent: true,
                });
                
                const response = await fetch(
                  \`\${proApiUrl}/api/pixel/v1/domain/pixel?\${params.toString()}\`
                );
                
                if (!response.ok) {
                  throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                
                const data = await response.json();
                if (data.url) {
                  return data.url;
                } else {
                  console.error("Pixel URL not found");
                  return null;
                }
              } catch (error) {
                console.error("Error fetching pixel:", error);
                return null;
              }
            };
            
            const attachPixel = pixelUrl => {
              if (window.ExpDataCollector && typeof window.ExpDataCollector === "object") {
                delete window.ExpDataCollector;
              }
              
              const script = document.createElement("script");
              script.src = pixelUrl;
              script.async = true;
              script.onload = () => console.log("ExpDataCollector loaded");
              script.onerror = () => console.error("Failed to load ExpDataCollector");
              document.body.appendChild(script);
            };
            
            const loadPixel = async () => {
              const pixelUrl = await fetchPixel();
              if (pixelUrl) {
                attachPixel(pixelUrl);
              }
            };
            
            // Initialize pixel loading
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", loadPixel);
            } else {
              loadPixel();
            }
          })();
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
