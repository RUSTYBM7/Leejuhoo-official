import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Disc, Play, Home, Library, Radio, Search, Disc as Album, SkipForward, Pause, Star, Award, Calendar, Users, Mail, Send, Check, Clock, ArrowRight, ChevronUp, Heart, Eye, MessageSquare, TrendingUp } from 'lucide-react'

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

// ============ HOME PAGE ============
function HomePage() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">Lee Juhoo</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/70 hover:text-white transition">Home</Link>
            <Link to="/music" className="text-white/70 hover:text-white transition">Music</Link>
            <a href="#bio" className="text-white/70 hover:text-white transition">Biography</a>
            <a href="#filmography" className="text-white/70 hover:text-white transition">Filmography</a>
            <a href="#fashion" className="text-white/70 hover:text-white transition">Fashion</a>
            <a href="#shop" className="text-white/70 hover:text-white transition">Shop</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-rose-900/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">Lee Juhoo</h1>
          <p className="text-2xl text-white/60 mb-2">이주후</p>
          <p className="text-xl text-amber-400/80 mb-8">Authenticity in Every Frame</p>
          <p className="text-white/50 mb-8">Global Music Artist</p>
          <a href="#bio" className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur rounded-full text-white font-semibold hover:bg-white/20 transition">
            <Play size={20} fill="white" /> Explore
          </a>
        </div>
      </section>

      {/* The Artist Section */}
      <section id="bio" className="py-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">The Artist</h2>
          <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">Born in Seoul, discovered at a university showcase, Lee Juhoo has graced over 40 magazine covers and continues to inspire through his philanthropic efforts, supporting 200+ students through his foundation.</p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-3 text-amber-400">Early Life</h3>
                <p className="text-white/70">Born in Seoul, South Korea. Started pursuing arts at age 5. Trained in classical piano and Korean traditional dance. Graduated from Seoul Institute of the Arts, majoring in Theater and Film.</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-3 text-amber-400">Discovery</h3>
                <p className="text-white/70">During a university theater showcase, a talent scout described the moment as "like being struck by lightning." This led to his first management contract and launched his career.</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-3 text-amber-400">Rise to Fame</h3>
                <p className="text-white/70">Strategic role selection balanced commercial success with artistic depth. His international platform debut reached Top 10 in 34 countries within 48 hours.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-2xl aspect-square flex items-center justify-center">
                <Star size={48} className="text-amber-400/50" />
              </div>
              <div className="bg-gradient-to-br from-rose-500/20 to-amber-500/20 rounded-2xl aspect-square flex items-center justify-center">
                <Award size={48} className="text-rose-400/50" />
              </div>
              <div className="bg-gradient-to-br from-violet-500/20 to-amber-500/20 rounded-2xl aspect-square flex items-center justify-center">
                <Heart size={48} className="text-violet-400/50" />
              </div>
              <div className="bg-gradient-to-br from-amber-500/20 to-violet-500/20 rounded-2xl aspect-square flex items-center justify-center">
                <Users size={48} className="text-amber-400/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filmography */}
      <section id="filmography" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Filmography</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Midnight Dreams', type: 'Drama', year: 2024, role: 'Lee Kang', rating: '18.4%', badge: 'HOT', badgeColor: 'bg-red-500' },
              { title: 'Urban Pulse', type: 'Drama', year: 2023, role: 'Park Jun', rating: '15.2%', badge: '', badgeColor: '' },
              { title: 'Golden Hour', type: 'Film', year: 2023, role: 'David Kim', rating: '4.2M views', badge: '', badgeColor: '' },
              { title: 'Starlight', type: 'Drama', year: 2022, role: 'Cha Minsoo', rating: '21.3%', badge: '', badgeColor: '' },
              { title: 'Neon Nights', type: 'Film', year: 2022, role: 'Jin', rating: '2.8M views', badge: '', badgeColor: '' },
              { title: "Lee Juhoo's World", type: 'Variety', year: 2024, role: 'MC', rating: '8.5%', badge: 'Confirmed', badgeColor: 'bg-green-500' },
            ].map((project, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-white/40 uppercase">{project.type}</span>
                  {project.badge && <span className={`px-2 py-1 ${project.badgeColor} text-white text-xs font-bold rounded`}>{project.badge}</span>}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-white/60 text-sm mb-2">as {project.role}</p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-semibold">{project.year}</span>
                  <span className="text-white/50 text-sm">{project.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 px-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Awards & Recognition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl border border-amber-500/30">
              <div className="text-5xl font-bold text-amber-400 mb-2">47</div>
              <div className="text-white/60">Major Awards</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-rose-500/20 to-transparent rounded-2xl border border-rose-500/30">
              <div className="text-5xl font-bold text-rose-400 mb-2">23</div>
              <div className="text-white/60">Best Actor</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-violet-500/20 to-transparent rounded-2xl border border-violet-500/30">
              <div className="text-5xl font-bold text-violet-400 mb-2">12</div>
              <div className="text-white/60">Popularity</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl border border-amber-500/30">
              <div className="text-5xl font-bold text-amber-400 mb-2">5</div>
              <div className="text-white/60">International</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <Award className="text-amber-400" size={32} />
              <div>
                <div className="font-semibold">Baeksang Arts Awards - Best Actor</div>
                <div className="text-white/50 text-sm">Midnight Dreams • 2024</div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <Award className="text-rose-400" size={32} />
              <div>
                <div className="font-semibold">KBS Drama Awards - Grand Prize</div>
                <div className="text-white/50 text-sm">Starlight • 2022</div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <Award className="text-violet-400" size={32} />
              <div>
                <div className="font-semibold">SBS Drama Awards - Best Couple</div>
                <div className="text-white/50 text-sm">Urban Pulse • 2023</div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <Award className="text-amber-400" size={32} />
              <div>
                <div className="font-semibold">Blue Dragon Awards - Popular Star</div>
                <div className="text-white/50 text-sm">Golden Hour • 2023</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Stats */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">March 15, 1997</div>
              <div className="text-white/50">Date of Birth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">185cm</div>
              <div className="text-white/50">Height</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">Star Entertainment</div>
              <div className="text-white/50">Agency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">2019</div>
              <div className="text-white/50">Debut</div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">2.5M+</div>
              <div className="text-white/50 text-sm">Monthly Listeners</div>
            </div>
            <div className="text-center p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <div className="text-2xl font-bold text-rose-400">156</div>
              <div className="text-white/50 text-sm">Songs Released</div>
            </div>
            <div className="text-center p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
              <div className="text-2xl font-bold text-violet-400">89</div>
              <div className="text-white/50 text-sm">Countries</div>
            </div>
            <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">7</div>
              <div className="text-white/50 text-sm">Years Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion */}
      <section id="fashion" className="py-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Fashion Endorsements</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Award className="text-amber-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Luxury House A</h3>
              <p className="text-white/60 text-sm mb-2">Fashion</p>
              <p className="text-amber-400 font-semibold">Global Ambassador since 2021</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Star className="text-rose-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Premium Brand B</h3>
              <p className="text-white/60 text-sm mb-2">Beauty</p>
              <p className="text-rose-400 font-semibold">Asia-Pacific Face since 2022</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Disc className="text-violet-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Designer Label C</h3>
              <p className="text-white/60 text-sm mb-2">Accessories</p>
              <p className="text-violet-400 font-semibold">First Korean Male Muse since 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Social Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl border border-pink-500/30">
              <div className="text-4xl font-bold text-pink-400 mb-2">12.5M</div>
              <div className="text-white/60">Instagram</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <div className="text-4xl font-bold text-blue-400 mb-2">8.2M</div>
              <div className="text-white/60">Twitter/X</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-2xl border border-cyan-500/30">
              <div className="text-4xl font-bold text-cyan-400 mb-2">15.8M</div>
              <div className="text-white/60">TikTok</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl border border-red-500/30">
              <div className="text-4xl font-bold text-red-400 mb-2">5.4M</div>
              <div className="text-white/60">YouTube</div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="text-5xl font-bold text-amber-400">41.9M+</div>
            <div className="text-white/60">Total Followers</div>
          </div>
        </div>
      </section>

      {/* Music */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Music</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Midnight Dreams', year: 2024, genre: 'Electronic Pop', tracks: 12 },
              { title: 'Golden Hour', year: 2023, genre: 'R&B/Soul', tracks: 10 },
              { title: 'Urban Pulse', year: 2022, genre: 'Hip-Hop', tracks: 8 },
            ].map((album, i) => (
              <div key={i} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition">
                <div className="aspect-square bg-gradient-to-br from-amber-500/30 to-rose-500/30 flex items-center justify-center">
                  <Disc size={64} className="text-white/50" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{album.title}</h3>
                  <p className="text-white/50 text-sm">{album.year} • {album.genre}</p>
                  <p className="text-white/40 text-sm">{album.tracks} tracks</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-6">Popular Tracks</h3>
            <div className="space-y-2">
              {[
                { name: 'Starlight Serenade', duration: '4:12', plays: '2.4M' },
                { name: 'Midnight Pulse', duration: '3:45', plays: '1.8M' },
                { name: 'Neon Dreams', duration: '5:01', plays: '1.5M' },
                { name: 'City Lights', duration: '4:28', plays: '1.2M' },
                { name: 'Golden Sunrise', duration: '3:56', plays: '3.1M' },
                { name: 'Golden Hour', duration: '4:15', plays: '2.9M' },
              ].map((track, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition">
                  <span className="w-6 text-center text-white/40">{i + 1}</span>
                  <Play size={16} className="text-white/40 hover:text-white cursor-pointer" />
                  <div className="flex-1">
                    <div className="font-medium">{track.name}</div>
                  </div>
                  <span className="text-white/40 text-sm">{track.duration}</span>
                  <span className="text-white/50 text-sm">{track.plays}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philanthropy */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Philanthropy</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <Heart className="mx-auto mb-4 text-rose-400" size={40} />
              <div className="text-2xl font-bold text-amber-400">200+</div>
              <div className="text-white/60">Students Supported</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <Award className="mx-auto mb-4 text-amber-400" size={40} />
              <div className="text-2xl font-bold text-amber-400">₩500M</div>
              <div className="text-white/60">Total Donated</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <Star className="mx-auto mb-4 text-amber-400" size={40} />
              <div className="text-2xl font-bold text-amber-400">50</div>
              <div className="text-white/60">Scholarships/Year</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <Users className="mx-auto mb-4 text-violet-400" size={40} />
              <div className="text-2xl font-bold text-amber-400">12</div>
              <div className="text-white/60">Partner Schools</div>
            </div>
          </div>
          <p className="text-center text-white/60 mt-8">Established the Lee Juhoo Foundation in 2022</p>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Official Shop</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-700/20 rounded-2xl p-6 border border-amber-500/30">
              <div className="text-amber-400 text-sm font-bold mb-2">LEGENDARY</div>
              <h3 className="font-bold mb-2">Midnight Dreams Ver.</h3>
              <p className="text-white/50 text-sm">Photo Card</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500/20 to-violet-700/20 rounded-2xl p-6 border border-violet-500/30">
              <div className="text-violet-400 text-sm font-bold mb-2">EPIC</div>
              <h3 className="font-bold mb-2">Golden Hour Ver.</h3>
              <p className="text-white/50 text-sm">Photo Card</p>
            </div>
            <div className="bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-2xl p-6 border border-slate-400/30">
              <div className="text-slate-300 text-sm font-bold mb-2">RARE</div>
              <h3 className="font-bold mb-2">Casual Look</h3>
              <p className="text-white/50 text-sm">Photo Card</p>
            </div>
            <div className="bg-gradient-to-br from-slate-600/20 to-slate-800/20 rounded-2xl p-6 border border-slate-500/30">
              <div className="text-slate-400 text-sm font-bold mb-2">COMMON</div>
              <h3 className="font-bold mb-2">Airport Fashion</h3>
              <p className="text-white/50 text-sm">Photo Card</p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg mb-4 flex items-center justify-center">
                <Disc size={48} className="text-white/30" />
              </div>
              <h3 className="font-semibold">Official T-Shirt</h3>
              <p className="text-amber-400 font-bold">₩45,000</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg mb-4 flex items-center justify-center">
                <Heart size={48} className="text-white/30" />
              </div>
              <h3 className="font-semibold">Hoodie</h3>
              <p className="text-amber-400 font-bold">₩85,000</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg mb-4 flex items-center justify-center">
                <Star size={48} className="text-white/30" />
              </div>
              <h3 className="font-semibold">Photo Book</h3>
              <p className="text-amber-400 font-bold">₩120,000</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg mb-4 flex items-center justify-center">
                <Award size={48} className="text-white/30" />
              </div>
              <h3 className="font-semibold">Light Stick</h3>
              <p className="text-amber-400 font-bold">₩65,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Career Timeline</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-amber-500 to-rose-500" />
            <div className="space-y-12">
              {[
                { year: '2018', title: 'Discovery', desc: 'Talent scout discovery, began training' },
                { year: '2019', title: 'Debut', desc: 'First management contract signed' },
                { year: '2021', title: 'Rising Star', desc: 'First leading role, gained recognition' },
                { year: '2022', title: 'Foundation', desc: 'Established charity foundation' },
                { year: '2024', title: 'Global Hit', desc: 'Midnight Dreams premiered internationally' },
                { year: '2026', title: 'Current', desc: 'Active filming, world tour announced' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1 text-right">
                    {i % 2 === 0 && <div className="bg-white/5 rounded-xl p-4 border border-white/10 inline-block">{item.title}<br /><span className="text-amber-400">{item.year}</span><br /><span className="text-white/50 text-sm">{item.desc}</span></div>}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-amber-500 z-10" />
                  <div className="flex-1">
                    {i % 2 !== 0 && <div className="bg-white/5 rounded-xl p-4 border border-white/10 inline-block">{item.title}<br /><span className="text-amber-400">{item.year}</span><br /><span className="text-white/50 text-sm">{item.desc}</span></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Upcoming Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">FILMING</span>
              <h3 className="text-xl font-bold mt-4 mb-2">Untitled Project A</h3>
              <p className="text-white/50 text-sm">Timeline: 2026</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">CONFIRMED</span>
              <h3 className="text-xl font-bold mt-4 mb-2">World Tour 2026</h3>
              <p className="text-white/50 text-sm">Timeline: Q4 2026</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">IN PRODUCTION</span>
              <h3 className="text-xl font-bold mt-4 mb-2">New Album</h3>
              <p className="text-white/50 text-sm">Timeline: 2027</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">LJ</h3>
              <p className="text-white/50">Authenticity in Every Frame</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-white/50">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#bio" className="hover:text-white transition">Biography</a></li>
                <li><a href="#filmography" className="hover:text-white transition">Filmography</a></li>
                <li><a href="#fashion" className="hover:text-white transition">Fashion</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-white/50">
                <li><a href="#" className="hover:text-white transition">Fan Club</a></li>
                <li><a href="#" className="hover:text-white transition">Events</a></li>
                <li><a href="#" className="hover:text-white transition">Forum</a></li>
                <li><a href="#" className="hover:text-white transition">Merchandise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-white/50">
                <li><a href="mailto:contact@leejuhoo.com" className="hover:text-white transition">contact@leejuhoo.com</a></li>
                <li><a href="#" className="hover:text-white transition">Press Inquiries</a></li>
                <li><a href="#" className="hover:text-white transition">Business</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/40">
            <p>© 2026 Lee Juhoo Official. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      {showTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition z-50">
          <ChevronUp size={24} className="text-white" />
        </button>
      )}
    </div>
  )
}

// ============ NEWS PAGE ============
function NewsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedRole, setSelectedRole] = useState('Editor-in-Chief')

  const liveHighlights = [
    { id: 1, text: 'Lee Juhoo wins Best Actor at Baeksang Arts Awards 2026', time: '2 min ago', hot: true },
    { id: 2, text: 'New album "Midnight Dreams" reaches 10M streams on Apple Music', time: '15 min ago', hot: true },
    { id: 3, text: 'Global fan meet tour 2026 dates officially announced', time: '1 hour ago', hot: false },
    { id: 4, text: 'Lee Juhoo appointed as luxury brand global ambassador', time: '3 hours ago', hot: false },
    { id: 5, text: 'Behind the scenes: "Midnight Dreams" music video shoot', time: '5 hours ago', hot: false },
  ]

  const kathyRoles = [
    { title: 'Editor-in-Chief', description: 'Leading all content creation, communications, and brand narrative.', icon: Star, color: '#fc3c44' },
    { title: 'Personal Manager', description: 'Coordinating schedules, projects, and priorities.', icon: Calendar, color: '#ff9500' },
    { title: 'Event Management Lead', description: 'Organizing and overseeing all events.', icon: Award, color: '#34c759' },
    { title: 'Fan Relations Manager', description: 'Building and nurturing the global fan community.', icon: Users, color: '#5856d6' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const response = await fetch('https://leejuhoo-server.onrender.com/api/confirm-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, role: selectedRole, message: formData.message })
      })
      if (!response.ok) throw new Error('Failed to send')
      setIsSubmitted(true)
      setTimeout(() => { setShowConfirmation(false); setIsSubmitted(false); setFormData({ name: '', email: '', message: '' }) }, 3000)
    } catch { setSubmitError('Failed to send. Please try again.') }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-24">
      <div className="px-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Official News</h1>
          <p className="text-white/60">Latest Updates & Announcements</p>
        </div>

        {/* Live Updates */}
        <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Live Updates</h3>
          </div>
          <div className="space-y-3">
            {liveHighlights.map((h) => (
              <div key={h.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                {h.hot && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">HOT</span>}
                <div className="flex-1">
                  <p className="text-white text-sm">{h.text}</p>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1"><Clock size={10} /> {h.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kathy Announcement */}
        <div className="bg-gradient-to-br from-[#fc3c44]/20 via-[#1c1c1e] to-[#ff9500]/20 rounded-3xl p-6 border border-[#fc3c44]/30">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fc3c44] to-[#ff9500] flex items-center justify-center">
              <Star size={40} className="text-white" />
            </div>
            <span className="px-4 py-1 bg-[#fc3c44] text-white text-xs font-bold rounded-full uppercase tracking-wider">Official Announcement</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2">The Appointment of Kathy Hutchison</h2>
            <p className="text-white/60 text-sm">A New Chapter in Lee Juhoo's Official Team</p>
          </div>
          <div className="bg-black/40 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-[#fc3c44] uppercase tracking-wider mb-2">Her Relationship to Lee Juhoo</h3>
            <p className="text-white/80 text-sm leading-relaxed">Kathy Hutchison has been an integral part of Lee Juhoo's journey, demonstrating exceptional dedication, insight, and passion for the artist's mission.</p>
          </div>
        </div>

        {/* Roles */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Award size={24} className="text-[#fc3c44]" />Kathy Hutchison's Official Roles</h3>
          <div className="grid gap-4">
            {kathyRoles.map((role, i) => (
              <div key={i} className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/[0.08]">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${role.color}20` }}>
                    <role.icon size={28} style={{ color: role.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">{role.title}</h4>
                    <p className="text-white/60 text-sm">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Importance */}
        <div className="bg-gradient-to-r from-[#fc3c44]/10 via-[#ff9500]/10 to-[#fc3c44]/10 rounded-2xl p-6 border border-[#fc3c44]/20">
          <h3 className="text-xl font-bold text-white mb-4">The Immense Importance of This Role</h3>
          <ul className="space-y-2">
            {['Strategic thinking and meticulous attention to detail', 'Exceptional communication and interpersonal abilities', 'Unwavering dedication to both the artist and fan community'].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70 text-sm"><Check size={16} className="text-[#34c759] mt-0.5 flex-shrink-0" />{item}</li>
            ))}
          </ul>
        </div>

        {/* Confirm Button */}
        <div className="text-center">
          <button onClick={() => setShowConfirmation(true)} className="px-8 py-4 bg-gradient-to-r from-[#fc3c44] to-[#ff9500] rounded-full text-white font-bold text-lg flex items-center gap-3 mx-auto hover:opacity-90 transition">
            <Mail size={20} /> Confirm & Accept This Role
          </button>
        </div>
      </div>

      {/* Modal */}
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
                </div>
                {submitError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl"><p className="text-red-400 text-sm text-center">{submitError}</p></div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none" />
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full bg-white/10 rounded-xl px-4 py-3 text-white focus:outline-none">
                    {kathyRoles.map((r) => <option key={r.title} value={r.title} style={{ background: '#1c1c1e' }}>{r.title}</option>)}
                  </select>
                  <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Message (Optional)" rows={3} className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none resize-none" />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setShowConfirmation(false); setSubmitError(''); }} className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white/70 font-medium">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#fc3c44] to-[#ff9500] rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <><Send size={16} /> Submit</>}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#34c759]/20 flex items-center justify-center"><Check size={40} className="text-[#34c759]" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirmation Sent!</h3>
                <p className="text-white/60 text-sm">Your role confirmation has been sent to the team.</p>
              </div>
            )}
          </div>
        </div>
      )}
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
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicKitPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
