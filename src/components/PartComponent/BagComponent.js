import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";
import ProductShowing from "../NewProduct/Product-Showing";
import { useTranslation } from "react-i18next";

const SandalComponent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter") || "large-bag"; // Default to "all" if undefined
  const categoryId = 3;
  return (
    <div>
      <div className="ms-4 mt-3">
        <a href="/">{t("new_arrivals")}</a> -{" "}
        {filter === "all" && <a href="/"> {t("banner.allBag")}</a>}
        {filter === "large-bag" && <a href="/">{t("banner.large-bag")}</a>}
        {filter === "medium-bag" && <a href="/">{t("banner.medium-bag")}</a>}
        {filter === "small-bag" && <a href="/">{t("banner.small-bag")}</a>}
      </div>

      <ProductShowing
        keyword={filter === "all" ? null : filter}
        categoryId={categoryId}
      />
    </div>
  );
};

export default SandalComponent;
