import re

with open('src/remotion/MarketingVideo.tsx', 'r') as f:
    content = f.read()

replacements = {
    "WHERE FAITH MEETS SOUND": "SCRIPTURE. MELODY. TRANSFORMATION.",
    "ZAMIR": "ZAMIR",
    "Islamic": "Christian",
    "Quran": "Bible",
    "Nasheed": "Worship",
    "Guided prayer": "Guided worship",
    "Faith, in Your Pocket": "The Word, in Your Pocket",
    "Community of Believers": "Community of Faith",
    "Believers Worldwide": "Believers Worldwide",
    "Curated Playlists": "Scripture Playlists",
    "Begin Your Journey": "Experience The Word",
    "Download Zamir Today": "Download Zamir Today",
    "A CINEMATIC": "A CINEMATIC",
}
for k, v in replacements.items():
    content = content.replace(k, v)

# Update UI Mockup data (titles)
content = content.replace("Fajr Reflections", "Psalms 23 Serenity")
content = content.replace("Dhikr Focus", "Proverbs Wisdom")
content = content.replace("Isha Ambient", "Isaiah Prophecies")

# Colors -> Deep Navy, Gold, Cream
content = content.replace('#020408', '#0F1B2E')
content = content.replace('#010208', '#0a1120')
content = content.replace('#3b82f6', '#C9A042') # blue -> gold
content = content.replace('#8b5cf6', '#E6C57A') # purple -> light gold
content = content.replace('#ffffff', '#F7F3EC') # white -> cream
content = content.replace('#1e293b', '#253550') # slate -> navy slate
content = content.replace('#10b981', '#C9A042')
content = content.replace('239, 68, 68', '201, 160, 66') # red -> gold
content = content.replace('59, 130, 246', '201, 160, 66')
content = content.replace('139, 92, 246', '230, 197, 122')

# Fonts
content = content.replace('Helvetica Neue', 'Plus Jakarta Sans')
content = content.replace('Georgia, serif', 'Fraunces, serif')

# Logo image substitution in the video mockup
logo_html = '<img src="/zamir_icon.png" alt="Zamir Logo" style={{ width: 60, height: 60, borderRadius: "20%", boxShadow: "0 0 20px rgba(201,160,66,0.5)" }} />'
content = re.sub(r'<div[^>]*?>\s*Z\s*</div>', logo_html, content)

with open('src/remotion/MarketingVideo.tsx', 'w') as f:
    f.write(content)

