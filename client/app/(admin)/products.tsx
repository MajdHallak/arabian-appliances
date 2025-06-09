import React from "react";
import GuestProductsScreen from "../(public)/guest-products";

const logoutLogo = require("../../assets/logout-png.png");

const AdminProducts = () => {
  return <GuestProductsScreen backButton={logoutLogo} />;
};

export default AdminProducts;
