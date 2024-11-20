import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";
import ProductShowing from "../NewProduct/Product-Showing";
import { useTranslation } from "react-i18next";

const SandalComponent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter") || "sneaker"; // Default to "all" if undefined
  const categoryId = 1;
  return (
    <div>
      <div className="ms-4 mt-3">
        <a href="/">{t("new_arrivals")}</a> -{" "}
        {filter === "all" && <a href="/"> {t("banner.allPro")}</a>}
        {filter === "sandal" && <a href="/">{t("banner.sandal")}</a>}
        {filter === "sneaker" && <a href="/">{t("banner.sneaker")}</a>}
      </div>

      <ProductShowing
        keyword={filter === "all" ? null : filter}
        categoryId={categoryId}
      />
    </div>
  );
};

export default SandalComponent;
