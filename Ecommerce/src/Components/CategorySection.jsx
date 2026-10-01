
import { Link } from "react-router-dom";
import "./CategorySection.css";

function CategorySection() {
  const categories = [
    "Mobiles",
    "Fashion",
    "Electronics",
    "Home & Kitchen",
    "Beauty",
    "Grocery",
  ];

  return (
    <section className="category-section py-5" id="categories">
      <div className="container">

        {/* Section Title */}
        <div className="text-center mb-5">
          <p className="category-subtitle">
            Explore Our Collection
          </p>

          <h2 className="category-title">
            Shop by <span>Category</span>
          </h2>
        </div>

        {/* Category Cards */}
        <div className="row g-4 justify-content-center">
          {categories.map((category) => {
            const categoryPath = category
              .toLowerCase()
              .replace(/ & /g, "-")
              .replace(/\s+/g, "-");

            return (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-4"
                key={category}
              >
                <div className="category-card h-100 d-flex flex-column justify-content-between">

                  <div>
                    <div className="category-icon">
                      {category === "Mobiles" && "📱"}
                      {category === "Fashion" && "👕"}
                      {category === "Electronics" && "💻"}
                      {category === "Home & Kitchen" && "🏠"}
                      {category === "Beauty" && "💄"}
                      {category === "Grocery" && "🛒"}
                    </div>

                    <h3>{category}</h3>
                  </div>

                  <Link
                    to={`/category/${categoryPath}`}
                    className="btn btn-outline-warning category-btn"
                  >
                    Explore
                  </Link>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default CategorySection;

