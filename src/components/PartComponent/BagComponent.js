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
      {filter === "all" && <h4> {t("banner.allBag")}</h4>}
      {filter === "large-bag" && <h4>{t("banner.large-bag")}</h4>}
      {filter === "medium-bag" && <h4>{t("banner.medium-bag")}</h4>}
      {filter === "small-bag" && <h4>{t("banner.small-bag")}</h4>}

      <ProductShowing
        keyword={filter === "all" ? null : filter}
        categoryId={categoryId}
      />
    </div>
  );
};

export default SandalComponent;
