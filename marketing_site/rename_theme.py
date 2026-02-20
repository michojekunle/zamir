import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace texts
replacements = {
    "Where Faith Meets Sound": "Scripture. Melody. Transformation.",
    "Stream curated Islamic music, guided prayer sessions, and AI-generated\\n          spiritual audio. Built for the modern Muslim lifestyle.": "Experience the Word of God like never before. Stream Bible verses transformed into ambient melodies for deep meditation, study, and worship.",
    "A cinematic journey through sound, faith, and community.": "A cinematic journey through scripture, faith, and worship.",
    "Built for Believers": "The Word in Harmony",
    "Every feature crafted with mindfulness, community, and authentic\\n            Islamic values at its core.": "Every feature crafted for deep meditation, worship, and understanding the Scriptures.",
    "Fajr Reflections": "Psalms 23 Serenity",
    "Al-Quran Lofi": "Proverbs of Wisdom",
    "Isha Serenity": "Isaiah Prophecies",
    "Dhikr Beats": "Gospel Rhythms",
    "Morning Prayer": "Meditation",
    "Focus & Study": "Study",
    "Evening Wind-Down": " Evening Worship",
    "Meditation": "Praise",
    "Calming recitation layered with ambient sounds for deep focus.": "Calming scripture readings layered with ambient sounds for deep focus.",
    "AI-composed ambient piece inspired by the stillness of night prayer.": "AI-composed ambient piece inspired by the stillness of evening worship.",
    "Rhythmic spiritual chanting over soft percussion.": "Rhythmic worship instrumentals over soft percussion.",
    "Join 50,000+ Muslims experiencing faith through sound.": "Join 50,000+ believers experiencing the Word through sound.",
    "Zamir. Faith &amp; Lifestyle": "Zamir. The Word in Melody",
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Update features specifically
content = re.sub(r'title: "Live Radio",[\s\S]*?desc: ".*?",', 'title: "Live Worship Radio",\n    color: "#C9A042",\n    desc: "24/7 live Christian radio streams — worship, scripture reading, and ambient praise.",', content)
content = re.sub(r'title: "Guided Sessions",[\s\S]*?desc: ".*?",', 'title: "Guided Meditation",\n    color: "#E6C57A",\n    desc: "Step-by-step audio guides for prayer and mindfulness rooted in Biblical truth.",', content)
content = re.sub(r'title: "40\+ Languages",[\s\S]*?desc: ".*?",', 'title: "Original Languages",\n    color: "#C9A042",\n    desc: "Listen to scriptures in English, as well as original Hebrew and Greek pronunciations.",', content)
content = re.sub(r'title: "Curated by Scholars",[\s\S]*?desc: ".*?",', 'title: "Theologically Sound",\n    color: "#E6C57A",\n    desc: "Every track reviewed and endorsed by qualified theologians and worship leaders.",', content)
content = re.sub(r'title: "Offline Mode",[\s\S]*?desc: ".*?",', 'title: "Offline Mode",\n    color: "#C9A042",\n    desc: "Download your favourite verses and playlists to listen without an internet connection.",', content)
content = re.sub(r'title: "AI Music Generation",[\s\S]*?desc: ".*?",', 'title: "AI Music Generation",\n    color: "#E6C57A",\n    desc: "Personalized scriptural soundscapes created by AI, tuned to your studying or worship mood.",', content)

# Change colors to deep navy (#0F1B2E), gold (#C9A042), cream (#F7F3EC), lighter gold (#E6C57A)
content = content.replace('rgba(59,130,246,', 'rgba(201,160,66,')  # blue -> gold
content = content.replace('rgba(139,92,246,', 'rgba(230,197,122,') # purple -> light gold
content = content.replace('rgba(6,182,212,', 'rgba(247,243,236,')   # cyan -> cream
content = content.replace('rgba(239,68,68,', 'rgba(201,160,66,')   # red -> gold
content = content.replace('#020408', '#0F1B2E')
content = content.replace('#0a0e1a', '#0a1120')
content = content.replace('#3b82f6', '#C9A042')
content = content.replace('#8b5cf6', '#E6C57A')
content = content.replace('#c4b5fd', '#F7F3EC')
content = content.replace('#93c5fd', '#E6C57A')
content = content.replace('#10b981', '#C9A042')
content = content.replace('#f59e0b', '#E6C57A')
content = content.replace('#ec4899', '#F7F3EC')
content = content.replace('#a78bfa', '#E6C57A')
content = content.replace('#60a5fa', '#C9A042')

# Update fonts
content = content.replace('Helvetica Neue\', Arial, sans-serif', 'Plus Jakarta Sans\', sans-serif')
content = content.replace('Georgia, serif', 'Fraunces, serif')

# Change Z logo to img
logo_html = '<img src="/zamir_icon.png" alt="Zamir Logo" style={{ width: 40, height: 40, borderRadius: "20%", boxShadow: "0 0 20px rgba(201,160,66,0.3)" }} />'
content = re.sub(r'<div[^>]*?>\s*Z\s*</div>', logo_html, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

