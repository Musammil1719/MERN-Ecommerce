
import "./CategoryMenu.css";

function CategoryMenu() {
  const categories = [
    "Mobiles",
    "Fashion",
    "Electronics",
    "Home",
    "Beauty",
    "Grocery",
  ];

  return (
    <div className="category-menu bg-black border-bottom border-secondary">
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center gap-2 gap-md-4 py-2 flex-wrap">
          {categories.map((category) => (
            <div
              className="category-item px-3 py-2"
              key={category}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryMenu;

