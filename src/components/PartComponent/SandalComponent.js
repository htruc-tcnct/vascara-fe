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
      {filter === "all" && <h4> {t("banner.allPro")}</h4>}
      {filter === "sandal" && <h4>{t("banner.sandal")}</h4>}
      {filter === "sneaker" && <h4>{t("banner.sneaker")}</h4>}

      <ProductShowing
        keyword={filter === "all" ? null : filter}
        categoryId={categoryId}
      />
    </div>
  );
};

export default SandalComponent;
