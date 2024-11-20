import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";
import ProductShowing from "../NewProduct/Product-Showing";
import { useTranslation } from "react-i18next";

const WallComponent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter") || "hand"; // Default to "all" if undefined
  const categoryId = 2;
  return (
    <div>
      <div className="ms-4 mt-3">
        <a href="/">{t("new_arrivals")}</a> -{" "}
        {filter === "all" && <a href=""> {t("banner.allWall")}</a>}
        {filter === "hand" && <a href="">{t("banner.hand-wall")}</a>}
        {filter === "mini" && <a href="">{t("banner.mini-wall")}</a>}
        {filter === "leather" && <a href="">{t("banner.leather-wall")}</a>}
      </div>

      <ProductShowing
        keyword={filter === "all" ? null : filter}
        categoryId={categoryId}
      />
    </div>
  );
};

export default WallComponent;
