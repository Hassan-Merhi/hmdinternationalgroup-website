import { Link } from "react-router-dom";

export function VisionPage() {
  return (
    <div className="inner-page narrative-page">
      <section className="page-hero vision-hero">
        <p className="eyebrow light">Vision & mission</p>
        <h1>Grow through trusted relationships, strong execution and the right markets.</h1>
      </section>
      <section className="vision-grid section-pad">
        <article>
          <p className="eyebrow">Our vision</p>
          <h2>To build a respected Lebanon-based group with enduring commercial reach across international markets.</h2>
        </article>
        <article>
          <p className="eyebrow">Our mission</p>
          <h2>To connect customers, suppliers and operating companies through dependable trade, sourcing and export relationships.</h2>
        </article>
      </section>
      <section className="principles-strip section-pad section-warm">
        <div><span>01</span><strong>Think long term</strong><p>Build relationships that remain valuable beyond a single transaction.</p></div>
        <div><span>02</span><strong>Stay practical</strong><p>Focus on solutions that work in the real commercial environment.</p></div>
        <div><span>03</span><strong>Move with the market</strong><p>Remain flexible enough to respond to changing customer and market needs.</p></div>
      </section>
      <section className="page-next section-pad">
        <p>Explore</p><Link to="/what-we-do">What we do <span>↗</span></Link>
      </section>
    </div>
  );
}
