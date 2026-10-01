
import "./HeroBanner.css";

function HeroBanner() {
  return (
    <section className="hero-banner d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-9 col-lg-7">

            <p className="hero-subtitle mb-3">
              Big Deals. Big Savings.
            </p>

            <h1 className="hero-title mb-3">
              Shop Smart,
              <br />
              <span>Shop Better</span>
            </h1>

            <p className="hero-description mb-4">
              Discover the latest products at amazing prices.
            </p>

            <a
              href="#categories"
              className="btn btn-warning hero-shop-btn fw-bold px-4 py-3"
            >
              Shop Now
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;

