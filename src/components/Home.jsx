import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCart, useInventorySync } from '../context/CartContext'

import animalCrossingIcon from '../assets/game_icons/animal_crossing_icon.webp'
import stardewValleyIcon from '../assets/game_icons/stardew_valley_icon.png'
import hollowKnightIcon from '../assets/game_icons/hollow_knight_icon.png'
import tftIcon from '../assets/game_icons/Teamfight_Tactics_icon.webp'
import pokemonIcon from '../assets/game_icons/pokemon_icon.webp'
import slayTheSpireIcon from '../assets/game_icons/slay_the_spire_icon.webp'
import finalFantasyIcon from '../assets/game_icons/final_fantasy_icon.svg'

const valuePillars = [
  {
    num: '01',
    title: 'Tactile & Minimal',
    description: 'Everyday apparel and accessories free of loud branding, crafted with considered textures and quiet detail.',
  },
  {
    num: '02',
    title: 'Indie at Heart',
    description: 'Celebrating games with soul and enduring artistry: from farmstead life-sims to deep atmospheric roguelikes.',
  },
  {
    num: '03',
    title: 'Ethical & Durable',
    description: 'Produced in limited batches with durable materials, built for long sessions and years of everyday wear.',
  },
]

const featuredGames = [
  { id: 'animal-crossing', title: 'Animal Crossing', logo: animalCrossingIcon },
  { id: 'stardew-valley', title: 'Stardew Valley', logo: stardewValleyIcon },
  { id: 'hollow-knight', title: 'Hollow Knight', logo: hollowKnightIcon },
  { id: 'teamfight-tactics', title: 'Teamfight Tactics', logo: tftIcon },
  { id: 'pokemon', title: 'Pokémon', logo: pokemonIcon },
  { id: 'slay-the-spire', title: 'Slay the Spire', logo: slayTheSpireIcon },
  { id: 'final-fantasy', title: 'Final Fantasy', logo: finalFantasyIcon },
]

export default function Home() {
  useInventorySync()
  const { items, inventoryStatus, inventoryError } = useCart()
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselStageRef = useRef(null)
  const touchStartX = useRef(null)

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % featuredGames.length)
  }, [])

  // Wheel / Trackpad scroll listener with debounce lock
  useEffect(() => {
    const el = carouselStageRef.current
    if (!el) return

    let cooling = false
    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) > 18) {
        e.preventDefault()
        if (!cooling) {
          cooling = true
          if (delta > 0) {
            handleNext()
          } else {
            handlePrev()
          }
          setTimeout(() => {
            cooling = false
          }, 360)
        }
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [handleNext, handlePrev])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartX.current = null
  }

  return (
    <main className="site-main home-page">
      <div className="site-container">
        {/* 1. Hero Banner (Mishmash Signature Editorial) */}
        <section className="editorial-hero">
          <div className="hero-card home-hero-card">
            <div className="hero-content">
              <div className="hero-sticker">
                <span>✦</span>
                <span>The Indie Revision · 2026 Collection</span>
              </div>
              <h1 className="hero-title">Artifacts & essentials for the quiet hours.</h1>
              <p className="hero-subtitle">
                A design-led shopping platform shifting from loud gaming apparel to tactile indie collectibles,
                desk trinkets, and minimalist wear—from rib-knit beanies and scarves to enamel keychains and keepsake pins.
              </p>
              <div className="hero-actions-row">
                <Link to="/purchase" className="hero-cta-btn">
                  <span>Explore The Catalog</span>
                  <span aria-hidden="true">&darr;</span>
                </Link>
                <Link to="/about-us" className="hero-secondary-btn">
                  <span>Our Story & Philosophy</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="hero-shapes" aria-hidden="true">
              <div className="shape-circle" />
              <div className="shape-circle yellow" />
              <div className="shape-circle teal" />
            </div>
          </div>
        </section>

        {/* 2. Value Pillars Strip (Mishmash 3-Column Bar) */}
        <section className="home-pillars-strip" aria-label="Brand Pillars">
          <div className="home-pillars-grid">
            {valuePillars.map((pillar) => (
              <div key={pillar.num} className="home-pillar-item">
                <span className="home-pillar-num">{pillar.num}</span>
                <div className="home-pillar-text">
                  <h3 className="home-pillar-title">{pillar.title}</h3>
                  <p className="home-pillar-desc">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. The Line-up / Live Catalog Grid Teaser */}
        <section className="home-catalog-teaser" id="catalog-preview">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Current Plaza</p>
              <h2 className="section-title">The Relics</h2>
              <p className="section-tagline">
                Showing 3 curated staples from our collection
              </p>
            </div>
            <Link to="/purchase" className="home-header-link">
              <span>View full catalog ({items.length})</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="home-preview-grid">
            {inventoryStatus === 'loading' && items.length === 0 ? (
              <p role="status" className="inventory-loading-text">Loading catalog preview...</p>
            ) : inventoryStatus === 'error' && items.length === 0 ? (
              <p role="alert" className="inventory-error-text">Unable to load catalog: {inventoryError}</p>
            ) : (
              items.slice(0, 3).map((item) => (
                <article key={item.id} className="home-preview-card">
                  <Link to="/purchase" className="home-preview-image-wrapper">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="home-preview-image"
                      />
                    ) : (
                      <div
                        className="home-preview-image-fallback"
                        aria-label="No image"
                      />
                    )}
                  </Link>

                  <div className="home-preview-bottom">
                    <h3 className="home-preview-name">
                      <Link to="/purchase">{item.name}</Link>
                    </h3>
                    <Link to="/purchase" className="home-preview-action-btn" aria-label={`View ${item.name} in catalog`}>
                      <span>View in Catalog</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* 4. Short Branding Wordage (Mishmash Editorial Manifesto) */}
        <section className="home-branding-callout" aria-label="Brand Philosophy">
          <div className="home-branding-inner">
            <div className="home-branding-content">
              <p className="home-branding-eyebrow">✦ The Relic Philosophy</p>
              <h2 className="home-branding-title">
                Understated relics for the games that stayed with you.
              </h2>
              <p className="home-branding-copy">
                We believe gaming merchandise should feel like a cherished keepsake rather than a billboard.
                From indie-focused collectibles and tactile desk trinkets to understated rib-knit beanies, scarves,
                and enamel keychains—every piece is designed for everyday comfort and the quiet moments
                between play.
              </p>
              <Link to="/about-us" className="home-branding-link">
                <span>Meet the Team & Our Strategy</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Worlds We Celebrate — Stylized 3-Card Scrollable Carousel */}
        <section className="home-games-section" aria-label="Featured Games">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Featured Games</p>
              <h2 className="section-title">Worlds We Celebrate</h2>
              <p className="section-tagline">
                Curated collections inspired by our favorite worlds
              </p>
            </div>
            <Link to="/purchase" className="home-header-link">
              <span>Browse All Collections</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="worlds-carousel-container">
            {/* Nav Arrows */}
            <button
              type="button"
              className="carousel-nav-btn prev"
              onClick={handlePrev}
              aria-label="Previous game"
            >
              <span aria-hidden="true">&larr;</span>
            </button>

            <button
              type="button"
              className="carousel-nav-btn next"
              onClick={handleNext}
              aria-label="Next game"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>

            {/* 3-Card Viewport Stage */}
            <div
              ref={carouselStageRef}
              className="worlds-carousel-stage"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-label="Game Worlds Carousel"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') handlePrev()
                if (e.key === 'ArrowRight') handleNext()
              }}
            >
              {featuredGames.map((game, i) => {
                const N = featuredGames.length
                let diff = i - activeIndex
                if (diff > Math.floor(N / 2)) diff -= N
                if (diff < -Math.floor(N / 2)) diff += N

                const isCenter = diff === 0
                const isLeft = diff === -1
                const isRight = diff === 1

                let translateX = 0
                if (isCenter) translateX = 0
                else if (isLeft) translateX = -108
                else if (isRight) translateX = 108
                else if (diff < -1) translateX = diff * 108
                else if (diff > 1) translateX = diff * 108

                const cardStyle = {
                  transform: `translateX(${translateX}%) scale(${isCenter ? 1.08 : 0.92})`,
                  opacity: isCenter ? 1 : isLeft || isRight ? 0.45 : 0,
                  zIndex: isCenter ? 10 : isLeft || isRight ? 5 : 0,
                  pointerEvents: isCenter || isLeft || isRight ? 'auto' : 'none',
                  visibility: Math.abs(diff) <= 2 ? 'visible' : 'hidden',
                }

                return (
                  <div
                    key={game.id}
                    className={`stylized-game-card ${isCenter ? 'card-center' : isLeft ? 'card-side card-left' : isRight ? 'card-side card-right' : 'card-hidden'}`}
                    style={cardStyle}
                    onClick={() => {
                      if (isLeft) handlePrev()
                      else if (isRight) handleNext()
                    }}
                  >
                    {isCenter ? (
                      <Link
                        to="/purchase"
                        className="stylized-card-inner"
                        aria-label={`View ${game.title} relics in catalog`}
                      >
                        <div className="stylized-card-frame">
                          <img
                            src={game.logo}
                            alt={`${game.title} logo`}
                            className="stylized-card-logo"
                          />
                          <span className="stylized-card-hover-title">{game.title}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="stylized-card-inner">
                        <div className="stylized-card-frame">
                          <img
                            src={game.logo}
                            alt={`${game.title} logo`}
                            className="stylized-card-logo"
                          />
                          <span className="stylized-card-hover-title">{game.title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pagination Dots */}
            <div className="carousel-indicators" role="tablist" aria-label="Game slides">
              {featuredGames.map((game, idx) => (
                <button
                  key={game.id}
                  type="button"
                  className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Go to ${game.title}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
