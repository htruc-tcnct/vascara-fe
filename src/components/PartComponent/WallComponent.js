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
      {filter === "all" && <h4> {t("banner.allWall")}</h4>}
      {filter === "hand" && <h4>{t("banner.hand-wall")}</h4>}
      {filter === "mini" && <h4>{t("banner.mini-wall")}</h4>}
      {filter === "leather" && <h4>{t("banner.leather-wall")}</h4>}

      <ProductShowing
        keyword={filter === "all" ? null : filter}
        categoryId={categoryId}
      />
    </div>
  );
};

export default WallComponent;
