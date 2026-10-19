import abdullahPortrait from '../assets/Abdullah.jpg'
import ethanPortrait from '../assets/Ethan.jpg'
import joshPortrait from '../assets/Josh.jpeg'

const executives = [
  {
    name: 'Josh Wang',
    portrait: joshPortrait,
    bio: 'MSc CS student at Ohio State, experienced in data-driven solutions and enterprise web applications, and a long-time fan of strategy and roguelike games.',
  },
  {
    name: 'Ethan Boes',
    portrait: ethanPortrait,
    bio: 'Fourth-year student at Ohio State with an upcoming role at Deloitte who enjoys playing sports video games.',
  },
  {
    name: 'Abdullah Alyassary',
    portrait: abdullahPortrait,
    bio: 'Fourth-year undergraduate at Ohio State University with six years of experience in the IT industry, and a video game fan since age four.',
  },
]

function ExecutiveProfile({ name, portrait, bio }) {
  return (
    <article className="executive-profile-card">
      <div className="executive-portrait-placeholder">
        <img src={portrait} alt={name} />
      </div>
      <div className="executive-profile-details">
        <h3>{name}</h3>
        <dl className="executive-profile-fields">
          <div className="executive-profile-field">
            <dt>Job title</dt>
            <dd>Founder</dd>
          </div>
          <div className="executive-profile-field">
            <dt>Education</dt>
            <dd>Ohio State University</dd>
          </div>
        </dl>
        <p className="executive-profile-bio">{bio}</p>
      </div>
    </article>
  )
}

export default function AboutUs() {
  return (
    <main className="site-main about-page">
      <section className="about-intro">
        <div className="site-container about-intro-inner">
          <p className="about-eyebrow">The story behind Relic Plaza</p>
          <h1>Wear the worlds you love.</h1>
          <p className="about-intro-copy">
            We make gaming-inspired apparel for the moments beyond the screen:
            comfortable, considered pieces made for players to show what they love.
          </p>
          <a className="about-text-link" href="#our-strategy">
            How we plan to grow <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <div className="site-container about-content">
        <section className="about-purpose-grid" aria-label="Our purpose">
          <article className="about-purpose-card about-mission-card">
            <p className="about-eyebrow">Why we exist</p>
            <h2>Our Mission</h2>
            <p>
              To let gamers wear the worlds they love, with comfortable,
              well-made apparel that feels like a power-up.
            </p>
          </article>
          <article className="about-purpose-card about-vision-card">
            <p className="about-eyebrow">Where we&apos;re going</p>
            <h2>Our Vision</h2>
            <p>
              To be the go-to destination where every gamer finds gear that
              shows who they are, on and off the screen.
            </p>
          </article>
        </section>

        <section className="about-strategy" id="our-strategy">
          <div className="about-section-heading">
            <p className="about-eyebrow">Built for lasting connection</p>
            <h2>Our Strategy</h2>
          </div>
          <div className="about-strategy-copy">
            <p>
              Relic Plaza&apos;s strategy is to become the destination for gamers
              who want to wear the worlds they love. We focus on high-quality
              apparel, including hoodies, hats, and tees, inspired by the most
              popular game communities, and we build each piece to be
              comfortable and durable enough for everyday wear.
            </p>
            <p>
              To keep our community excited, we release limited-edition drops
              timed to game launches and seasonal events, so every release
              feels like finding a rare item. We strengthen customer loyalty
              through community-driven initiatives such as fan art contests
              and collaborations with gamer designers, and we keep our prices
              accessible for students and young gamers. By pairing quality,
              scarcity, and community, Relic Plaza aims to grow from a passion
              project into a trusted brand in gaming apparel.
            </p>
          </div>
          <ul className="about-strategy-pillars" aria-label="Strategic priorities">
            <li><span>1</span> Quality for everyday wear</li>
            <li><span>2</span> Limited drops with meaning</li>
            <li><span>3</span> Community-led loyalty</li>
            <li><span>4</span> Accessible pricing</li>
          </ul>
        </section>

        <section className="about-executives">
          <div className="about-section-heading">
            <p className="about-eyebrow">The people behind the plaza</p>
            <h2>Meet our Executives</h2>
          </div>
          <div className="executive-profile-grid">
            {executives.map((executive) => (
              <ExecutiveProfile key={executive.name} {...executive} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
