import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Disc, Play, Home, Library, Radio, Search, Disc as Album, SkipForward, Pause, Star, Award, Calendar, Users, Mail, Send, Check, Clock, ArrowRight } from 'lucide-react'

// ============ MUSIC KIT PAGE ============
function MusicKitPage() {
  const [activeTab, setActiveTab] = useState('now')
  const [searchQuery, setSearchQuery] = useState('Lee Jooho')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const artistInfo = {
    name: 'Lee Jooho',
    monthlyListeners: '12.5K',
    genre: 'Korean Pop',
    topSongs: [
      { name: 'HOW ARE YOU', album: 'HOW ARE YOU - Single', year: 2022 },
      { name: 'Seasons go round and round', album: 'Seasons go round and round', year: 2021 },
      { name: 'Do You Hear the People Sing', album: 'Songs of the World Part.14', year: 2019 },
      { name: '그대와의 사랑은', album: '벗이여/외로움은 소중한 행복', year: 1987 },
      { name: '이젠 나의 뜻을 아는 님이여', album: '벗이여/외로움은 소중한 행복', year: 1986 },
    ]
  }

  useEffect(() => {
    const searchMusic = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=song,album&limit=20&country=US`
        )
        const data = await response.json()
        const songs = (data.results || []).filter((item: any) => item.kind === 'song')
        const albs = (data.results || []).filter((item: any) => item.collectionType === 'Full album' || item.kind === 'album')
        setSearchResults(songs.slice(0, 10))
        setAlbums(albs.slice(0, 6))
      } catch (err) {
        console.error('Search error:', err)
      }
      setIsLoading(false)
    }
    searchMusic()
  }, [searchQuery])

  const tabs = [
    { id: 'now', icon: Home, label: 'Now' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'browse', icon: Search, label: 'Browse' },
    { id: 'radio', icon: Radio, label: 'Radio' },
    { id: 'search', icon: Search, label: 'Search' },
  ]

  return (
    <div className="min-h-screen bg-black text-white pb-28">
      <div className="pt-4 pb-32 px-4">
        {activeTab === 'now' && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fc3c44] to-[#ff9500] flex items-center justify-center">
                  <Disc size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Featured Artist</p>
                  <h2 className="text-white text-3xl font-bold">{artistInfo.name}</h2>
                  <p className="text-white/60 text-sm">{artistInfo.monthlyListeners} Monthly Listeners • {artistInfo.genre}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-[#fc3c44] rounded-full text-white text-sm font-semibold flex items-center gap-2">
                  <Play size={16} fill="white" /> Play Music
                </button>
                <button className="px-6 py-2 bg-[#3a3a3c] rounded-full text-white text-sm font-semibold flex items-center gap-2">
                  <SkipForward size={16} /> Play First Song
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-3">Albums</h3>
              <div className="space-y-3">
                {artistInfo.topSongs.slice(3, 6).map((album, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#fc3c44]/40 to-[#ff9500]/40 rounded flex items-center justify-center">
                      <Album size={20} className="text-white/60" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{album.name}</h4>
                      <p className="text-white/40 text-xs">{album.year} • {i === 0 ? '5' : i === 1 ? '4' : '1'} songs</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-3">Top Songs</h3>
              <div className="space-y-1">
                {artistInfo.topSongs.map((song, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5">
                    <span className="w-6 text-center text-white/40">{i + 1}</span>
                    <div className="flex-1">
                      <h4 className="text-white text-sm">{song.name}</h4>
                      <p className="text-white/50 text-xs">{song.album} • {song.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-3">From Apple Music</h3>
              <div className="grid grid-cols-2 gap-4">
                {albums.map((album, i) => (
                  <div key={album.collectionId || i} className="bg-[#2c2c2e] rounded-xl overflow-hidden">
                    {album.artworkUrl100 ? (
                      <img
                        src={album.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg')}
                        alt={album.collectionName}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-[#fc3c44]/30 to-[#ff9500]/30 flex items-center justify-center">
                        <Album size={48} className="text-white/60" />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="text-white text-sm truncate">{album.collectionName}</h4>
                      <p className="text-white/50 text-xs truncate">{album.artistName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#3a3a3c] rounded-full py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((track) => (
                  <div key={track.trackId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5">
                    {track.artworkUrl100 ? (
                      <img
                        src={track.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg')}
                        alt={track.trackName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#fc3c44]/20 to-[#ff9500]/20 flex items-center justify-center">
                        <Disc size={16} className="text-white/60" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm truncate">{track.trackName}</h4>
                      <p className="text-white/50 text-xs truncate">{track.artistName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'library' || activeTab === 'browse' || activeTab === 'radio') && (
          <div className="text-white/40 text-center pt-20">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab
          </div>
        )}
      </div>

      <div className="fixed bottom-14 left-0 right-0 bg-[#1c1c1e]/95 backdrop-blur-3xl border-t border-white/[0.08] pb-6 pt-2 px-4 z-40">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                activeTab === tab.id ? 'text-white' : 'text-white/40'
              }`}
            >
              <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-white/[0.08] px-4 py-2 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#fc3c44]/40 to-[#ff9500]/40 rounded flex items-center justify-center">
            <Disc size={16} className="text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-xs font-medium truncate">Starlight Serenade</h4>
            <p className="text-white/40 text-[10px] truncate">Lee Juhoo • Midnight Dreams</p>
          </div>
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white/60 hover:text-white">
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="white" />}
          </button>
          <div className="text-white/40 text-[10px]">0:00 / 0:00</div>
        </div>
        <div className="h-0.5 bg-white/10 mt-1 rounded-full overflow-hidden">
          <div className="h-full bg-white/40 w-0" />
        </div>
      </div>
    </div>
  )
}

// ============ NEWS PAGE ============
function NewsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  // Real-time news highlights
  const liveHighlights = [
    { id: 1, text: 'Lee Juhoo wins Best Actor at Baeksang Arts Awards 2026', time: '2 min ago', hot: true },
    { id: 2, text: 'New album "Midnight Dreams" reaches 10M streams on Apple Music', time: '15 min ago', hot: true },
    { id: 3, text: 'Global fan meet tour 2026 dates officially announced', time: '1 hour ago', hot: false },
    { id: 4, text: 'Lee Juhoo appointed as luxury brand global ambassador', time: '3 hours ago', hot: false },
    { id: 5, text: 'Behind the scenes: "Midnight Dreams" music video shoot', time: '5 hours ago', hot: false },
  ]

  // Official announcements
  const announcements = [
    {
      id: 1,
      category: 'Official Announcement',
      title: 'Welcome Our New Team Member: Kathy Hutchison',
      date: 'May 28, 2026',
      excerpt: 'We are thrilled to announce a significant addition to Lee Juhoo\'s official team. Kathy Hutchison has been appointed to a pivotal role that will help shape the future of our artist-fan relationship.',
      full: 'After careful consideration and recognizing the immense contribution Kathy has already made to our community, we are proud to introduce her in her new official capacity.'
    },
    {
      id: 2,
      category: 'Role Announcement',
      title: 'Kathy Hutchison: Editor & Personal Manager',
      date: 'May 28, 2026',
      excerpt: 'Kathy Hutchison has been officially appointed as Editor and Personal Manager, a role of tremendous importance and responsibility within Lee Juhoo\'s official team.',
      full: 'This is not just a title—it represents a fundamental commitment to excellence in all aspects of the artist\'s professional journey and fan engagement.'
    },
    {
      id: 3,
      category: 'Responsibilities',
      title: 'The Three Pillars of Kathy\'s Role',
      date: 'May 28, 2026',
      excerpt: 'As Editor and Personal Manager, Kathy will oversee three critical areas that are essential to Lee Juhoo\'s continued success and growth.',
      full: 'Her expertise and dedication will be instrumental in maintaining the highest standards across all touchpoints with our global audience.'
    }
  ]

  // Kathy\'s official roles with detailed descriptions
  const kathyRoles = [
    {
      title: 'Editor-in-Chief',
      description: 'Leading all content creation, communications, and brand narrative to ensure consistency and excellence across all platforms.',
      icon: Star,
      color: '#fc3c44'
    },
    {
      title: 'Personal Manager',
      description: 'Coordinating schedules, projects, and priorities to maximize Lee Juhoo\'s professional efficiency and personal wellbeing.',
      icon: Calendar,
      color: '#ff9500'
    },
    {
      title: 'Event Management Lead',
      description: 'Organizing, executing, and overseeing all events including fan meetings, concerts, press conferences, and international appearances.',
      icon: Award,
      color: '#34c759'
    },
    {
      title: 'Fan Relations Manager',
      description: 'Building and nurturing the global fan community, ensuring every fan feels valued, heard, and connected to Lee Juhoo\'s journey.',
      icon: Users,
      color: '#5856d6'
    }
  ]

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedRole, setSelectedRole] = useState('Editor-in-Chief')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('https://leejuhoo-server.onrender.com/api/confirm-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: selectedRole,
          message: formData.message
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send confirmation')
      }

      setIsSubmitted(true)
      setTimeout(() => {
        setShowConfirmation(false)
        setIsSubmitted(false)
        setFormData({ name: '', email: '', message: '' })
      }, 3000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-24">
      <div className="px-4 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Official News</h1>
          <p className="text-white/60">Latest Updates & Announcements</p>
        </div>

        {/* Live Highlights Ticker */}
        <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Live Updates</h3>
          </div>
          <div className="space-y-3">
            {liveHighlights.map((highlight) => (
              <div key={highlight.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                {highlight.hot && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">HOT</span>
                )}
                <div className="flex-1">
                  <p className="text-white text-sm">{highlight.text}</p>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                    <Clock size={10} /> {highlight.time}
                  </p>
                </div>
                <ArrowRight size={16} className="text-white/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Kathy Hutchison Role Announcement - Hero Section */}
        <div className="bg-gradient-to-br from-[#fc3c44]/20 via-[#1c1c1e] to-[#ff9500]/20 rounded-3xl p-6 border border-[#fc3c44]/30">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fc3c44] to-[#ff9500] flex items-center justify-center">
              <Star size={40} className="text-white" />
            </div>
            <span className="px-4 py-1 bg-[#fc3c44] text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Official Announcement
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2">
              The Appointment of Kathy Hutchison
            </h2>
            <p className="text-white/60 text-sm">
              A New Chapter in Lee Juhoo's Official Team
            </p>
          </div>

          {/* Relationship */}
          <div className="bg-black/40 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-[#fc3c44] uppercase tracking-wider mb-2">Her Relationship to Lee Juhoo</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Kathy Hutchison has been an integral part of Lee Juhoo's journey, demonstrating exceptional dedication,
              insight, and passion for the artist's mission. Her appointment to this crucial role represents the
              culmination of her tireless work and the trust placed in her abilities to guide our community forward.
            </p>
          </div>
        </div>

        {/* Kathy\'s Official Roles - Detailed Cards */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award size={24} className="text-[#fc3c44]" />
            Kathy Hutchison's Official Roles & Responsibilities
          </h3>
          <div className="grid gap-4">
            {kathyRoles.map((role, index) => (
              <div key={index} className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/[0.08] hover:border-white/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <role.icon size={28} style={{ color: role.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">{role.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Role Importance Section */}
        <div className="bg-gradient-to-r from-[#fc3c44]/10 via-[#ff9500]/10 to-[#fc3c44]/10 rounded-2xl p-6 border border-[#fc3c44]/20">
          <h3 className="text-xl font-bold text-white mb-4">The Immense Importance of This Role</h3>
          <div className="space-y-4">
            <p className="text-white/70 text-sm leading-relaxed">
              The position of Editor and Personal Manager, overseeing Event Management and Fan Relations, is one of the
              most critical roles in any artist's organization. It requires a unique combination of skills:
            </p>
            <ul className="space-y-2">
              {[
                'Strategic thinking and meticulous attention to detail',
                'Exceptional communication and interpersonal abilities',
                'Unwavering dedication to both the artist and the fan community',
                'Ability to balance multiple high-stakes responsibilities',
                'Deep understanding of the Korean entertainment industry'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                  <Check size={16} className="text-[#34c759] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Role Confirmation Button */}
        <div className="text-center">
          <button
            onClick={() => setShowConfirmation(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#fc3c44] to-[#ff9500] rounded-full text-white font-bold text-lg flex items-center gap-3 mx-auto hover:opacity-90 transition-opacity"
          >
            <Mail size={20} />
            Confirm & Accept This Role
          </button>
          <p className="text-white/40 text-xs mt-3">
            Connecting with Lee Juhoo's official team via email
          </p>
        </div>

        {/* Recent Announcements */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            {announcements.filter(a => a.id > 1).map((announcement) => (
              <div key={announcement.id} className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/[0.08]">
                <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-medium rounded-full">
                  {announcement.category}
                </span>
                <h4 className="text-lg font-bold text-white mt-3 mb-2">{announcement.title}</h4>
                <p className="text-white/60 text-sm mb-3">{announcement.excerpt}</p>
                <p className="text-white/40 text-xs flex items-center gap-1">
                  <Calendar size={12} /> {announcement.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1c1e] rounded-3xl p-6 w-full max-w-md border border-white/[0.08]">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fc3c44] to-[#ff9500] flex items-center justify-center">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Role Confirmation</h3>
                  <p className="text-white/60 text-sm">
                    Confirm your acceptance of your assigned role
                  </p>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm text-center">{submitError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs font-medium mb-1 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fc3c44]"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium mb-1 block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fc3c44]"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium mb-1 block">Select Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fc3c44]"
                    >
                      {kathyRoles.map((role) => (
                        <option key={role.title} value={role.title} style={{ background: '#1c1c1e' }}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium mb-1 block">Message (Optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Any additional message..."
                      rows={3}
                      className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fc3c44] resize-none"
                    />
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <p className="text-white/70 text-xs font-semibold uppercase">By submitting, you confirm:</p>
                    <ul className="space-y-1">
                      {[
                        'Editor-in-Chief responsibilities',
                        'Personal Management duties',
                        'Event Management oversight',
                        'Fan Relations leadership'
                      ].map((item, i) => (
                        <li key={i} className="text-white/50 text-xs flex items-center gap-2">
                          <Check size={12} className="text-[#34c759]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowConfirmation(false); setSubmitError(''); }}
                      className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white/70 font-medium hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#fc3c44] to-[#ff9500] rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Confirmation
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#34c759]/20 flex items-center justify-center">
                  <Check size={40} className="text-[#34c759]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirmation Sent!</h3>
                <p className="text-white/60 text-sm">
                  Your role confirmation has been sent to the team. They will respond shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ HOME PAGE ============
function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[#fc3c44]/20 to-[#ff9500]/20" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">Lee Juhoo</h1>
          <p className="text-white/60 text-xl mb-8">Actor · Model · Global Icon</p>
          <Link to="/music" className="inline-flex items-center gap-2 px-8 py-3 bg-[#fc3c44] rounded-full text-white font-semibold">
            <Play size={20} fill="white" /> Explore Music
          </Link>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lee Juhoo</h2>
          <p className="text-white/40">© 2026 Lee Juhoo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// ============ MAIN APP ============
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-white text-xl font-bold">Lee Juhoo</Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/70 hover:text-white">Home</Link>
              <Link to="/music" className="text-white/70 hover:text-white">Music</Link>
              <Link to="/news" className="text-white/70 hover:text-white">News</Link>
              <Link to="/videos" className="text-white/70 hover:text-white">Videos</Link>
              <Link to="/merch" className="text-white/70 hover:text-white">Merch</Link>
              <Link to="/contact" className="text-white/70 hover:text-white">Contact</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicKitPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/videos" element={<div className="min-h-screen flex items-center justify-center pt-20"><h1 className="text-4xl font-bold text-white">Videos</h1></div>} />
          <Route path="/merch" element={<div className="min-h-screen flex items-center justify-center pt-20"><h1 className="text-4xl font-bold text-white">Merch</h1></div>} />
          <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center pt-20"><h1 className="text-4xl font-bold text-white">Contact</h1></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
